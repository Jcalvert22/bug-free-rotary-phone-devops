import express from 'express';
import { getRecommendedWeight } from './functions/helpers.js';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use('/styles', express.static('styles'));

const EQUIPMENT_LIST = [
  'Dumbbells', 'Barbell', 'Bench', 'Pull-up Bar', 'Kettlebell', 'Resistance Bands', 'Treadmill', 'Stationary Bike', 'Bodyweight Only', 'Smith Machine', 'Cable Machine', 'Leg Press Machine', 'Chest Press Machine', 'Lat Pulldown Machine', 'Seated Row Machine', 'Pec Deck Machine', 'Leg Extension Machine', 'Leg Curl Machine', 'Calf Raise Machine', 'Dip Station', 'Ab Wheel', 'Medicine Ball', 'EZ Curl Bar', 'Trap Bar', 'Power Rack', 'Squat Rack', 'Preacher Curl Bench', 'Incline Bench', 'Decline Bench', 'Flat Bench', 'Roman Chair', 'Hyperextension Bench', 'Stepper', 'Elliptical', 'Rowing Machine', 'Battle Ropes', 'Sled', 'Landmine Attachment', 'Pulling Sled', 'Plyo Box', 'Jump Rope', 'Weighted Vest', 'Ankle Weights', 'Foam Roller', 'Stability Ball', 'Bosu Ball', 'Mini Bands', 'Suspension Trainer', 'Parallettes', 'Push-up Handles', 'Grip Trainer', 'Farmer’s Walk Handles', 'Sissy Squat Machine', 'Glute Ham Developer', 'Reverse Hyper Machine', 'Hack Squat Machine', 'Thigh Abductor Machine', 'Thigh Adductor Machine', 'Hip Thrust Machine', 'Chest Fly Machine', 'Shoulder Press Machine', 'Seated Calf Machine', 'Standing Calf Machine', 'Wrist Roller', 'Weighted Sled', 'T-Bar Row Machine', 'Multi-Station Gym', 'Stepper Machine', 'Air Bike', 'SkiErg', 'Ab Crunch Machine'
];

const MUSCLE_GROUPS = [
  'Chest', 'Upper Chest', 'Lower Chest', 'Triceps', 'Biceps', 'Forearms', 'Back', 'Upper Back', 'Lower Back', 'Lats', 'Traps', 'Quads', 'Hamstrings', 'Calves', 'Glutes', 'Hip Flexors', 'Adductors', 'Abductors', 'Abs', 'Obliques', 'Serratus Anterior', 'Front Delt', 'Side Delt', 'Rear Delt', 'Shoulders', 'Neck'
];

