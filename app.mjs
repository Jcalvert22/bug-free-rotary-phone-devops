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

const SEX_OPTIONS = ['Female', 'Male', 'Prefer not to say'];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const userState = {
  profile: {
    name: 'Jace Calvert',
    subtitle: 'Short, calm sessions focused on solid form and breathing.',
    goal: 'Build steady strength and confidence',
    experience: 'Beginner · Week 3',
    equipment: 'Adjustable dumbbells + flat bench',
    height: '',
    weight: '',
    sex: '',
    age: '',
    location: '',
    onboardingComplete: false
  },
  program: {
    currentWeek: 3,
    totalWeeks: 8,
    nextWorkout: 'Upper Body Reset'
  },
  workouts: seedWorkouts()
};

function seedWorkouts() {
  const completions = [];
  const now = new Date();
  for (let i = 0; i < 5; i++) {
    completions.push(new Date(now.getTime() - i * MS_PER_DAY).toISOString());
  }
  for (let i = 5; i < 18; i++) {
    completions.push(new Date(now.getTime() - (i + 1) * MS_PER_DAY).toISOString());
  }
  return completions;
}

function escapeHTML(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanInput(value, fallback = '') {
  const trimmed = (value || '').toString().trim();
  return trimmed.length ? trimmed : fallback;
}

function sanitizeNumberInput(value, { min = null, max = null } = {}) {
  const num = parseFloat(value);
  if (!Number.isFinite(num)) return '';
  if (min !== null && num < min) return '';
  if (max !== null && num > max) return '';
  return num.toString();
}

function renderSexOptions(fieldName, selectedValue, required = false) {
  return SEX_OPTIONS.map((option, index) => `
    <label class="option-chip">
      <input type="radio" name="${fieldName}" value="${option}" ${selectedValue === option ? 'checked' : ''} ${(required && index === 0) ? 'required' : ''}>
      <span>${option}</span>
    </label>
  `).join('');
}

function normalizeDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function calculateStreak(workouts) {
  const days = [...new Set(workouts.map(normalizeDay))].sort((a, b) => b - a);
  if (!days.length) return 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i] === days[i - 1] - MS_PER_DAY) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calculateWorkoutStats() {
  return {
    total: userState.workouts.length,
    streak: calculateStreak(userState.workouts)
  };
}

function getWeeklyChartHeights() {
  const heights = [];
  const today = new Date();
  for (let offset = 6; offset >= 0; offset--) {
    const target = new Date(today.getTime() - offset * MS_PER_DAY);
    target.setHours(0, 0, 0, 0);
    const count = userState.workouts.filter(entry => normalizeDay(entry) === target.getTime()).length;
    const normalized = count === 0 ? 6 : Math.min(100, count * 30 + 10);
    heights.push(normalized);
  }
  return heights;
}

function recordWorkoutCompletion(timestamp = new Date()) {
  userState.workouts.unshift(new Date(timestamp).toISOString());
  if (userState.workouts.length > 365) {
    userState.workouts.length = 365;
  }
  const estimatedWeek = Math.ceil(userState.workouts.length / 3);
  userState.program.currentWeek = Math.min(
    userState.program.totalWeeks,
    Math.max(userState.program.currentWeek, estimatedWeek)
  );
}

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

