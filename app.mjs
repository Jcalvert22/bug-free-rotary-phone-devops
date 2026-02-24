import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use('/styles', express.static('styles'));
app.use('/images', express.static('public/images'));

const MUSCLE_GROUPS = [
  'Upper Chest', 'Chest', 'Shoulders', 'Arms', 'Back', 'Abs', 'Legs'
];

const EQUIPMENT_LIST = [
  // Chest
  'Bench', 'Pec Deck', 'Dumbbells', 'Cables',
  // Back
  'Lat Pulldown', 'Seated Row',
  // Shoulders
  'Shoulder Press',
  // Arms
  'Preacher Curl',
  // Legs
  'Squat Rack', 'Leg Extension', 'Hamstring Curl',
  // Cardio
  'Treadmill', 'Stair Stepper', 'Cardio Bike'
];

const EXERCISES = [
  // Upper Chest
  { name: "Incline Dumbbell Press", equipment: ["Bench", "Dumbbells"], muscle_group: "Upper Chest", howto: "Lie on an incline bench and press dumbbells upward.", video: "" },
  { name: "Incline Push-up", equipment: ["Bench"], muscle_group: "Upper Chest", howto: "Place hands on bench, feet on floor, and perform push-ups.", video: "" },

  // Chest
  { name: "Push-up", equipment: ["Bench", "Dumbbells"], muscle_group: "Chest", howto: "Start in a plank position and lower your body until your chest nearly touches the floor, then push back up.", video: "" },
  { name: "Bench Press", equipment: ["Bench", "Dumbbells"], muscle_group: "Chest", howto: "Lie on a bench, grip dumbbells. Lower to chest, then press up.", video: "" },
  { name: "Pec Deck Fly", equipment: ["Pec Deck"], muscle_group: "Chest", howto: "Sit at the machine, bring arms together in front of chest, then return.", video: "" },
  { name: "Cable Chest Fly", equipment: ["Cables"], muscle_group: "Chest", howto: "With arms slightly bent, bring handles together in a wide arc, then return.", video: "" },

  // Shoulders
  { name: "Shoulder Press", equipment: ["Shoulder Press", "Dumbbells"], muscle_group: "Shoulders", howto: "Press weight overhead, then lower.", video: "" },
  { name: "Lateral Raise", equipment: ["Dumbbells", "Cables"], muscle_group: "Shoulders", howto: "Raise weights to sides to shoulder height.", video: "" },
  { name: "Front Raise", equipment: ["Dumbbells", "Cables"], muscle_group: "Shoulders", howto: "Raise weights in front to shoulder height.", video: "" },

  // Arms
  { name: "Bicep Curl", equipment: ["Dumbbells", "Preacher Curl", "Cables"], muscle_group: "Arms", howto: "Curl weights up while keeping elbows close, then lower slowly.", video: "" },
  { name: "Triceps Pushdown", equipment: ["Cables"], muscle_group: "Arms", howto: "Push bar or rope down, keeping elbows at sides.", video: "" },
  { name: "Hammer Curl", equipment: ["Dumbbells"], muscle_group: "Arms", howto: "Curl dumbbells with palms facing each other.", video: "" },
  { name: "Overhead Triceps Extension", equipment: ["Dumbbells"], muscle_group: "Arms", howto: "Extend dumbbell overhead, then lower behind head and press up.", video: "" },

  // Back
  { name: "Lat Pulldown", equipment: ["Lat Pulldown", "Cables"], muscle_group: "Back", howto: "Pull bar to chest, then release.", video: "" },
  { name: "Seated Row", equipment: ["Cables"], muscle_group: "Back", howto: "Pull handles to torso, then release.", video: "" },
  { name: "Dumbbell Row", equipment: ["Bench", "Dumbbells"], muscle_group: "Back", howto: "Place one knee and hand on bench, row dumbbell to hip.", video: "" },

  // Abs
  { name: "Crunch", equipment: ["Bench"], muscle_group: "Abs", howto: "Curl shoulders toward hips, then lower.", video: "" },
  { name: "Plank", equipment: ["Bench"], muscle_group: "Abs", howto: "Hold body straight on elbows and toes.", video: "" },
  { name: "Leg Raise", equipment: ["Bench"], muscle_group: "Abs", howto: "Lie on bench, raise legs upward, then lower.", video: "" },

  // Legs
  { name: "Squat", equipment: ["Squat Rack", "Dumbbells"], muscle_group: "Legs", howto: "Lower hips back and down, then stand up.", video: "" },
  { name: "Leg Extension", equipment: ["Leg Extension"], muscle_group: "Legs", howto: "Extend knees to lift pad.", video: "" },
  { name: "Hamstring Curl", equipment: ["Hamstring Curl"], muscle_group: "Legs", howto: "Curl heels toward glutes.", video: "" },
  { name: "Calf Raise", equipment: ["Bench", "Dumbbells"], muscle_group: "Legs", howto: "Stand on edge of bench, raise heels, then lower.", video: "" },

  // Cardio
  { name: "Treadmill Walk", equipment: ["Treadmill"], muscle_group: "Legs", howto: "Walk at a steady pace.", video: "" },
  { name: "Stair Stepper", equipment: ["Stair Stepper"], muscle_group: "Legs", howto: "Climb rotating stairs.", video: "" },
  { name: "Bike Ride", equipment: ["Cardio Bike"], muscle_group: "Legs", howto: "Pedal at a steady pace.", video: "" }
];

