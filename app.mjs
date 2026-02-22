import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { EXERCISES } from './data/exercises.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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

function renderTemplate(file, replacements) {
  let html = require('fs').readFileSync(file, 'utf8');
  for (const key in replacements) {
    html = html.replace(`<!-- ${key} -->`, replacements[key]);
  }
  return html;
}

app.get('/', (req, res) => {
  const equipmentOptions = EQUIPMENT_LIST.map(eq => `<label class="option"><input type="checkbox" name="equipment" value="${eq}"> ${eq}</label>`).join('');
  const muscleOptions = MUSCLE_GROUPS.map(mg => `<label class="option"><input type="checkbox" name="muscle" value="${mg}"> ${mg}</label>`).join('');
  const html = renderTemplate(
    path.join(__dirname, 'views', 'index.html'),
    {
      EQUIPMENT_OPTIONS: equipmentOptions,
      MUSCLE_OPTIONS: muscleOptions
    }
  );
  res.send(html);
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
  const planHtml = plan.length
    ? `<ul>${plan.map(ex => `<li>${ex.name} (${ex.equipment.join(', ')}) - ${ex.muscle_group} <br>
      <strong>Recommended: ${repRange}</strong><br>
      <strong>Recommended Weight: ${getRecommendedWeight(ex)}</strong>
      </li>`).join('')}</ul>`
    : '<p>No workouts available for selected equipment and muscle group.</p>';

  const html = renderTemplate(
    path.join(__dirname, 'views', 'plan.html'),
    {
      PLAN_HTML: planHtml,
      MODE: mode === 'bulking' ? 'Bulking' : 'Dieting'
    }
  );
  res.send(html);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