const BASE_STYLES = `
  <style>
    :root {
      --accent: #4f8cff;
      --accent-dark: #325fdc;
      --bg: #070b1b;
      --panel: #101632;
      --panel-light: #161d3f;
      --text: #f5f7ff;
      --muted: #aab4dc;
      --border: rgba(255, 255, 255, 0.08);
      --success: #3dd598;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Segoe UI', 'Inter', sans-serif;
      background: radial-gradient(circle at top, rgba(79,140,255,0.18), transparent 55%), var(--bg);
      color: var(--text);
    }
    a { color: inherit; text-decoration: none; }
    .site-header {
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(16px);
      background: rgba(7,11,27,0.8);
      border-bottom: 1px solid var(--border);
    }
    .header-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand img {
      height: 72px;
      width: auto;
      border-radius: 10px;
    }
    .brand h1 {
      font-size: 1.1rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 0;
      color: var(--accent);
    }
    .nav-links {
      display: flex;
      gap: 18px;
      font-size: 0.95rem;
      color: var(--muted);
    }
    .cta-btn {
      padding: 10px 18px;
      border-radius: 999px;
      border: 1px solid var(--accent);
      color: var(--text);
      background: linear-gradient(120deg, var(--accent), var(--accent-dark));
      font-weight: 600;
    }
    .page-shell {
      max-width: 1100px;
      margin: 0 auto;
      padding: 48px 24px 80px;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 32px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.35);
    }
    .hero-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      align-items: stretch;
    }
    .hero-copy h2 {
      font-size: clamp(2rem, 4vw, 2.8rem);
      margin: 0 0 12px;
    }
    .hero-copy p {
      color: var(--muted);
      line-height: 1.5;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(79,140,255,0.15);
      color: var(--accent);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    form label.option {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin: 4px;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--panel-light);
      cursor: pointer;
      font-size: 0.9rem;
    }
    .toggle-btn {
      background: none;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 10px 14px;
      color: var(--muted);
      cursor: pointer;
      font-size: 0.85rem;
    }
    .primary-btn {
      display: inline-flex;
      justify-content: center;
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      border: none;
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      margin-top: 14px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 18px;
      margin-top: 32px;
    }
    .info-card {
      padding: 18px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: var(--panel-light);
    }
    .plan-table {
      width: 100%;
      border-collapse: collapse;
      color: var(--text);
    }
    .plan-table th,
    .plan-table td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
    }
    .plan-table th {
      text-align: left;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 1px;
      color: var(--muted);
    }
    .plan-table tbody tr:hover {
      background: rgba(79,140,255,0.05);
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
      gap: 16px;
    }
    .summary-card {
      padding: 18px;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: var(--panel-light);
    }
    .onboarding-panel {
      max-width: 720px;
      margin: 0 auto;
    }
    .onboarding-panel h2 {
      margin-top: 0;
      font-size: clamp(2rem, 4vw, 2.6rem);
    }
    .onboarding-lede {
      color: var(--muted);
      margin: 0 0 24px;
      line-height: 1.6;
    }
    .onboarding-form {
      display: grid;
      gap: 16px;
    }
    .onboarding-form label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.9rem;
      color: var(--muted);
    }
    .onboarding-form input,
    .onboarding-form textarea,
    .onboarding-form select {
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.04);
      color: var(--text);
      padding: 12px 14px;
      font-size: 1rem;
    }
    .onboarding-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    .option-chip-fieldset {
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 14px;
      padding: 10px 16px 16px;
      margin: 0;
      min-width: 0;
    }
    .option-chip-fieldset legend {
      font-size: 0.82rem;
      color: var(--muted);
      padding: 0 6px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .option-chip-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 8px;
    }
    .option-chip {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }
    .option-chip input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
    .option-chip span {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.18);
      padding: 8px 16px;
      font-size: 0.95rem;
      background: rgba(255,255,255,0.05);
      transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
    }
    .option-chip input:checked + span {
      border-color: var(--accent);
      background: rgba(79,140,255,0.2);
      color: var(--text);
      font-weight: 600;
    }
    .profile-shell {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .profile-summary-card {
      background: linear-gradient(145deg, #ffffff, #f5f7ff);
      color: #111531;
      border-radius: 24px;
      padding: 32px;
      border: 1px solid rgba(14,23,53,0.08);
      box-shadow: 0 25px 55px rgba(7,14,40,0.18);
    }
    .profile-summary-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 18px;
      flex-wrap: wrap;
    }
    .profile-eyebrow {
      letter-spacing: 1px;
      text-transform: uppercase;
      font-size: 0.78rem;
      color: #6f7a9f;
      margin: 0 0 4px;
    }
    .profile-summary-card h2 {
      margin: 0 0 6px;
      font-size: clamp(1.8rem, 3vw, 2.4rem);
    }
    .profile-summary-subtitle {
      color: #4b557a;
      margin: 0;
      line-height: 1.5;
    }
    .profile-pill {
      padding: 8px 16px;
      border-radius: 999px;
      background: rgba(79,140,255,0.15);
      color: #325fdc;
      font-weight: 600;
      border: 1px solid rgba(79,140,255,0.35);
    }
    .profile-meta {
      margin-top: 28px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 18px;
    }
    .profile-meta-item {
      background: rgba(255,255,255,0.9);
      border-radius: 18px;
      padding: 16px 18px;
      border: 1px solid rgba(15,23,42,0.08);
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
    }
    .profile-meta-item span {
      display: block;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #7d88b2;
      margin-bottom: 6px;
    }
    .profile-meta-item strong {
      font-size: 1.05rem;
      color: #111531;
      font-weight: 600;
      line-height: 1.4;
    }
    .profile-program-card {
      background: linear-gradient(135deg, #1d274a, #325fdc 50%, #4f8cff 90%);
      border-radius: 28px;
      padding: 34px 32px;
      color: #f6f8ff;
      box-shadow: 0 35px 75px rgba(27,37,79,0.55);
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .program-label {
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 0.75rem;
      color: rgba(245,247,255,0.78);
      margin: 0 0 6px;
    }
    .program-week-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .program-week-row h3 {
      margin: 0;
      font-size: clamp(2rem, 4vw, 2.6rem);
    }
    .program-subtitle {
      margin: 6px 0 18px;
      font-size: 1.05rem;
      color: rgba(246,248,255,0.9);
    }
    .program-subtitle span {
      font-weight: 600;
      color: #ffffff;
    }
    .program-progress {
      width: 100%;
      height: 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.25);
      overflow: hidden;
    }
    .program-progress-fill {
      height: 100%;
      border-radius: 999px;
      background: #3dd598;
    }
    .program-start-btn {
      border: none;
      border-radius: 18px;
      padding: 18px;
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 20px 40px rgba(13,18,37,0.35);
    }
    .program-start-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 24px 46px rgba(13,18,37,0.45);
    }
    .profile-progress-card {
      background: var(--panel-light);
      border-radius: 22px;
      padding: 28px 30px;
      border: 1px solid var(--border);
      box-shadow: 0 20px 48px rgba(0,0,0,0.35);
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .progress-eyebrow {
      letter-spacing: 1px;
      text-transform: uppercase;
      font-size: 0.75rem;
      color: var(--muted);
      margin: 0 0 4px;
    }
    .profile-progress-card h3 {
      margin: 0;
      font-size: 1.6rem;
    }
    .profile-progress-card p {
      margin: 6px 0 0;
      color: var(--muted);
    }
    .progress-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 18px;
    }
    .progress-metric {
      background: rgba(255,255,255,0.04);
      border-radius: 16px;
      padding: 16px 18px;
      border: 1px solid rgba(255,255,255,0.05);
    }
    .progress-metric span {
      font-size: 0.75rem;
      letter-spacing: 1px;
      color: var(--muted);
      text-transform: uppercase;
      display: block;
      margin-bottom: 6px;
    }
    .progress-metric strong {
      font-size: 1.4rem;
      font-weight: 600;
      color: var(--text);
    }
    .progress-mini-chart {
      display: flex;
      align-items: flex-end;
      gap: 10px;
      height: 80px;
    }
    .progress-mini-chart span {
      flex: 1;
      background: rgba(255,255,255,0.18);
      border-radius: 999px 999px 6px 6px;
      min-width: 8px;
    }
    .profile-settings-card {
      background: rgba(255,255,255,0.04);
      border-radius: 18px;
      padding: 22px 24px;
      border: 1px dashed rgba(255,255,255,0.2);
      color: var(--muted);
    }
    .profile-settings-card h4 {
      margin: 0;
      font-size: 1.15rem;
      color: var(--text);
    }
    .profile-settings-card p {
      margin: 6px 0 0;
      color: var(--muted);
    }
    .profile-settings-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 14px;
    }
    .settings-link {
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 8px 16px;
      font-size: 0.9rem;
      color: var(--muted);
      background: transparent;
      text-decoration: none;
      transition: border-color 0.2s ease, color 0.2s ease;
    }
    .settings-link:hover {
      border-color: var(--accent);
      color: var(--text);
    }
    .profile-settings-forms {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }
    .settings-inline-form {
      background: rgba(0,0,0,0.25);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
      display: grid;
      gap: 12px;
    }
    .settings-inline-form label {
      font-size: 0.85rem;
      color: var(--muted);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .settings-inline-form input,
    .settings-inline-form textarea,
    .settings-inline-form select {
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(0,0,0,0.15);
      color: var(--text);
      padding: 10px 12px;
      font-size: 0.95rem;
    }
    .settings-inline-form textarea {
      min-height: 72px;
      resize: vertical;
    }
    .settings-inline-form button {
      justify-self: flex-start;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text);
      padding: 8px 18px;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .settings-inline-form button:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    .settings-inline-form .option-chip-fieldset {
      border-color: var(--border);
      background: rgba(0,0,0,0.15);
    }
    footer {
      text-align: center;
      color: var(--muted);
      font-size: 0.8rem;
      padding: 24px 0 32px;
    }
    @media (max-width: 640px) {
      .header-inner { flex-direction: column; gap: 12px; }
      form label.option { width: 100%; justify-content: flex-start; }
      .plan-table { font-size: 0.85rem; }
    }
  </style>
`;

