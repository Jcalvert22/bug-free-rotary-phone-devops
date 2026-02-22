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
  const equipmentOptions = EQUIPMENT_LIST.map(eq => `<label class="option"><input type="checkbox" name="equipment" value="${eq}"> ${eq}</label>`).join('');
  const muscleOptions = MUSCLE_GROUPS.map(mg => `<label class="option"><input type="checkbox" name="muscle" value="${mg}"> ${mg}</label>`).join('');
  res.send(`
    <html>
    <head>
      <title>GymTravel - Starter Gym Planner</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { background: #181a1b; color: #f3f3f3; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; }
        .header { width: 100%; background: #232526; color: #4f8cff; font-size: 1.5em; font-weight: 700; padding: 18px 0; text-align: center; letter-spacing: 2px; box-shadow: 0 2px 8px #0004; }
        .container { max-width: 420px; margin: 40px auto; background: #232526; border-radius: 12px; box-shadow: 0 4px 24px #000a; padding: 32px 28px 24px 28px; }
        h1 { font-size: 1.7em; font-weight: 600; margin-bottom: 18px; letter-spacing: 1px; }
        hr { border: none; border-top: 1px solid #333; margin: 18px 0; }
        .option { display: block; margin: 7px 0; font-size: 1em; cursor: pointer; }
        input[type="checkbox"], input[type="radio"] { accent-color: #4f8cff; margin-right: 8px; }
        input[type="number"], input[type="range"] { background: #232526; color: #f3f3f3; border: 1px solid #333; border-radius: 5px; padding: 5px 8px; margin: 4px 0 10px 0; width: 80px; }
        input[type="range"] { width: 120px; }
        .max-disabled { background: #232526 !important; color: #888 !important; border-color: #444 !important; }
        .max-label-disabled { color: #888 !important; }
        button { background: #4f8cff; color: #fff; border: none; border-radius: 6px; padding: 10px 22px; font-size: 1em; font-weight: 500; cursor: pointer; margin-top: 18px; transition: background 0.2s; }
        button:hover { background: #2563eb; }
        label { user-select: none; }
        @media (max-width: 600px) { .container { padding: 18px 6vw; } }
      </style>
    </head>
    <body>
      <div class="header">GymTravel</div>
      <div class="container">
        <h1>Starter Gym Planner</h1>
        <form method="POST" action="/plan">
          <p style="margin-bottom:8px;">Equipment:</p>
          ${equipmentOptions}
          <hr>
          <p style="margin-bottom:8px;">Muscle Groups:</p>
          ${muscleOptions}
          <hr>
          <div style="margin-bottom:12px;">
            <label class="option"><input type="radio" name="mode" value="dieting" checked> Dieting (High reps, low weight)</label>
            <label class="option"><input type="radio" name="mode" value="bulking"> Bulking (Low reps, high weight)</label>
          </div>
          <hr>
          <div style="margin-bottom:12px;">
            <label class="option"><input type="checkbox" id="noMax" name="no_max"> I don't know my max weights</label>
            <div id="maxInputs">
              <label class="max-label" id="benchLabel">Bench Press Max (lbs): <input type="number" class="max-input" name="bench_max" min="0" step="1" required></label><br>
              <label class="max-label" id="squatLabel">Squat Max (lbs): <input type="number" class="max-input" name="squat_max" min="0" step="1" required></label><br>
              <label class="max-label" id="deadliftLabel">Deadlift Max (lbs): <input type="number" class="max-input" name="deadlift_max" min="0" step="1" required></label>
            </div>
          </div>
          <hr>
          <div style="margin-bottom:12px;">
            <label class="max-label" id="percentLabel">Recommended % of Max Weight: 
              <input type="range" class="max-input" name="percent" min="50" max="90" value="70" oninput="document.getElementById('percentVal').innerText = this.value">
              <span id="percentVal">70</span>%
            </label>
          </div>
          <button type="submit">Build My Plan</button>
        </form>
      </div>
      <script>
        document.querySelector('input[type="range"]').addEventListener('input', function() {
          document.getElementById('percentVal').innerText = this.value;
        });
        document.getElementById('noMax').addEventListener('change', function() {
          const disabled = this.checked;
          document.querySelectorAll('.max-input').forEach(inp => {
            inp.disabled = disabled;
            inp.required = !disabled;
            inp.classList.toggle('max-disabled', disabled);
          });
          document.querySelectorAll('.max-label').forEach(lbl => {
            lbl.classList.toggle('max-label-disabled', disabled);
          });
          document.getElementById('percentLabel').classList.toggle('max-label-disabled', disabled);
        });
      </script>
    </body>
    </html>
  `);
});