const BEGINNER_EQUIPMENT = [
  'Dumbbells', 'Bench', 'Bodyweight Only', 'Resistance Bands', 'Pull-up Bar', 'Stationary Bike', 'Treadmill', 'Kettlebell', 'StepMill', 'Jump Rope', 'Foam Roller', 'Stability Ball', 'Mini Bands', 'Push-up Handles', 'Grip Trainer', 'Medicine Ball', 'Ab Wheel', 'Parallettes', 'Suspension Trainer', 'Roman Chair', 'Hyperextension Bench', 'Stepper', 'Elliptical', 'Rowing Machine', 'Weighted Vest', 'Ankle Weights', 'Bosu Ball'
];
const BEGINNER_MUSCLES = [
  'Upper Chest', 'Chest', 'Shoulders', 'Arms', 'Back', 'Abs', 'Legs'
];

function getRecommendedWeight(exercise, benchMax, squatMax, deadliftMax, percent, noMax) {
  if (noMax) return 'N/A';
  const name = exercise.name.toLowerCase();
  if (name.includes('bench')) return benchMax ? `${Math.round(benchMax * percent / 100)} lbs` : 'N/A';
  if (name.includes('squat')) return squatMax ? `${Math.round(squatMax * percent / 100)} lbs` : 'N/A';
  if (name.includes('deadlift')) return deadliftMax ? `${Math.round(deadliftMax * percent / 100)} lbs` : 'N/A';
  return 'Bodyweight or moderate';
}