function renderPage(title, mainContent) {
  return `
    <html>
      <head>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="/styles/main.css">
        ${BASE_STYLES}
      </head>
      <body>
        <header class="site-header">
          <div class="header-inner">
            <div class="brand">
              <img src="/images/allaround-athlete-logo.png" alt="AllAroundAthlete Logo">
              <h1>All-Around Athlete</h1>
            </div>
            <nav class="nav-links">
              <a href="/">Planner</a>
              <a href="/dashboard">Dashboard</a>
              <a href="/profile">Profile</a>
              <a href="#subscribe" class="cta-btn">Subscribe</a>
            </nav>
          </div>
        </header>
        <main class="page-shell">
          ${mainContent}
        </main>
        <footer>
          © ${new Date().getFullYear()} AllAroundAthlete · Built for everyday consistency
        </footer>
      </body>
    </html>
  `;
}

app.get('/', (req, res) => {
  if (!userState.profile.onboardingComplete) {
    return res.redirect('/onboarding');
  }
  const equipmentOptions = EQUIPMENT_LIST.map(eq =>
    `<label class="option" data-equip="${eq}"><input type="checkbox" name="equipment" value="${eq}"> ${eq}</label>`
  ).join('');
  const muscleOptions = MUSCLE_GROUPS.map(mg =>
    `<label class="option" data-muscle="${mg}"><input type="checkbox" name="muscle" value="${mg}"> ${mg}</label>`
  ).join('');

  const landingContent = `
    <section class="panel" style="margin-bottom:28px;">
      <div class="hero-copy">
        <span class="badge">Why another planner?</span>
        <h2 style="margin:12px 0 12px;">Most "beginner" apps assume you already speak gym fluently.</h2>
        <p style="color:var(--muted);line-height:1.6;max-width:820px;">
          They drown you in jargon, over-deliver complicated splits, and never explain what to actually do once you walk past the check-in desk. AllAroundAthlete keeps the interface calm, limits you to a handful of purposeful exercises, and translates intentions into clear rep, set, and etiquette guidance so you never feel like you are in the wrong place.
        </p>
      </div>
    </section>
    <section class="hero-grid">
      <div class="panel hero-copy">
        <span class="badge">Starter program</span>
        <h2>Build a realistic session with the gear you actually have.</h2>
        <p>AllAroundAthlete designs beginner-friendly workouts that respect limited equipment, short time windows, and fresh motivation. No fluff—just three to five purposeful movements with dialed-in rep and set targets.</p>
        <div class="info-grid">
          <div class="info-card">
            <small style="color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Goal Support</small>
            <h3 style="margin:6px 0 0;">Dieting & Bulking tracks</h3>
          </div>
          <div class="info-card">
            <small style="color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Smart Equipment</small>
            <h3 style="margin:6px 0 0;">Auto filters for beginners</h3>
          </div>
          <div class="info-card">
            <small style="color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Subscription ready</small>
            <h3 style="margin:6px 0 0;">Stripe + Cloudflare stack</h3>
          </div>
        </div>
      </div>
      <div class="panel">
        <h3 style="margin-top:0;">Plan your next lift</h3>
        <p style="color:var(--muted);margin-bottom:18px;">Choose the tools on hand and the muscle groups you want to prioritize today.</p>
        <form method="POST" action="/plan">
          <p style="margin-bottom:6px;font-weight:600;">Equipment</p>
          <button type="button" onclick="toggleSection('equip-section')" class="toggle-btn">Select equipment</button>
          <div id="equip-section" style="display:none;margin:12px 0 20px;">
            ${equipmentOptions}
          </div>
          <p style="margin-bottom:6px;font-weight:600;">Muscle Groups</p>
          <button type="button" onclick="toggleSection('muscle-section')" class="toggle-btn">Select muscle focus</button>
          <div id="muscle-section" style="display:none;margin:12px 0 20px;">
            ${muscleOptions}
          </div>
          <button type="submit" class="primary-btn">Generate plan</button>
        </form>
      </div>
    </section>
    <section class="hero-grid" style="margin-top:32px;" id="gymxiety">
      <div class="panel">
        <span class="badge">Gymxiety Mode</span>
        <h3 style="margin:12px 0 8px;">Confidence coaching built into the basic membership.</h3>
        <p style="color:var(--muted);line-height:1.6;">Automatic reminders, polite prompts, and gym-etiquette walk-throughs show up inside every plan once you subscribe. You will know how to approach equipment, share the space, and avoid those awkward “am I doing this right?” moments.</p>
        <p style="color:var(--muted);margin-top:18px;">Turn it on from your dashboard and Gymxiety Mode travels with you—whether it’s a commercial gym, apartment setup, or hotel fitness room.</p>
      </div>
      <div class="panel">
        <h3 style="margin-top:0;">Subscription ready</h3>
        <p style="color:var(--muted);line-height:1.6;">Hosted on Cloudflare for instant global performance and connected to Stripe for secure billing. When you upgrade, Gymxiety Mode unlocks audio prompts, etiquette micro-lessons, and equipment walkthroughs.</p>
        <div class="info-card" style="margin-top:18px;">
          <small style="color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Coming soon</small>
          <h3 style="margin:8px 0 0;">Add-on packs for commercial gyms, apartment gyms, and hotel gyms.</h3>
        </div>
      </div>
    </section>
    <script>
      function toggleSection(id) {
        const section = document.getElementById(id);
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
      }
    </script>
  `;

  res.send(renderPage('AllAroundAthlete - Starter Gym Planner', landingContent));
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
        <table class="plan-table" style="min-width:960px;margin:auto;">
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
            ${plan.map(ex => `
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
            `).join('')}
          </tbody>
        </table>
      </div>
    `
    : '<p>No workouts available for selected equipment and muscle group.</p>';

  const planContent = `
    <section class="panel" style="margin-bottom:24px;">
      <h2 style="margin-top:0;">Session overview</h2>
      <div class="summary-grid">
        <div class="summary-card">
          <small style="color:var(--muted);">Movements</small>
          <h3 style="margin:6px 0 0;">${plan.length || 0}</h3>
        </div>
        <div class="summary-card">
          <small style="color:var(--muted);">Focus</small>
          <h3 style="margin:6px 0 0;">${filteredMuscles.slice(0, 2).join(', ') || 'General'}</h3>
        </div>
        <div class="summary-card">
          <small style="color:var(--muted);">Intensity</small>
          <h3 style="margin:6px 0 0;">${repRange} · ${setsPerExercise}</h3>
        </div>
        <div class="summary-card">
          <small style="color:var(--muted);">Mode</small>
          <h3 style="margin:6px 0 0;">${mode === 'bulking' ? 'Bulking' : 'Dieting'}</h3>
        </div>
      </div>
    </section>
    <section class="panel" style="margin-bottom:24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:12px;">
        <div>
          <h2 style="margin:0;">Your custom gym plan</h2>
          <p style="color:var(--muted);margin:6px 0 0;">Purposeful lifts matched to your selected equipment.</p>
        </div>
        <a href="/" class="cta-btn" style="text-decoration:none;">Start over</a>
      </div>
      ${planTable}
    </section>
  `;

  res.send(renderPage('Your Custom Gym Plan - AllAroundAthlete', planContent));
});

app.get('/dashboard', (req, res) => {
  if (!userState.profile.onboardingComplete) {
    return res.redirect('/onboarding');
  }
  // Placeholder values for now
  const userDuration = '3 weeks'; // Replace with real tracking
  const savedWorkouts = ['Push/Pull/Legs', 'Full Body Beginner', 'Upper Body Blast']; // Replace with real saved workouts
  const deadliftMax = 315; // Replace with real user input
  const benchMax = 225; // Replace with real user input
  const squatMax = 275; // Replace with real user input
  const userWeight = 180; // Replace with real user input
  const userHeight = 70; // Replace with real user input

  const dashboardContent = `
    <section class="panel" style="margin-bottom:28px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap;">
        <div>
          <span class="badge">Member since</span>
          <h2 style="margin:10px 0 6px;">${userDuration} of consistent work</h2>
          <p style="color:var(--muted);max-width:520px;">Keep logging sessions to unlock premium periodization templates. Your subscription syncs automatically with Stripe, so upgrades are instant.</p>
        </div>
        <button class="cta-btn">Manage Subscription</button>
      </div>
      <div class="summary-grid" style="margin-top:24px;">
        <div class="summary-card">
          <small style="color:var(--muted);">Current Weight</small>
          <h3 style="margin:6px 0 0;">${userWeight} lbs</h3>
        </div>
        <div class="summary-card">
          <small style="color:var(--muted);">Height</small>
          <h3 style="margin:6px 0 0;">${userHeight} in</h3>
        </div>
        <div class="summary-card">
          <small style="color:var(--muted);">Bench / Squat / Dead</small>
          <h3 style="margin:6px 0 0;">${benchMax}/${squatMax}/${deadliftMax} lbs</h3>
        </div>
      </div>
    </section>
    <section class="hero-grid" style="gap:24px;">
      <div class="panel">
        <h3 style="margin-top:0;">Saved workouts</h3>
        <p style="color:var(--muted);margin-top:4px;">Recently generated plans you bookmarked.</p>
        <ul style="margin:18px 0 0;padding-left:20px;line-height:1.8;">
          ${savedWorkouts.map(w => `<li>${w}</li>`).join('')}
        </ul>
      </div>
      <div class="panel">
        <h3 style="margin-top:0;">Next focus</h3>
        <p style="color:var(--muted);margin-top:4px;">Dial in your training priorities for the week.</p>
        <ul style="margin:18px 0 0;padding-left:20px;line-height:1.8;">
          <li>Update rep targets after next PR attempt</li>
          <li>Log cardio minutes in the mobile app</li>
          <li>Enable Cloudflare Gateway for faster loads</li>
        </ul>
      </div>
    </section>
  `;

  res.send(renderPage('Dashboard - AllAroundAthlete', dashboardContent));
});

app.get('/onboarding', (req, res) => {
  const profile = userState.profile;
  const sexOptionChips = renderSexOptions('sex', profile.sex, true);

  const onboardingContent = `
    <section class="panel onboarding-panel">
      <span class="badge">Welcome</span>
      <h2>Let's get acquainted first</h2>
      <p class="onboarding-lede">We ask for a few basics so every plan respects your goals, body, and available space. This stays private on your device.</p>
      <form class="onboarding-form" method="POST" action="/onboarding">
        <label>
          Primary goal
          <textarea name="goal" required placeholder="e.g., Build strength without burning out">${escapeHTML(profile.goal)}</textarea>
        </label>
        <div class="onboarding-grid">
          <label>
            Height (in)
            <input type="number" name="height" min="36" max="96" required value="${escapeHTML(profile.height || '')}">
          </label>
          <label>
            Weight (lbs)
            <input type="number" name="weight" min="70" max="600" required value="${escapeHTML(profile.weight || '')}">
          </label>
          <fieldset class="option-chip-fieldset">
            <legend>Sex</legend>
            <div class="option-chip-group">
              ${sexOptionChips}
            </div>
          </fieldset>
          <label>
            Age
            <input type="number" name="age" min="13" max="90" required value="${escapeHTML(profile.age || '')}">
          </label>
          <label>
            Location
            <input type="text" name="location" required value="${escapeHTML(profile.location || '')}" placeholder="City, State">
          </label>
        </div>
        <button class="primary-btn" type="submit">Save and continue</button>
      </form>
    </section>
  `;

  res.send(renderPage('Welcome - AllAroundAthlete', onboardingContent));
});

app.post('/onboarding', (req, res) => {
  const { goal, height, weight, sex, age, location } = req.body;
  const sanitizedHeight = sanitizeNumberInput(height, { min: 36, max: 96 });
  const sanitizedWeight = sanitizeNumberInput(weight, { min: 70, max: 600 });
  const sanitizedAge = sanitizeNumberInput(age, { min: 13, max: 90 });
  const normalizedSex = SEX_OPTIONS.includes(sex) ? sex : userState.profile.sex;

  userState.profile.goal = cleanInput(goal, userState.profile.goal);
  if (sanitizedHeight) userState.profile.height = sanitizedHeight;
  if (sanitizedWeight) userState.profile.weight = sanitizedWeight;
  if (sanitizedAge) userState.profile.age = sanitizedAge;
  userState.profile.sex = normalizedSex;
  userState.profile.location = cleanInput(location, userState.profile.location);
  userState.profile.onboardingComplete = true;

  res.redirect('/profile');
});

app.get('/profile', (req, res) => {
  if (!userState.profile.onboardingComplete) {
    return res.redirect('/onboarding');
  }
  const profileUser = userState.profile;
  const programInfo = userState.program;
  const stats = calculateWorkoutStats();
  const programProgress = Math.min(100, Math.round((programInfo.currentWeek / programInfo.totalWeeks) * 100));
  const weeklyHeights = getWeeklyChartHeights();
  const weightDisplay = profileUser.weight ? `${escapeHTML(profileUser.weight)} lbs` : 'Not set';
  const heightDisplay = profileUser.height ? `${escapeHTML(profileUser.height)} in` : 'Not set';
  const locationDisplay = profileUser.location ? escapeHTML(profileUser.location) : 'Not set';
  const ageSexParts = [];
  if (profileUser.age) ageSexParts.push(`${escapeHTML(profileUser.age)} yrs`);
  if (profileUser.sex) ageSexParts.push(escapeHTML(profileUser.sex));
  const ageSexDisplay = ageSexParts.length ? ageSexParts.join(' · ') : 'Not set';
  const profileSexChips = renderSexOptions('sex', profileUser.sex, true);

  const profileContent = `
    <section class="profile-shell">
      <div class="profile-summary-card">
        <div class="profile-summary-top">
          <div>
            <p class="profile-eyebrow">Profile</p>
            <h2>${escapeHTML(profileUser.name)}</h2>
            <p class="profile-summary-subtitle">${escapeHTML(profileUser.subtitle)}</p>
          </div>
          <div class="profile-pill">Beginner Mode</div>
        </div>
        <div class="profile-meta">
          <div class="profile-meta-item">
            <span>Goal</span>
            <strong>${escapeHTML(profileUser.goal)}</strong>
          </div>
          <div class="profile-meta-item">
            <span>Experience Level</span>
            <strong>${escapeHTML(profileUser.experience)}</strong>
          </div>
          <div class="profile-meta-item">
            <span>Equipment</span>
            <strong>${escapeHTML(profileUser.equipment)}</strong>
          </div>
          <div class="profile-meta-item">
            <span>Weight</span>
            <strong>${weightDisplay}</strong>
          </div>
          <div class="profile-meta-item">
            <span>Height</span>
            <strong>${heightDisplay}</strong>
          </div>
          <div class="profile-meta-item">
            <span>Age · Sex</span>
            <strong>${ageSexDisplay}</strong>
          </div>
          <div class="profile-meta-item">
            <span>Location</span>
            <strong>${locationDisplay}</strong>
          </div>
        </div>
      </div>
      <div class="profile-program-card">
        <div>
          <p class="program-label">Program</p>
          <div class="program-week-row">
            <h3>Week ${programInfo.currentWeek} of ${programInfo.totalWeeks}</h3>
          </div>
          <p class="program-subtitle">Next Workout: <span>${escapeHTML(programInfo.nextWorkout)}</span></p>
          <div class="program-progress">
            <div class="program-progress-fill" style="width:${programProgress}%;"></div>
          </div>
        </div>
        <form method="POST" action="/profile/start-workout">
          <button class="program-start-btn" type="submit">Start Today's Workout</button>
        </form>
      </div>
      <div class="profile-progress-card">
        <div>
          <p class="progress-eyebrow">Progress</p>
          <h3>Keeping it gentle and steady</h3>
          <p>Micro wins add up. Nothing fancy—just a calm snapshot.</p>
        </div>
        <div class="progress-metrics">
          <div class="progress-metric">
            <span>Workout Streak</span>
            <strong>${stats.streak} days</strong>
          </div>
          <div class="progress-metric">
            <span>Total Sessions</span>
            <strong>${stats.total}</strong>
          </div>
        </div>
        <div class="progress-mini-chart">
          ${weeklyHeights.map(val => `<span style="height:${val}%"></span>`).join('')}
        </div>
      </div>
      <div class="profile-settings-card">
        <h4>Tune the basics</h4>
        <p>Quick adjustments keep the plan feeling yours.</p>
        <div class="profile-settings-actions">
          <a href="#edit-profile" class="settings-link">Edit Profile</a>
          <a href="#change-goal" class="settings-link">Change Goal</a>
          <a href="#change-equipment" class="settings-link">Change Equipment</a>
        </div>
      </div>
      <div class="profile-settings-forms">
        <form id="edit-profile" class="settings-inline-form" method="POST" action="/profile/update-profile">
          <label>
            Display Name
            <input type="text" name="name" value="${escapeHTML(profileUser.name)}" required>
          </label>
          <label>
            Experience Note
            <input type="text" name="experience" value="${escapeHTML(profileUser.experience)}" required>
          </label>
          <label>
            Subtitle
            <textarea name="subtitle" required>${escapeHTML(profileUser.subtitle)}</textarea>
          </label>
          <label>
            Height (in)
            <input type="number" name="height" min="36" max="96" value="${escapeHTML(profileUser.height || '')}" required>
          </label>
          <label>
            Weight (lbs)
            <input type="number" name="weight" min="70" max="600" value="${escapeHTML(profileUser.weight || '')}" required>
          </label>
          <fieldset class="option-chip-fieldset">
            <legend>Sex</legend>
            <div class="option-chip-group">
              ${profileSexChips}
            </div>
          </fieldset>
          <label>
            Age
            <input type="number" name="age" min="13" max="90" value="${escapeHTML(profileUser.age || '')}" required>
          </label>
          <label>
            Location
            <input type="text" name="location" value="${escapeHTML(profileUser.location || '')}" required>
          </label>
          <label>
            Current Week
            <input type="number" min="1" max="${programInfo.totalWeeks}" name="current_week" value="${programInfo.currentWeek}" required>
          </label>
          <label>
            Total Weeks
            <input type="number" min="1" name="total_weeks" value="${programInfo.totalWeeks}" required>
          </label>
          <label>
            Next Workout Name
            <input type="text" name="next_workout" value="${escapeHTML(programInfo.nextWorkout)}" required>
          </label>
          <button type="submit">Save Profile</button>
        </form>
        <form id="change-goal" class="settings-inline-form" method="POST" action="/profile/update-goal">
          <label>
            Goal statement
            <textarea name="goal" required>${escapeHTML(profileUser.goal)}</textarea>
          </label>
          <button type="submit">Update Goal</button>
        </form>
        <form id="change-equipment" class="settings-inline-form" method="POST" action="/profile/update-equipment">
          <label>
            Equipment on hand
            <textarea name="equipment" required>${escapeHTML(profileUser.equipment)}</textarea>
          </label>
          <button type="submit">Update Equipment</button>
        </form>
      </div>
    </section>
  `;

  res.send(renderPage('Profile - AllAroundAthlete', profileContent));
});

app.post('/profile/start-workout', (req, res) => {
  recordWorkoutCompletion();
  res.redirect('/profile');
});

app.post('/profile/update-profile', (req, res) => {
  const {
    name,
    subtitle,
    experience,
    current_week,
    total_weeks,
    next_workout,
    height,
    weight,
    age,
    sex,
    location
  } = req.body;
  userState.profile.name = cleanInput(name, userState.profile.name);
  userState.profile.subtitle = cleanInput(subtitle, userState.profile.subtitle);
  userState.profile.experience = cleanInput(experience, userState.profile.experience);
  userState.program.nextWorkout = cleanInput(next_workout, userState.program.nextWorkout);

  const sanitizedHeight = sanitizeNumberInput(height, { min: 36, max: 96 });
  const sanitizedWeight = sanitizeNumberInput(weight, { min: 70, max: 600 });
  const sanitizedAge = sanitizeNumberInput(age, { min: 13, max: 90 });
  const normalizedSex = SEX_OPTIONS.includes(sex) ? sex : userState.profile.sex;
  if (sanitizedHeight) userState.profile.height = sanitizedHeight;
  if (sanitizedWeight) userState.profile.weight = sanitizedWeight;
  if (sanitizedAge) userState.profile.age = sanitizedAge;
  userState.profile.sex = normalizedSex;
  userState.profile.location = cleanInput(location, userState.profile.location);
  userState.profile.onboardingComplete = true;

  const totalWeeks = Math.max(1, parseInt(total_weeks, 10)) || userState.program.totalWeeks;
  userState.program.totalWeeks = totalWeeks;

  const currentWeek = Math.max(1, parseInt(current_week, 10)) || userState.program.currentWeek;
  userState.program.currentWeek = Math.min(currentWeek, userState.program.totalWeeks);

  res.redirect('/profile');
});

app.post('/profile/update-goal', (req, res) => {
  const { goal } = req.body;
  userState.profile.goal = cleanInput(goal, userState.profile.goal);
  res.redirect('/profile');
});

app.post('/profile/update-equipment', (req, res) => {
  const { equipment } = req.body;
  userState.profile.equipment = cleanInput(equipment, userState.profile.equipment);
  res.redirect('/profile');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