app.post('/plan', (req, res) => {
  let selected = req.body.equipment;
  let selectedMuscles = req.body.muscle;
  let mode = req.body.mode || 'dieting';
  let percent = parseFloat(req.body.percent) || 70;
  const noMax = req.body.no_max === 'on';

  let benchMax = noMax ? 0 : parseFloat(req.body.bench_max) || 0;
  let squatMax = noMax ? 0 : parseFloat(req.body.squat_max) || 0;
  let deadliftMax = noMax ? 0 : parseFloat(req.body.deadlift_max) || 0;

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
    if (noMax || max === 0) {
      return 'Bodyweight or moderate weight';
    }
    return `${Math.round(max * percent / 100)} lbs (${percent}% of max)`;
  }

  const plan = EXERCISES.filter(ex =>
    ex.equipment.some(eq => selected.includes(eq) || (eq === "Bodyweight" && selected.includes("Bodyweight Only"))) &&
    selectedMuscles.includes(ex.muscle_group)
  );

  const planTable = plan.length
    ? `
      <table class="plan-table">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Equipment</th>
            <th>Muscle Group</th>
            <th>Rep Range</th>
            <th>Recommended Weight</th>
          </tr>
        </thead>
        <tbody>
          ${plan.map(ex => `
            <tr>
              <td>${ex.name}</td>
              <td>${ex.equipment.join(', ')}</td>
              <td>${ex.muscle_group}</td>
              <td>${repRange}</td>
              <td>${getRecommendedWeight(ex)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
    : '<p>No workouts available for selected equipment and muscle group.</p>';

  res.send(`
    <html>
    <head>
      <title>Your Custom Gym Plan</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { background: #181a1b; color: #f3f3f3; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; }
        .header { width: 100%; background: #232526; color: #4f8cff; font-size: 1.5em; font-weight: 700; padding: 18px 0; text-align: center; letter-spacing: 2px; box-shadow: 0 2px 8px #0004; }
        .container { max-width: 600px; margin: 40px auto; background: #232526; border-radius: 12px; box-shadow: 0 4px 24px #000a; padding: 32px 28px 24px 28px; }
        h1 { font-size: 1.7em; font-weight: 600; margin-bottom: 18px; letter-spacing: 1px; }
        button, a.button { background: #4f8cff; color: #fff; border: none; border-radius: 6px; padding: 10px 22px; font-size: 1em; font-weight: 500; cursor: pointer; margin-top: 18px; transition: background 0.2s; text-decoration: none; display: inline-block; }
        button:hover, a.button:hover { background: #2563eb; }
        a { color: #4f8cff; text-decoration: none; font-weight: 500; }
        a:hover { text-decoration: underline; }
        .plan-table { width: 100%; border-collapse: collapse; margin-top: 18px; background: #232526; border-radius: 8px; overflow: hidden; }
        .plan-table th, .plan-table td { padding: 12px 8px; text-align: left; }
        .plan-table th { background: #181a1b; color: #4f8cff; border-bottom: 2px solid #333; }
        .plan-table tr { border-bottom: 1px solid #333; }
        .plan-table tr:last-child { border-bottom: none; }
        .plan-table td { color: #f3f3f3; }
        @media (max-width: 700px) {
          .container { padding: 18px 6vw; }
          .plan-table th, .plan-table td { padding: 8px 4px; font-size: 0.95em; }
        }
      </style>
    </head>
    <body>
      <div class="header">GymTravel</div>
      <div class="container">
        <h1>Your Custom Gym Plan</h1>
        <p>Based on your equipment, muscle group(s), and goal (${mode === 'bulking' ? 'Bulking' : 'Dieting'}):</p>
        ${planTable}
        <a href="/" class="button">Back</a>
      </div>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