const EXERCISES = [
  // Chest
  { name: "Push-up", equipment: ["Bodyweight"], muscle_group: "Chest", howto: "Start in a plank position with hands under shoulders. Lower your body until your chest nearly touches the floor, then push back up.", video: "" },
  { name: "Incline Push-up", equipment: ["Bodyweight", "Incline Bench"], muscle_group: "Upper Chest", howto: "Place your hands on an elevated surface. Lower your chest to the bench, then push back up.", video: "" },
  { name: "Decline Push-up", equipment: ["Bodyweight", "Decline Bench"], muscle_group: "Lower Chest", howto: "Place your feet on an elevated surface. Lower your chest to the floor, then push back up.", video: "" },
  { name: "Bench Press", equipment: ["Barbell", "Bench", "Dumbbells", "Smith Machine", "Chest Press Machine"], muscle_group: "Chest", howto: "Lie on a bench, grip bar wider than shoulders. Lower bar to chest, then press up.", video: "" },
  { name: "Incline Bench Press", equipment: ["Barbell", "Incline Bench", "Dumbbells", "Smith Machine", "Chest Press Machine"], muscle_group: "Upper Chest", howto: "Lie on an incline bench, grip bar wider than shoulders. Lower bar to upper chest, then press up.", video: "" },
  { name: "Decline Bench Press", equipment: ["Barbell", "Decline Bench", "Dumbbells", "Smith Machine"], muscle_group: "Lower Chest", howto: "Lie on a decline bench, grip bar wider than shoulders. Lower bar to lower chest, then press up.", video: "" },
  { name: "Chest Fly", equipment: ["Dumbbells", "Bench", "Cable Machine", "Pec Deck Machine", "Chest Fly Machine"], muscle_group: "Chest", howto: "With arms slightly bent, bring weights or handles together in a wide arc, then return.", video: "" },
  { name: "Pec Deck Fly", equipment: ["Pec Deck Machine"], muscle_group: "Chest", howto: "Sit at the machine, bring arms together in front of chest, then return.", video: "" },
  { name: "Push-up Handles Push-up", equipment: ["Push-up Handles", "Bodyweight"], muscle_group: "Chest", howto: "Use handles for deeper range of motion in a standard push-up.", video: "" },

  // Triceps
  { name: "Triceps Dip", equipment: ["Bodyweight", "Dip Station", "Bench"], muscle_group: "Triceps", howto: "Lower your body by bending elbows, then press back up.", video: "" },
  { name: "Triceps Pushdown", equipment: ["Cable Machine"], muscle_group: "Triceps", howto: "Push bar or rope down, keeping elbows at sides.", video: "" },
  { name: "Overhead Triceps Extension", equipment: ["Dumbbells", "Cable Machine", "EZ Curl Bar"], muscle_group: "Triceps", howto: "Extend weight overhead, then lower behind head and press up.", video: "" },
  { name: "Skullcrusher", equipment: ["EZ Curl Bar", "Barbell", "Dumbbells", "Bench"], muscle_group: "Triceps", howto: "Lower bar to forehead, then extend arms.", video: "" },

  // Biceps
  { name: "Bicep Curl", equipment: ["Dumbbells", "Barbell", "EZ Curl Bar", "Cable Machine", "Resistance Bands"], muscle_group: "Biceps", howto: "Curl weights up while keeping elbows close, then lower slowly.", video: "" },
  { name: "Hammer Curl", equipment: ["Dumbbells"], muscle_group: "Biceps", howto: "Curl with palms facing each other.", video: "" },
  { name: "Preacher Curl", equipment: ["EZ Curl Bar", "Preacher Curl Bench", "Dumbbells"], muscle_group: "Biceps", howto: "Curl weight on preacher bench, then lower.", video: "" },
  { name: "Concentration Curl", equipment: ["Dumbbells"], muscle_group: "Biceps", howto: "Curl dumbbell while seated, elbow on thigh.", video: "" },
  { name: "Cable Curl", equipment: ["Cable Machine"], muscle_group: "Biceps", howto: "Curl cable attachment toward shoulders.", video: "" },

  // Forearms
  { name: "Wrist Curl", equipment: ["Dumbbells", "Barbell", "EZ Curl Bar"], muscle_group: "Forearms", howto: "Curl wrists upward, then lower.", video: "" },
  { name: "Reverse Wrist Curl", equipment: ["Dumbbells", "Barbell", "EZ Curl Bar"], muscle_group: "Forearms", howto: "Curl wrists upward with palms down.", video: "" },
  { name: "Farmer’s Walk", equipment: ["Dumbbells", "Farmer’s Walk Handles", "Kettlebell"], muscle_group: "Forearms", howto: "Walk while holding heavy weights at sides.", video: "" },
  { name: "Wrist Roller", equipment: ["Wrist Roller"], muscle_group: "Forearms", howto: "Roll weight up and down using wrists.", video: "" },
  { name: "Grip Trainer Squeeze", equipment: ["Grip Trainer"], muscle_group: "Forearms", howto: "Squeeze grip trainer for repetitions.", video: "" },

  // Shoulders
  { name: "Overhead Press", equipment: ["Barbell", "Dumbbells", "Smith Machine", "Shoulder Press Machine"], muscle_group: "Shoulders", howto: "Press weight overhead, then lower.", video: "" },
  { name: "Front Raise", equipment: ["Dumbbells", "Cable Machine", "Resistance Bands"], muscle_group: "Front Delt", howto: "Raise weights in front to shoulder height.", video: "" },
  { name: "Lateral Raise", equipment: ["Dumbbells", "Cable Machine", "Resistance Bands"], muscle_group: "Side Delt", howto: "Raise weights to sides to shoulder height.", video: "" },
  { name: "Rear Delt Fly", equipment: ["Dumbbells", "Cable Machine", "Pec Deck Machine"], muscle_group: "Rear Delt", howto: "Bend forward, raise arms out to sides.", video: "" },
  { name: "Arnold Press", equipment: ["Dumbbells"], muscle_group: "Shoulders", howto: "Rotate palms during overhead press.", video: "" },
  { name: "Upright Row", equipment: ["Barbell", "Dumbbells", "EZ Curl Bar", "Cable Machine"], muscle_group: "Traps", howto: "Pull weight up to chest, elbows high.", video: "" },
  { name: "Shrug", equipment: ["Dumbbells", "Barbell", "Smith Machine"], muscle_group: "Traps", howto: "Shrug shoulders up toward ears, then lower.", video: "" },
  { name: "Face Pull", equipment: ["Cable Machine", "Resistance Bands"], muscle_group: "Rear Delt", howto: "Pull rope toward face, elbows high.", video: "" },

  // Back
  { name: "Pull-up", equipment: ["Pull-up Bar", "Assisted Pull-up Machine"], muscle_group: "Back", howto: "Pull chin above bar, then lower.", video: "" },
  { name: "Chin-up", equipment: ["Pull-up Bar"], muscle_group: "Back", howto: "Pull chin above bar with underhand grip.", video: "" },
  { name: "Lat Pulldown", equipment: ["Lat Pulldown Machine", "Cable Machine"], muscle_group: "Lats", howto: "Pull bar to chest, then release.", video: "" },
  { name: "Seated Row", equipment: ["Seated Row Machine", "Cable Machine"], muscle_group: "Back", howto: "Pull handles to torso, then release.", video: "" },
  { name: "Bent Over Row", equipment: ["Barbell", "Dumbbells", "Smith Machine", "T-Bar Row Machine"], muscle_group: "Back", howto: "Row weight to waist, then lower.", video: "" },
  { name: "T-Bar Row", equipment: ["T-Bar Row Machine", "Barbell"], muscle_group: "Back", howto: "Row bar to chest, then lower.", video: "" },
  { name: "Single Arm Row", equipment: ["Dumbbells", "Cable Machine"], muscle_group: "Back", howto: "Row dumbbell to hip, then lower.", video: "" },
  { name: "Deadlift", equipment: ["Barbell", "Dumbbells", "Trap Bar", "Smith Machine"], muscle_group: "Lower Back", howto: "Lift bar from floor by straightening hips and knees.", video: "" },
  { name: "Good Morning", equipment: ["Barbell", "Smith Machine"], muscle_group: "Lower Back", howto: "Hinge at hips with bar on back, then return.", video: "" },
  { name: "Hyperextension", equipment: ["Hyperextension Bench", "Roman Chair"], muscle_group: "Lower Back", howto: "Extend torso upward, then lower.", video: "" },
  { name: "Reverse Hyper", equipment: ["Reverse Hyper Machine"], muscle_group: "Lower Back", howto: "Lift legs behind you while lying face down.", video: "" },

  // Abs & Core
  { name: "Crunch", equipment: ["Bodyweight", "Ab Crunch Machine"], muscle_group: "Abs", howto: "Curl shoulders toward hips, then lower.", video: "" },
  { name: "Sit-up", equipment: ["Bodyweight"], muscle_group: "Abs", howto: "Sit up from lying position, then lower.", video: "" },
  { name: "Hanging Leg Raise", equipment: ["Pull-up Bar"], muscle_group: "Abs", howto: "Raise legs while hanging, then lower.", video: "" },
  { name: "Plank", equipment: ["Bodyweight"], muscle_group: "Abs", howto: "Hold body straight on elbows and toes.", video: "" },
  { name: "Russian Twist", equipment: ["Medicine Ball", "Bodyweight"], muscle_group: "Obliques", howto: "Twist torso side to side while seated.", video: "" },
  { name: "Cable Woodchopper", equipment: ["Cable Machine"], muscle_group: "Obliques", howto: "Pull cable diagonally across body.", video: "" },
  { name: "Ab Wheel Rollout", equipment: ["Ab Wheel"], muscle_group: "Abs", howto: "Roll wheel forward and back from knees or toes.", video: "" },
  { name: "Decline Sit-up", equipment: ["Decline Bench"], muscle_group: "Abs", howto: "Sit up from decline position, then lower.", video: "" },
  { name: "Side Plank", equipment: ["Bodyweight"], muscle_group: "Obliques", howto: "Hold body straight on one elbow and side of foot.", video: "" },

  // Glutes & Hips
  { name: "Hip Thrust", equipment: ["Barbell", "Bench", "Hip Thrust Machine"], muscle_group: "Glutes", howto: "Thrust hips upward with weight on hips.", video: "" },
  { name: "Glute Bridge", equipment: ["Bodyweight", "Barbell"], muscle_group: "Glutes", howto: "Bridge hips upward from floor.", video: "" },
  { name: "Cable Kickback", equipment: ["Cable Machine"], muscle_group: "Glutes", howto: "Kick leg back with cable attached to ankle.", video: "" },
  { name: "Abductor Machine", equipment: ["Abductors", "Thigh Abductor Machine"], muscle_group: "Abductors", howto: "Push legs outward against pads.", video: "" },
  { name: "Adductor Machine", equipment: ["Adductors", "Thigh Adductor Machine"], muscle_group: "Adductors", howto: "Squeeze legs inward against pads.", video: "" },
  { name: "Step-up", equipment: ["Bench", "Plyo Box"], muscle_group: "Glutes", howto: "Step onto box, drive through heel.", video: "" },
  { name: "Bulgarian Split Squat", equipment: ["Dumbbells", "Bench"], muscle_group: "Glutes", howto: "Rear foot on bench, squat with front leg.", video: "" },

  // Quads
  { name: "Squat", equipment: ["Barbell", "Dumbbells", "Smith Machine", "Bodyweight", "Squat Rack", "Power Rack"], muscle_group: "Quads", howto: "Lower hips back and down, then stand up.", video: "" },
  { name: "Front Squat", equipment: ["Barbell", "Smith Machine"], muscle_group: "Quads", howto: "Barbell rests on front shoulders, squat down and up.", video: "" },
  { name: "Leg Press", equipment: ["Leg Press Machine"], muscle_group: "Quads", howto: "Press platform away with feet.", video: "" },
  { name: "Leg Extension", equipment: ["Leg Extension Machine"], muscle_group: "Quads", howto: "Extend knees to lift pad.", video: "" },
  { name: "Sissy Squat", equipment: ["Sissy Squat Machine"], muscle_group: "Quads", howto: "Lean back and squat, keeping hips forward.", video: "" },

  // Hamstrings
  { name: "Leg Curl", equipment: ["Leg Curl Machine", "Resistance Bands"], muscle_group: "Hamstrings", howto: "Curl heels toward glutes.", video: "" },
  { name: "Romanian Deadlift", equipment: ["Barbell", "Dumbbells", "Smith Machine"], muscle_group: "Hamstrings", howto: "Hinge at hips, lower weight, then return.", video: "" },
  { name: "Glute Ham Raise", equipment: ["Glute Ham Developer"], muscle_group: "Hamstrings", howto: "Lower torso, then curl up using hamstrings.", video: "" },

  // Calves
  { name: "Standing Calf Raise", equipment: ["Bodyweight", "Dumbbells", "Barbell", "Standing Calf Machine"], muscle_group: "Calves", howto: "Raise heels off ground, then lower.", video: "" },
  { name: "Seated Calf Raise", equipment: ["Seated Calf Machine"], muscle_group: "Calves", howto: "Raise heels while seated, then lower.", video: "" },
  { name: "Donkey Calf Raise", equipment: ["Bodyweight", "Donkey Calf Machine"], muscle_group: "Calves", howto: "Bend at waist, raise heels, then lower.", video: "" },

  // Cardio/Full Body/Other
  { name: "Jump Rope", equipment: ["Jump Rope"], muscle_group: "Calves", howto: "Jump over rope repeatedly.", video: "" },
  { name: "Rowing", equipment: ["Rowing Machine"], muscle_group: "Back", howto: "Row handle toward chest, then extend.", video: "" },
  { name: "Battle Ropes", equipment: ["Battle Ropes"], muscle_group: "Shoulders", howto: "Wave ropes up and down.", video: "" },
  { name: "Sled Push", equipment: ["Sled", "Weighted Sled"], muscle_group: "Quads", howto: "Push sled forward using legs.", video: "" },
  { name: "Farmer’s Walk", equipment: ["Dumbbells", "Farmer’s Walk Handles", "Kettlebell"], muscle_group: "Forearms", howto: "Walk while holding heavy weights at sides.", video: "" },
  { name: "StepMill", equipment: ["Stepper", "Stepper Machine"], muscle_group: "Glutes", howto: "Climb rotating stairs.", video: "" },
  { name: "Air Bike Sprint", equipment: ["Air Bike"], muscle_group: "Full Body", howto: "Pedal and push/pull handles as fast as possible.", video: "" },
  { name: "SkiErg Pull", equipment: ["SkiErg"], muscle_group: "Back", howto: "Pull handles down in a skiing motion.", video: "" }
];

