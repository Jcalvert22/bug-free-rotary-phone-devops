import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));

const EQUIPMENT_LIST = [
  'Dumbbells',
  'Barbell',
  'Bench',
  'Pull-up Bar',
  'Kettlebell',
  'Resistance Bands',
  'Treadmill',
  'Stationary Bike',
  'Bodyweight Only'
];

const MUSCLE_GROUPS = [
  'Chest',
  'Upper Chest',
  'Triceps',
  'Biceps',
  'Forearms',
  'Back',
  'Traps',
  'Quads',
  'Calves',
  'Hamstrings'
];

const EXERCISES = [
  { name: "Push-up", equipment: ["Bodyweight"], muscle_group: "Chest" },
  { name: "Incline Push-up", equipment: ["Bodyweight", "Bench"], muscle_group: "Upper Chest" },
  { name: "Triceps Dip", equipment: ["Bodyweight", "Bench"], muscle_group: "Triceps" },
  { name: "Bicep Curl", equipment: ["Dumbbells", "Barbell", "Resistance Bands"], muscle_group: "Biceps" },
  { name: "Wrist Curl", equipment: ["Dumbbells", "Barbell"], muscle_group: "Forearms" },
  { name: "Pull-up", equipment: ["Pull-up Bar"], muscle_group: "Back" },
  { name: "Shrug", equipment: ["Dumbbells", "Barbell"], muscle_group: "Traps" },
  { name: "Squat", equipment: ["Bodyweight", "Barbell", "Dumbbells"], muscle_group: "Quads" },
  { name: "Calf Raise", equipment: ["Bodyweight", "Dumbbells"], muscle_group: "Calves" },
  { name: "Hamstring Curl", equipment: ["Resistance Bands"], muscle_group: "Hamstrings" },
  { name: "Bench Press", equipment: ["Barbell", "Bench", "Dumbbells"], muscle_group: "Chest" },
  { name: "Deadlift", equipment: ["Barbell", "Dumbbells"], muscle_group: "Back" }
];

app.get('/', (req, res) => {
  const equipmentOptions = EQUIPMENT_LIST.map(eq => `<label><input type="checkbox" name="equipment" value="${eq}"> ${eq}</label><br>`).join('');
  const muscleOptions = MUSCLE_GROUPS.map(mg => `<label><input type="checkbox" name="muscle" value="${mg}"> ${mg}</label><br>`).join('');
  res.send(`
    <h1>Starter Gym Planner123</h1>
    <form method="POST" action="/plan">
      <p>Select the equipment you have access to:</p>
      ${equipmentOptions}
      <hr>
      <p>Select the muscle groups you want to hit:</p>
      ${muscleOptions}
      <hr>
      <p>
        <label>
          <input type="radio" name="mode" value="dieting" checked> Dieting (High reps, low weight)
        </label>
        <label>
          <input type="radio" name="mode" value="bulking"> Bulking (Low reps, high weight)
        </label>
      </p>
      <hr>
      <p>
        <label>Bench Press Max (lbs): <input type="number" name="bench_max" min="0" step="1" required></label><br>
        <label>Squat Max (lbs): <input type="number" name="squat_max" min="0" step="1" required></label><br>
        <label>Deadlift Max (lbs): <input type="number" name="deadlift_max" min="0" step="1" required></label>
      </p>
      <hr>
      <p>
        <label>Recommended % of Max Weight: 
          <input type="range" name="percent" min="50" max="90" value="70" oninput="document.getElementById('percentVal').innerText = this.value">
          <span id="percentVal">70</span>%
        </label>
      </p>
      <button type="submit">Build My Plan</button>
    </form>
    <script>
      document.querySelector('input[type="range"]').addEventListener('input', function() {
        document.getElementById('percentVal').innerText = this.value;
      });
    </script>
  `);
});

app.post('/plan', (req, res) => {
  let selected = req.body.equipment;
  let selectedMuscles = req.body.muscle;
  let mode = req.body.mode || 'dieting';
  let benchMax = parseFloat(req.body.bench_max) || 0;
  let squatMax = parseFloat(req.body.squat_max) || 0;
  let deadliftMax = parseFloat(req.body.deadlift_max) || 0;
  let percent = parseFloat(req.body.percent) || 70;

  if (!selected) selected = [];
  if (!Array.isArray(selected)) selected = [selected];
  if (!selectedMuscles) selectedMuscles = [];
  if (!Array.isArray(selectedMuscles)) selectedMuscles = [selectedMuscles];

  const repRange = mode === 'bulking' ? '4-8 reps, heavy weight' : '12-20 reps, light/moderate weight';

  function getRecommendedWeight(ex) {
    let max = 0;
    if (ex.name.toLowerCase().includes('bench')) max = benchMax;
    else if (ex.name.toLowerCase().includes('squat')) max = squatMax;
    else if (ex.name.toLowerCase().includes('deadlift')) max = deadliftMax;
    else if (ex.equipment.includes('Barbell') && ex.muscle_group === 'Chest') max = benchMax;
    else if (ex.equipment.includes('Barbell') && ex.muscle_group === 'Quads') max = squatMax;
    else if (ex.equipment.includes('Barbell') && ex.muscle_group === 'Back') max = deadliftMax;
    if (max > 0) {
      return `${Math.round(max * percent / 100)} lbs (${percent}% of max)`;
    }
    return 'Bodyweight or moderate weight';
  }

  const plan = EXERCISES.filter(ex =>
    ex.equipment.some(eq => selected.includes(eq) || (eq === "Bodyweight" && selected.includes("Bodyweight Only"))) &&
    selectedMuscles.includes(ex.muscle_group)
  );
  const planHtml = plan.length
    ? `<ul>${plan.map(ex => `<li>${ex.name} (${ex.equipment.join(', ')}) - ${ex.muscle_group} <br>
      <strong>Recommended: ${repRange}</strong><br>
      <strong>Recommended Weight: ${getRecommendedWeight(ex)}</strong>
      </li>`).join('')}</ul>`
    : '<p>No workouts available for selected equipment and muscle group.</p>';
  res.send(`
    <h1>Your Custom Gym Plan</h1>
    <p>Based on your equipment, muscle group(s), and goal (${mode === 'bulking' ? 'Bulking' : 'Dieting'}):</p>
    ${planHtml}
    <a href="/">Back</a>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
