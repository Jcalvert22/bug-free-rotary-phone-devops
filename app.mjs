import path from 'path';
import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();


const WORKOUTS = [];

// --- API endpoints for workouts CRUD ---
app.get('/api/workouts', (req, res) => {
  res.json(WORKOUTS);
});

app.post('/api/workouts', (req, res) => {
  let { exercises } = req.body;
  if (!Array.isArray(exercises) || !exercises.length) {
    return res.status(400).json({ error: 'No exercises provided' });
  }
  const workout = { id: Date.now().toString(), exercises };
  WORKOUTS.push(workout);
  res.status(201).json(workout);
});

app.delete('/api/workouts/:id', (req, res) => {
  const idx = WORKOUTS.findIndex(w => w.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  WORKOUTS.splice(idx, 1);
  res.json({ success: true });
});

// In-memory collections object
const collections = {
  items: [],
  routines: [],
  exercises: []
};

// Generic CRUD helper functions
function createItem(collectionName, data) {
  const item = { ...data, id: Date.now().toString() };
  collections[collectionName].push(item);
  return item;
}
function getAllItems(collectionName) {
  return collections[collectionName].slice();
}
function updateItem(collectionName, id, data) {
  const arr = collections[collectionName];
  const idx = arr.findIndex(item => item.id == id);
  if (idx === -1) return null;
  arr[idx] = { ...arr[idx], ...data };
  return arr[idx];
}
function deleteItem(collectionName, id) {
  const arr = collections[collectionName];
  const idx = arr.findIndex(item => item.id == id);
  if (idx === -1) return false;
  arr.splice(idx, 1);
  return true;
}


const app = express();
// ...existing code...
app.use(express.urlencoded({ extended: true }));
app.use('/styles', express.static('styles'));
app.use('/images', express.static('public/images'));

const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Core'];
const EQUIPMENT_OPTIONS = ['None', 'Dumbbells', 'Bench'];

const EXERCISES = [
  { muscle: 'Chest', equipment: ['None'], name: 'Wall Push-ups', steps: 'Stand an arm-length from a wall, bend elbows until nose nears the wall, press out slowly.' },
  { muscle: 'Chest', equipment: ['Dumbbells'], name: 'Floor Press', steps: 'Lie on your back, press dumbbells straight up, pause, lower with control.' },
  { muscle: 'Chest', equipment: ['Bench'], name: 'Incline Push-up', steps: 'Hands on a bench, body in one line, lower chest to the edge, press up.' },
  { muscle: 'Back', equipment: ['None'], name: 'Backpack Row', steps: 'Hinge at the hips, grab a backpack, pull it toward ribs, squeeze shoulder blades.' },
  { muscle: 'Back', equipment: ['Dumbbells'], name: 'Bent Over Row', steps: 'Hinge, keep back flat, row bells toward pockets, pause, lower slow.' },
  { muscle: 'Back', equipment: ['Bench'], name: 'Bench Supported Row', steps: 'One hand on a bench for balance, row the weight toward your hip.' },
  { muscle: 'Legs', equipment: ['None'], name: 'Bodyweight Squat', steps: 'Feet shoulder-width, sit back like a chair, stand tall and squeeze glutes.' },
  { muscle: 'Legs', equipment: ['Dumbbells'], name: 'Goblet Squat', steps: 'Hold one dumbbell at chest, squat down, keep heels heavy, drive up.' },
  { muscle: 'Legs', equipment: ['Bench'], name: 'Step-ups', steps: 'Step onto a bench, push through the front heel, switch legs each rep.' },
  { muscle: 'Core', equipment: ['None'], name: 'Plank', steps: 'Elbows under shoulders, squeeze glutes, hold for slow breaths.' },
  { muscle: 'Core', equipment: ['Dumbbells'], name: 'Deadbug Hold', steps: 'Hold a light weight over chest, lower opposite arm and leg, keep lower back down.' },
  { muscle: 'Core', equipment: ['Bench'], name: 'Bench Leg Raise', steps: 'Lie on a bench, brace, lift legs up, lower without swinging.' }
];

const userState = {
  isSubscribed: false,
  completedPlans: []
};

const BASE_STYLES = `
  <style>
    :root {
      --accent: #4f8cff;
      --accent-dark: #2563eb;
      --bg: #0d111f;
      --panel: #131a33;
      --panel-light: #1a2345;
      --text: #f5f7ff;
      --muted: #a0aedb;
      --border: rgba(255,255,255,0.12);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Segoe UI', 'Inter', Arial, sans-serif;
      color: var(--text);
      background: radial-gradient(circle at top, rgba(79,140,255,0.18), transparent 55%), var(--bg);
      min-height: 100vh;
    }
    a { color: inherit; text-decoration: none; }
    .site-header {
      position: sticky;
      top: 0;
      background: rgba(8,12,27,0.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      z-index: 10;
    }
    .header-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
      color: var(--accent);
    }
    .brand img {
      height: 56px;
      border-radius: 12px;
    }
    .nav-links {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      color: var(--muted);
      font-size: 0.95rem;
    }
    .page-shell {
      max-width: 1100px;
      margin: 0 auto;
      padding: 48px 24px 72px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 28px 30px;
      box-shadow: 0 28px 60px rgba(0,0,0,0.35);
    }
    .landing-hero {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      background: linear-gradient(135deg, #131b36, #1b2750);
    }
    .hero-tag {
      display: inline-flex;
      align-items: center;
      padding: 6px 16px;
      border-radius: 999px;
      background: rgba(255,255,255,0.15);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.78rem;
      color: #d6e3ff;
    }
    .hero-intro h1 {
      margin: 14px 0 12px;
      font-size: clamp(2.4rem, 4vw, 3.2rem);
    }
    .hero-intro p {
      color: var(--muted);
      line-height: 1.65;
      margin-bottom: 24px;
    }
    .hero-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .hero-btn {
      padding: 12px 24px;
      border-radius: 999px;
      font-weight: 600;
      border: 1px solid var(--border);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .hero-btn.primary {
      background: linear-gradient(135deg, #7fc4ff, var(--accent));
      color: #0c1633;
      border: none;
      box-shadow: 0 16px 35px rgba(79,140,255,0.35);
    }
    .hero-btn.secondary {
      color: var(--text);
      background: transparent;
    }
    .hero-btn:hover { transform: translateY(-2px); }
    .hero-secondary-card ul { list-style: none; padding: 0; margin: 0; line-height: 1.7; color: var(--muted); }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    label { font-weight: 600; font-size: 0.95rem; color: var(--text); }
    input, select, textarea {
      margin-top: 6px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.2);
      background: var(--panel-light);
      color: var(--text);
      padding: 12px 14px;
      font-size: 1rem;
    }
    button, .primary-btn {
      border: none;
      border-radius: 12px;
      padding: 14px;
      font-size: 1rem;
      font-weight: 600;
      color: #0c1633;
      background: linear-gradient(135deg, #7fc4ff, var(--accent));
      cursor: pointer;
      box-shadow: 0 18px 35px rgba(79,140,255,0.35);
      transition: transform 0.2s ease;
    }
    button:hover, .primary-btn:hover { transform: translateY(-2px); }
    .plan-card {
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 18px;
      background: var(--panel-light);
      margin-bottom: 16px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.35);
    }
    .plan-card h3 { margin: 0 0 6px; }
    .plan-card p { margin: 4px 0; color: var(--muted); }
    .history-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
    .history-list li { padding: 10px 16px; border-radius: 12px; border: 1px dashed var(--border); color: var(--muted); }
    footer {
      text-align: center;
      color: var(--muted);
      padding: 24px 12px 40px;
      font-size: 0.85rem;
    }
    @media (max-width: 640px) {
      .header-inner { flex-direction: column; align-items: flex-start; }
      .hero-actions { flex-direction: column; }
      .hero-btn { width: 100%; text-align: center; }
      .panel { padding: 22px; }
    }
  </style>
`;

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanInput(value, fallback = '') {
  const trimmed = (value || '').toString().trim();
  return trimmed || fallback;
}

function renderLayout(title, mainContent) {

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${escapeHtml(title)}</title>
        <link rel="stylesheet" href="/styles/main.css">
        ${BASE_STYLES}
      </head>
      <body>
        <main class="page-shell">
          ${mainContent}
        </main>
      </body>
    </html>
  `;
}

app.get('/subscribe', (req, res) => {
  if (userState.isSubscribed) {
    return res.redirect('/planner');
  }
  const body = `
    <section class="panel">
      <span class="hero-tag">Mock checkout</span>
      <h1 style="margin:12px 0 6px;">Pretend subscription</h1>
      <p style="color:var(--muted);">No money moves here. Press the button so the planner unlocks and we can keep the storyline feeling real.</p>
      <form method="POST" action="/subscribe">
        <button type="submit">Confirm subscription</button>
      </form>
    </section>
  `;

  res.send(renderLayout('Subscribe · GymTravel', body));
});

app.post('/subscribe', (req, res) => {
  userState.isSubscribed = true;
  res.redirect('/planner');
});

app.get('/planner', (req, res) => {
  if (!userState.isSubscribed) {
    return res.redirect('/subscribe');
  }
  const muscleOptions = MUSCLE_GROUPS.map(group => `<option value="${group}">${group}</option>`).join('');
  const equipmentOptions = EQUIPMENT_OPTIONS.map(option => `<option value="${option}">${option}</option>`).join('');

  const body = `
    <section class="panel">
      <span class="hero-tag">Workout builder</span>
      <h1 style="margin:12px 0 6px;">Pick a focus</h1>
      <p style="color:var(--muted);">Choose one muscle group and the tools you actually have. We dial up three easy moves with calm cues.</p>
      <form id="generateWorkoutForm" style="color:#111; text-align:left;">
        <div style="margin-bottom:14px;">
          <label style="font-weight:600; color:#111;">Muscle Groups:</label><br>
          <label style="margin-right:12px;"><input type="checkbox" name="muscle" value="Chest"><span style="color:#111;"> Chest</span></label>
          <label style="margin-right:12px;"><input type="checkbox" name="muscle" value="Back"><span style="color:#111;"> Back</span></label>
          <label style="margin-right:12px;"><input type="checkbox" name="muscle" value="Legs"><span style="color:#111;"> Legs</span></label>
          <label><input type="checkbox" name="muscle" value="Core"><span style="color:#111;"> Core</span></label>
        </div>
        <div style="margin-bottom:18px;">
          <label style="font-weight:600; color:#111;">Equipment:</label><br>
          <label style="margin-right:12px;"><input type="checkbox" name="equipment" value="None"><span style="color:#111;"> None</span></label>
          <label style="margin-right:12px;"><input type="checkbox" name="equipment" value="Dumbbells"><span style="color:#111;"> Dumbbells</span></label>
          <label><input type="checkbox" name="equipment" value="Bench"><span style="color:#111;"> Bench</span></label>
        </div>
        <button type="submit" id="generateWorkoutSubmitBtn" style="margin-top:8px; margin-right:10px; background:#111; color:#fff; border-radius:8px; padding:10px 22px; font-size:1rem; font-weight:600; border:none;">Generate</button>
      </form>
      <div id="generatedWorkout"></div>
      <div id="saveWorkoutBtnContainer" style="width:100%;display:flex;justify-content:center;align-items:center;margin:18px 0 0 0;"></div>
      <section id="savedWorkoutsSection" style="margin-top:32px;">
        <h2>Saved Workouts</h2>
        <ul id="savedWorkoutsList" style="list-style:none; padding:0; margin:0;"></ul>
      </section>
      <script>
      (() => {
        let lastGeneratedWorkout = null;
        function showSaveButton() {
          const container = document.getElementById('saveWorkoutBtnContainer');
          if (!container) return;
          if (!container.querySelector('button')) {
            const btn = document.createElement('button');
            btn.id = 'saveWorkoutBtn';
            btn.textContent = 'Save Workout';
            btn.style.margin = '0 auto';
            btn.style.padding = '14px 32px';
            btn.style.fontWeight = '700';
            btn.style.fontSize = '1.08rem';
            btn.style.borderRadius = '12px';
            btn.style.background = 'linear-gradient(135deg, #7fc4ff, #4f8cff)';
            btn.style.color = '#0c1633';
            btn.style.boxShadow = '0 18px 35px rgba(79,140,255,0.35)';
            btn.onclick = saveWorkout;
            container.appendChild(btn);
          } else {
            container.querySelector('button').style.display = 'block';
          }
        }
        function hideSaveButton() {
          const container = document.getElementById('saveWorkoutBtnContainer');
          if (!container) return;
          const btn = container.querySelector('button');
          if (btn) btn.style.display = 'none';
        }
        function generateWorkout(muscles, equipment) {
          const all = ${JSON.stringify(EXERCISES)};
          let filtered = all.filter(e =>
            (!muscles.length || muscles.includes(e.muscle)) &&
            (!equipment.length || e.equipment.some(eq => equipment.includes(eq)))
          );
          return { exercises: filtered.slice(0, 3) };
        }
        function renderWorkout(workout) {
          var container = document.getElementById('generatedWorkout');
          container.innerHTML = '';
          if (!workout || !workout.exercises || !workout.exercises.length) {
            container.innerHTML = '<p>No workout generated.</p>';
            hideSaveButton();
            lastGeneratedWorkout = null;
            return;
          }
          const html = workout.exercises.map(function(ex) {
            return '<article class="exercise-card" style="background:#fff;border:1px solid #bbb;border-radius:18px;padding:20px 32px;margin-bottom:16px;box-shadow:0 4px 16px rgba(0,0,0,0.10);max-width:700px;min-width:320px;width:95vw;margin-left:auto;margin-right:auto;">'
              + '<h3 style="margin:0 0 8px;font-size:1.08rem;color:#111;font-weight:700;text-align:left;">' + ex.name + '</h3>'
              + '<div style="margin-bottom:4px;font-size:0.97rem;color:#111;text-align:left;"><strong>Muscle:</strong> ' + ex.muscle + ' &nbsp; <strong>Equipment:</strong> ' + (Array.isArray(ex.equipment) ? ex.equipment.join(', ') : ex.equipment) + '</div>'
              + '<div style="font-size:0.96rem;line-height:1.35;color:#111;margin-top:2px;text-align:left;">' + ex.steps + '</div>'
            + '</article>';
          }).join('');
          container.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;width:100%;gap:0;">' + html + '</div>';
          lastGeneratedWorkout = workout;
          showSaveButton();
        }
        function saveWorkout() {
          if (!lastGeneratedWorkout || !lastGeneratedWorkout.exercises) return;
          fetch('/api/workouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exercises: lastGeneratedWorkout.exercises })
          })
          .then(res => res.json())
          .then(() => {
            hideSaveButton();
            lastGeneratedWorkout = null;
            loadSavedWorkouts();
          });
        }
        function loadSavedWorkouts() {
          fetch('/api/workouts')
            .then(res => res.json())
            .then(renderSavedWorkouts);
        }
        function deleteWorkout(id) {
          fetch('/api/workouts/' + encodeURIComponent(id), { method: 'DELETE' })
            .then(() => loadSavedWorkouts());
        }
        function renderSavedWorkouts(list) {
          var ul = document.getElementById('savedWorkoutsList');
          if (!ul) return;
          if (!list || !list.length) {
            ul.innerHTML = '<li style="color:#888;">No saved workouts.</li>';
            return;
          }
          ul.innerHTML = list.map(function(w, i) {
            return '<li style="margin-bottom:10px;">Workout #' + (i+1) + ' &mdash; ' + w.exercises.length + ' exercises <button onclick="deleteWorkout(\'' + w.id + '\')" style="margin-left:12px;">Delete</button></li>';
          }).join('');
        }
        document.getElementById('generateWorkoutForm').onsubmit = function(e) {
          e.preventDefault();
          const form = e.target;
          const muscles = Array.from(form.querySelectorAll('input[name="muscle"]:checked')).map(cb => cb.value);
          const equipment = Array.from(form.querySelectorAll('input[name="equipment"]:checked')).map(cb => cb.value);
          const workout = generateWorkout(muscles, equipment);
          renderWorkout(workout);
        };
        loadSavedWorkouts();
        hideSaveButton();
        window.deleteWorkout = deleteWorkout;
      })();
      </script>
    `;
  res.send(renderLayout('Planner · GymTravel', body));
});

const exerciseController = {
  getAll(req, res) {
    res.json(getAllItems("exercises").sort((a, b) => a.name.localeCompare(b.name)));
  },
  create(req, res) {
    res.status(201).json(createItem("exercises", req.body));
  },
  update(req, res) {
    const { id } = req.params;
    let data = { ...req.body };
    if (typeof data.equipment === "string") data.equipment = data.equipment.split(",").map(e => e.trim());
    const updated = updateItem("exercises", id, data);
    if (!updated) return res.status(404).json({ error: "Exercise not found" });
    res.json(updated);
  },
  remove(req, res) {
    const { id } = req.params;
    const success = deleteItem("exercises", id);
    if (!success) return res.status(404).json({ error: "Exercise not found" });
    res.json({ success: true });
  }
};

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