const BEGINNER_EQUIPMENT = [
  'Dumbbells', 'Bench', 'Resistance Bands', 'Bodyweight Only', 'Stationary Bike', 'Treadmill', 'Kettlebell', 'Pull-up Bar', 'Medicine Ball', 'Step-up Box', 'Incline Bench', 'Flat Bench', 'Jump Rope', 'Seated Row Machine', 'Lat Pulldown Machine', 'Leg Press Machine', 'Leg Extension Machine', 'Leg Curl Machine', 'Chest Press Machine', 'Shoulder Press Machine', 'Pec Deck Machine', 'Ab Crunch Machine', 'Stepper', 'Elliptical', 'Rowing Machine'
];

const BEGINNER_MUSCLES = [
  'Chest', 'Upper Chest', 'Triceps', 'Biceps', 'Forearms', 'Back', 'Quads', 'Calves', 'Hamstrings', 'Glutes', 'Abs', 'Shoulders'
];

app.get('/', (req, res) => {
  const equipmentOptions = EQUIPMENT_LIST.map(eq =>
    `<label class="option beginner-equip" data-equip="${eq}"><input type="checkbox" name="equipment" value="${eq}"> ${eq}</label>`
  ).join('');
  const muscleOptions = MUSCLE_GROUPS.map(mg =>
    `<label class="option beginner-muscle" data-muscle="${mg}"><input type="checkbox" name="muscle" value="${mg}"> ${mg}</label>`
  ).join('');
  res.send(`
    <html>
    <head>
      <title>AllAroundAthlete - Starter Gym Planner</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="/styles/main.css">
    </head>
    <body>
      <div class="header">AllAroundAthlete</div>
      <div class="container">
        <h1>Starter Gym Planner</h1>
        <form method="POST" action="/plan">
          <div style="margin-bottom:12px;">
            <label class="option"><input type="checkbox" id="beginnerMode" name="beginner_mode"> Beginner Mode (recommended for new lifters)</label>
          </div>
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
            <label for="workout_time" class="option">How many minutes do you have to workout?
              <input type="number" id="workout_time" name="workout_time" min="10" max="180" value="60" required style="width:100px; font-size:1.1em; padding:8px 14px;">
            </label>
          </div>
          <button type="submit">Build My Plan</button>
        </form>
      </div>
      <script>
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
        });
        document.getElementById('beginnerMode').addEventListener('change', function() {
          const beginnerEquip = ${JSON.stringify(BEGINNER_EQUIPMENT)};
          const beginnerMuscles = ${JSON.stringify(BEGINNER_MUSCLES)};
          const isBeginner = this.checked;
          document.querySelectorAll('.beginner-equip').forEach(label => {
            const eq = label.getAttribute('data-equip');
            if (isBeginner && !beginnerEquip.includes(eq)) {
              label.classList.add('disabled-option');
              label.querySelector('input').checked = false;
              label.querySelector('input').disabled = true;
            } else {
              label.classList.remove('disabled-option');
              label.querySelector('input').disabled = false;
            }
          });
          document.querySelectorAll('.beginner-muscle').forEach(label => {
            const mg = label.getAttribute('data-muscle');
            if (isBeginner && !beginnerMuscles.includes(mg)) {
              label.classList.add('disabled-option');
              label.querySelector('input').checked = false;
              label.querySelector('input').disabled = true;
            } else {
              label.classList.remove('disabled-option');
              label.querySelector('input').disabled = false;
            }
          });
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
  const workoutTime = parseInt(req.body.workout_time) || 60;
  const exercisesPerGroup = workoutTime <= 45 ? 2 : 3;
  const beginnerMode = req.body.beginner_mode === 'on';

  let benchMax = noMax ? 0 : parseFloat(req.body.bench_max) || 0;
  let squatMax = noMax ? 0 : parseFloat(req.body.squat_max) || 0;
  let deadliftMax = noMax ? 0 : parseFloat(req.body.deadlift_max) || 0;

  if (!selected) selected = [];
  if (!Array.isArray(selected)) selected = [selected];
  if (!selectedMuscles) selectedMuscles = [];
  if (!Array.isArray(selectedMuscles)) selectedMuscles = [selectedMuscles];

  const equipmentOptions = EQUIPMENT_LIST.map(eq =>
    `<label class="option beginner-equip" data-equip="${eq}"><input type="checkbox" name="equipment" value="${eq}"${selected.includes(eq) ? ' checked' : ''}> ${eq}</label>`
  ).join('');
  const muscleOptions = MUSCLE_GROUPS.map(mg =>
    `<label class="option beginner-muscle" data-muscle="${mg}"><input type="checkbox" name="muscle" value="${mg}"${selectedMuscles.includes(mg) ? ' checked' : ''}> ${mg}</label>`
  ).join('');

  const repRange = mode === 'bulking' ? '4-8 reps, heavy weight' : '12-20 reps, light/moderate weight';

  // Use imported helper
  // getRecommendedWeight(ex) is imported from helpers.js

  let filteredEquipment = selected;
  let filteredMuscles = selectedMuscles;
  if (beginnerMode) {
    filteredEquipment = filteredEquipment.filter(eq => BEGINNER_EQUIPMENT.includes(eq));
    filteredMuscles = filteredMuscles.filter(mg => BEGINNER_MUSCLES.includes(mg));
  }

  let plan = [];
  filteredMuscles.forEach(muscle => {
    const matches = EXERCISES.filter(ex =>
      ex.muscle_group === muscle &&
      ex.equipment.some(eq => filteredEquipment.includes(eq) || (eq === "Bodyweight" && filteredEquipment.includes("Bodyweight Only")))
    );
    for (let i = matches.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [matches[i], matches[j]] = [matches[j], matches[i]];
    }
    plan = plan.concat(matches.slice(0, exercisesPerGroup));
  });

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
            <th>How To</th>
            <th>Demo</th>
          </tr>
        </thead>
        <tbody>
          ${plan.map(ex => `
            <tr>
              <td>${ex.name}</td>
              <td>${ex.equipment.join(', ')}</td>
              <td>${ex.muscle_group}</td>
              <td>${repRange}</td>
              <td>${getRecommendedWeight(ex, benchMax, squatMax, deadliftMax, percent, noMax)}</td>
              <td style="max-width:200px">${ex.howto}</td>
              <td>
                ${ex.video ? `<iframe width="160" height="90" src="${ex.video}" title="${ex.name} demo" frameborder="0" allowfullscreen style="border-radius:6px;"></iframe>` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
    : '<p>No workouts available for selected equipment and muscle group.</p>';

  res.send(`
    <html>
    <head>
      <title>AllAroundAthlete - Starter Gym Planner</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="/styles/main.css">
    </head>
    <body>
      <div class="header">AllAroundAthlete</div>
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
