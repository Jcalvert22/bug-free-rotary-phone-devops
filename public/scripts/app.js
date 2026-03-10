// GymTravel SPA — Generate → Display → Save workout flow
(function () {
  // ── Static exercise data ──
  var EXERCISES = [
    { muscle: 'Chest',   equipment: ['None'],      name: 'Wall Push-ups',       steps: 'Stand an arm-length from a wall, bend elbows until nose nears the wall, press out slowly.' },
    { muscle: 'Chest',   equipment: ['Dumbbells'], name: 'Floor Press',          steps: 'Lie on your back, press dumbbells straight up, pause, lower with control.' },
    { muscle: 'Chest',   equipment: ['Bench'],     name: 'Incline Push-up',      steps: 'Hands on a bench, body in one line, lower chest to the edge, press up.' },
    { muscle: 'Back',    equipment: ['None'],      name: 'Backpack Row',         steps: 'Hinge at the hips, grab a backpack, pull it toward ribs, squeeze shoulder blades.' },
    { muscle: 'Back',    equipment: ['Dumbbells'], name: 'Bent Over Row',        steps: 'Hinge, keep back flat, row bells toward pockets, pause, lower slow.' },
    { muscle: 'Back',    equipment: ['Bench'],     name: 'Bench Supported Row',  steps: 'One hand on a bench for balance, row the weight toward your hip.' },
    { muscle: 'Legs',    equipment: ['None'],      name: 'Bodyweight Squat',     steps: 'Feet shoulder-width, sit back like a chair, stand tall and squeeze glutes.' },
    { muscle: 'Legs',    equipment: ['Dumbbells'], name: 'Goblet Squat',         steps: 'Hold one dumbbell at chest, squat down, keep heels heavy, drive up.' },
    { muscle: 'Legs',    equipment: ['Bench'],     name: 'Step-ups',             steps: 'Step onto a bench, push through the front heel, switch legs each rep.' },
    { muscle: 'Core',    equipment: ['None'],      name: 'Plank',                steps: 'Elbows under shoulders, squeeze glutes, hold for slow breaths.' },
    { muscle: 'Core',    equipment: ['Dumbbells'], name: 'Deadbug Hold',         steps: 'Hold a light weight over chest, lower opposite arm and leg, keep lower back down.' },
    { muscle: 'Core',    equipment: ['Bench'],     name: 'Bench Leg Raise',      steps: 'Lie on a bench, brace, lift legs up, lower without swinging.' }
  ];

  // ── State ──
  var currentWorkout = null;

  // ── generateWorkoutV3 ──
  function generateWorkoutV3(muscles, equipment) {
    var filtered = EXERCISES.filter(function (e) {
      return (!muscles.length || muscles.includes(e.muscle)) &&
             (!equipment.length || e.equipment.some(function (eq) { return equipment.includes(eq); }));
    });
    return { id: Date.now().toString(), exercises: filtered.slice(0, 3) };
  }

  // ── renderGeneratedWorkout ──
  function renderGeneratedWorkout(workout) {
    var container = document.getElementById('generatedWorkout');
    if (!container) return;
    if (!workout || !workout.exercises || !workout.exercises.length) {
      container.innerHTML = '<p>No exercises matched your selections. Try different options.</p>';
      currentWorkout = null;
      return;
    }
    var cards = workout.exercises.map(function (ex) {
      return '<article style="background:#fff;border:1px solid #bbb;border-radius:18px;padding:20px 32px;margin-bottom:16px;'
        + 'box-shadow:0 4px 16px rgba(0,0,0,0.10);max-width:700px;min-width:320px;width:95vw;margin-left:auto;margin-right:auto;">'
        + '<h3 style="margin:0 0 8px;font-size:1.08rem;color:#111;font-weight:700;text-align:left;">' + ex.name + '</h3>'
        + '<div style="margin-bottom:4px;font-size:0.97rem;color:#111;text-align:left;"><strong>Muscle:</strong> ' + ex.muscle
        + ' &nbsp; <strong>Equipment:</strong> ' + (Array.isArray(ex.equipment) ? ex.equipment.join(', ') : ex.equipment) + '</div>'
        + '<div style="font-size:0.96rem;line-height:1.35;color:#111;margin-top:2px;text-align:left;">' + ex.steps + '</div>'
        + '</article>';
    }).join('');
    container.innerHTML =
      '<div style="display:flex;flex-direction:column;align-items:center;width:100%;gap:0;">'
      + cards
      + '<button id="saveGeneratedWorkoutBtn" style="margin:18px 0 0 0;">Save Workout</button>'
      + '</div>';
    currentWorkout = workout;
  }

  // ── createWorkout → POST /api/workouts ──
  function createWorkout(workout) {
    return fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exercises: workout.exercises })
    }).then(function (res) { return res.json(); });
  }

  // ── loadSavedWorkouts ──
  function loadSavedWorkouts() {
    fetch('/api/workouts')
      .then(function (res) { return res.json(); })
      .then(renderSavedWorkouts);
  }

  // ── renderSavedWorkouts ──
  function renderSavedWorkouts(list) {
    var ul = document.getElementById('savedWorkoutsList');
    if (!ul) return;
    if (!list || !list.length) {
      ul.innerHTML = '<li style="color:#888;">No saved workouts.</li>';
      return;
    }
    ul.innerHTML = list.map(function (w, i) {
      return '<li style="margin-bottom:10px;">Workout #' + (i + 1) + ' &mdash; ' + w.exercises.length
        + ' exercises'
        + ' <button onclick="window.viewWorkout(\'' + w.id + '\')" style="margin-left:12px;">View</button>'
        + ' <button onclick="window.deleteWorkout(\'' + w.id + '\')" style="margin-left:8px;">Delete</button>'
        + '</li>';
    }).join('');
  }

  // ── viewWorkout → GET /api/workouts/:id ──
  function viewWorkout(id) {
    fetch('/api/workouts/' + encodeURIComponent(id))
      .then(function (res) { return res.json(); })
      .then(function (workout) {
        if (!workout || workout.error) return;
        var container = document.getElementById('generatedWorkout');
        if (!container) return;
        var cards = workout.exercises.map(function (ex) {
          return '<article style="background:#fff;border:1px solid #bbb;border-radius:18px;padding:20px 32px;margin-bottom:16px;'
            + 'box-shadow:0 4px 16px rgba(0,0,0,0.10);max-width:700px;min-width:320px;width:95vw;margin-left:auto;margin-right:auto;">'
            + '<h3 style="margin:0 0 8px;font-size:1.08rem;color:#111;font-weight:700;text-align:left;">' + ex.name + '</h3>'
            + '<div style="margin-bottom:4px;font-size:0.97rem;color:#111;text-align:left;"><strong>Muscle:</strong> ' + ex.muscle
            + ' &nbsp; <strong>Equipment:</strong> ' + (Array.isArray(ex.equipment) ? ex.equipment.join(', ') : ex.equipment) + '</div>'
            + '<div style="font-size:0.96rem;line-height:1.35;color:#111;margin-top:2px;text-align:left;">' + ex.steps + '</div>'
            + '</article>';
        }).join('');
        container.innerHTML =
          '<div style="display:flex;flex-direction:column;align-items:center;width:100%;gap:0;">'
          + '<p style="color:#a0aedb;font-size:0.9rem;margin:0 0 12px 0;">Viewing saved workout</p>'
          + cards
          + '</div>';
        container.scrollIntoView({ behavior: 'smooth' });
      });
  }

  // ── deleteWorkout ──
  function deleteWorkout(id) {
    fetch('/api/workouts/' + encodeURIComponent(id), { method: 'DELETE' })
      .then(function () { loadSavedWorkouts(); });
  }

  // ── Wire everything up after DOM is ready ──
  document.addEventListener('DOMContentLoaded', function () {
    var openBtn  = document.getElementById('generateWorkoutMainBtn');
    var modal    = document.getElementById('generateWorkoutModal');
    var closeBtn = document.getElementById('closeGenerateWorkoutModal');
    var form     = document.getElementById('generateWorkoutForm');

    if (openBtn && modal) {
      openBtn.addEventListener('click', function () { modal.style.display = 'flex'; });
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', function () { modal.style.display = 'none'; });
    }
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var muscles   = Array.from(form.querySelectorAll('input[name="muscle"]:checked')).map(function (cb) { return cb.value; });
        var equipment = Array.from(form.querySelectorAll('input[name="equipment"]:checked')).map(function (cb) { return cb.value; });
        var workout = generateWorkoutV3(muscles, equipment);
        renderGeneratedWorkout(workout);
        if (modal) modal.style.display = 'none';
      });
    }

    // Delegated click for #saveGeneratedWorkoutBtn (rendered inside #generatedWorkout)
    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'saveGeneratedWorkoutBtn') {
        if (!currentWorkout) return;
        var snapshot = currentWorkout;
        currentWorkout = null;
        e.target.disabled = true;
        e.target.textContent = 'Saving\u2026';
        createWorkout(snapshot).then(function () {
          document.getElementById('generatedWorkout').innerHTML = '<p>Workout saved!</p>';
          loadSavedWorkouts();
        });
      }
    });

    loadSavedWorkouts();
    window.deleteWorkout = deleteWorkout;
    window.viewWorkout   = viewWorkout;
  });
}());