function normalizeSelection(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function shuffleArray(list) {
  const array = [...list];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

app.get('/', (req, res) => {
  const beginnerMode = false; // Always false for GET, unless you want to persist state
  const equipmentOptions = EQUIPMENT_LIST.map(eq =>
    `<label class="option" data-equip="${eq}"><input type="checkbox" name="equipment" value="${eq}"> ${eq}</label>`
  ).join('');
  const muscleOptions = MUSCLE_GROUPS.map(mg =>
    `<label class="option" data-muscle="${mg}"><input type="checkbox" name="muscle" value="${mg}"> ${mg}</label>`
  ).join('');
  res.send(`
    <html>
    <head>
      <title>AllAroundAthlete - Starter Gym Planner</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="/styles/main.css">
    </head>
    <body>
      <header class="header">
        <div class="header-content">
          <img src="/images/allaround-athlete-logo.png" alt="AllAroundAthlete Logo" style="height:90px;width:auto;margin-right:22px;background:transparent;border-radius:6px;display:block;">
          <span style="font-size:1.2em;font-weight:700;color:#4f8cff;letter-spacing:2px;margin-right:32px;">All-Around Athlete</span>
          <nav class="header-tabs"><a href="/">Home</a> | <a href="/dashboard">My Profile</a></nav>
        </div>
      </header>
      <div class="container">
        <h1>Starter Gym Planner</h1>
        <form method="POST" action="/plan">
          <p style="margin-bottom:8px;">Equipment:</p>
          <button type="button" onclick="toggleSection('equip-section')" class="toggle-btn">Show options</button>
          <div id="equip-section" style="display:none;margin-bottom:12px;">
            ${equipmentOptions}
          </div>
          <hr>
          <p style="margin-bottom:8px;">Muscle Groups:</p>
          <button type="button" onclick="toggleSection('muscle-section')" class="toggle-btn">Show options</button>
          <div id="muscle-section" style="display:none;margin-bottom:12px;">
            ${muscleOptions}
          </div>
          <hr>
          <button type="submit" class="button">Build My Plan</button>
        </form>
      </div>
      <script>
      function toggleSection(id) {
        const section = document.getElementById(id);
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
      }
      </script>
    </body>
    </html>
  `);
});

app.post('/plan', (req, res) => {
  const selectedEquipment = normalizeSelection(req.body.equipment);
  const selectedMuscles = normalizeSelection(req.body.muscle);
  let mode = req.body.mode || 'dieting';
  let percent = parseFloat(req.body.percent) || 70;
  const noMax = req.body.no_max === 'on';
  const workoutTime = parseInt(req.body.workout_time) || 60;
  const exercisesPerGroup = workoutTime <= 45 ? 2 : 3;
  const beginnerMode = req.body.beginner_mode === 'on';

  let benchMax = noMax ? 0 : parseFloat(req.body.bench_max) || 0;
  let squatMax = noMax ? 0 : parseFloat(req.body.squat_max) || 0;
  let deadliftMax = noMax ? 0 : parseFloat(req.body.deadlift_max) || 0;

  const repRange = mode === 'bulking' ? '4-8 reps, heavy weight' : '12-20 reps, light/moderate weight';
  const setsPerExercise = mode === 'bulking' ? '4 sets' : '3 sets';

  let filteredEquipment = selectedEquipment;
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
    const shuffledMatches = shuffleArray(matches);
    plan = plan.concat(shuffledMatches.slice(0, exercisesPerGroup));
  });

  const MIN_MOVEMENTS = 3;
  const MAX_MOVEMENTS = 5;
  if (plan.length >= MIN_MOVEMENTS) {
    const targetCount = Math.min(plan.length, MAX_MOVEMENTS);
    if (plan.length > targetCount) {
      plan = shuffleArray(plan).slice(0, targetCount);
    }
  }

  const planTable = plan.length
    ? `
      <div style="overflow-x:auto;width:100%;">
      <table class="plan-table" style="width:100%;min-width:1100px;margin:auto;">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Equipment</th>
            <th>Muscle Group</th>
            <th>Rep Range</th>
            <th>Sets</th>
            <th>Recommended Weight</th>
            <th>Description</th>
            <th>Demo</th>
          </tr>
        </thead>
        <tbody>
          ${plan.map(ex => {
            return `
              <tr>
                <td>${ex.name}</td>
                <td>${ex.equipment.join(', ')}</td>
                <td>${ex.muscle_group}</td>
                <td>${repRange}</td>
                <td>${setsPerExercise}</td>
                <td>${getRecommendedWeight(ex, benchMax, squatMax, deadliftMax, percent, noMax)}</td>
                <td style="max-width:320px;">${ex.howto}</td>
                <td>${ex.video ? `<iframe width="160" height="90" src="${ex.video}" title="${ex.name} demo" frameborder="0" allowfullscreen style="border-radius:6px;"></iframe>` : ''}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      </div>
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
      <header class="header">
        <div class="header-content">
          <img src="/images/allaround-athlete-logo.png" alt="AllAroundAthlete Logo" style="height:90px;width:auto;margin-right:22px;background:transparent;border-radius:6px;display:block;">
          <span style="font-size:1.2em;font-weight:700;color:#4f8cff;letter-spacing:2px;margin-right:32px;">All-Around Athlete</span>
          <nav class="header-tabs"><a href="/">Home</a> | <a href="/dashboard">My Profile</a></nav>
        </div>
      </header>
      <div class="container">
        <h1>Your Custom Gym Plan</h1>
        <p>Based on your equipment, muscle group(s), and goal:</p>
        ${planTable}
        <a href="/" class="button">Back</a>
      </div>
    </body>
    </html>
  `);
});

app.get('/dashboard', (req, res) => {
  // Placeholder values for now
  const userDuration = '3 weeks'; // Replace with real tracking
  const savedWorkouts = ['Push/Pull/Legs', 'Full Body Beginner', 'Upper Body Blast']; // Replace with real saved workouts
  const deadliftMax = 315; // Replace with real user input
  const benchMax = 225; // Replace with real user input
  const squatMax = 275; // Replace with real user input
  const userWeight = 180; // Replace with real user input
  const userHeight = 70; // Replace with real user input

  res.send(`
    <html>
    <head>
      <title>User Dashboard - AllAroundAthlete</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="/styles/main.css">
    </head>
    <body>
      <header class="header">
        <div class="header-content">
          <img src="/images/allaround-athlete-logo.png" alt="AllAroundAthlete Logo" style="height:90px;width:auto;margin-right:22px;background:transparent;border-radius:6px;display:block;">
          <span style="font-size:1.2em;font-weight:700;color:#4f8cff;letter-spacing:2px;margin-right:32px;">All-Around Athlete</span>
          <nav class="header-tabs"><a href="/">Home</a> | <a href="/dashboard">My Profile</a></nav>
        </div>
      </header>
      <div class="container">
        <h1>User Dashboard</h1>
        <div style="margin-bottom:18px;">
          <strong>Time Using App:</strong> ${userDuration}
        </div>
        <div style="margin-bottom:18px;">
          <strong>Saved Workouts:</strong>
          <ul>
            ${savedWorkouts.map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>
        <div style="margin-bottom:18px;">
          <strong>Maxes:</strong>
          <ul>
            <li>Bench Press: ${benchMax} lbs</li>
            <li>Squat: ${squatMax} lbs</li>
            <li>Deadlift: ${deadliftMax} lbs</li>
          </ul>
        </div>
        <div style="margin-bottom:18px;">
          <strong>Profile:</strong>
          <ul>
            <li>Height: ${userHeight} in</li>
            <li>Weight: ${userWeight} lbs</li>
          </ul>
        </div>
        <div style="margin-bottom:18px;">
          <strong>Progress Tracking:</strong>
          <ul>
            <li>Update maxes, weight, and height</li>
            <li>Track workout frequency</li>
            <li>View progress charts (coming soon)</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
