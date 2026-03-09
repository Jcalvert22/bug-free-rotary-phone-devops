// --- Workouts CRUD UI and AJAX ---

// Save Workout Button (to be shown after generation)
// Add this button to your HTML where the generated workout is displayed
// <button id="save-workout-btn" style="display:none;">Save Workout</button>

// Saved Workouts Panel
// <div id="saved-workouts-panel" style="display:none;">
//   <h2>Saved Workouts</h2>
//   <ul id="saved-workouts-list"></ul>
// </div>

// Edit Workout Modal
// <div id="edit-workout-modal" style="display:none;">
//   <form id="edit-workout-form">
//     <label>Workout Name<input type="text" id="edit-workout-name" required></label>
//     <label>Notes<textarea id="edit-workout-notes"></textarea></label>
//     <button type="submit">Save Changes</button>
//     <button type="button" id="cancel-edit-workout">Cancel</button>
//   </form>
// </div>

// Delete Confirmation Modal
// <div id="delete-workout-modal" style="display:none;">
//   <p>Are you sure you want to delete this workout?</p>
//   <button id="confirm-delete-workout">Delete</button>
//   <button id="cancel-delete-workout">Cancel</button>
// </div>

// --- JavaScript for Workout CRUD ---

function showSaveWorkoutButton(generatedWorkout) {
  const btn = document.getElementById('save-workout-btn');
  btn.style.display = '';
  btn.onclick = function() {
    saveWorkout(generatedWorkout);
  };
}

function saveWorkout(workout) {
  fetch('/api/workouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workout)
  })
  .then(res => res.json())
  .then(() => {
    loadSavedWorkouts();
    document.getElementById('save-workout-btn').style.display = 'none';
  });
}

function loadSavedWorkouts() {
  fetch('/api/workouts')
    .then(res => res.json())
    .then(workouts => renderSavedWorkouts(workouts));
}

function renderSavedWorkouts(workouts) {
  const panel = document.getElementById('saved-workouts-panel');
  const list = document.getElementById('saved-workouts-list');
  panel.style.display = '';
  list.innerHTML = '';
  workouts.forEach(w => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${w.name}</strong> (${new Date(w.createdAt).toLocaleDateString()}) - ${w.exercises.length} exercises
      <button class="edit-workout-btn" data-id="${w.id}">Edit</button>
      <button class="delete-workout-btn" data-id="${w.id}">Delete</button>
    `;
    list.appendChild(li);
  });
}

let editingWorkoutId = null;
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('saved-workouts-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-workout-btn')) {
      const id = e.target.getAttribute('data-id');
      fetch(`/api/workouts`)
        .then(res => res.json())
        .then(workouts => {
          const workout = workouts.find(w => w.id == id);
          if (workout) {
            editingWorkoutId = id;
            document.getElementById('edit-workout-name').value = workout.name || '';
            document.getElementById('edit-workout-notes').value = workout.notes || '';
            document.getElementById('edit-workout-modal').style.display = '';
          }
        });
    }
    if (e.target.classList.contains('delete-workout-btn')) {
      editingWorkoutId = e.target.getAttribute('data-id');
      document.getElementById('delete-workout-modal').style.display = '';
    }
  });

  document.getElementById('edit-workout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    fetch(`/api/workouts/${editingWorkoutId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('edit-workout-name').value,
        notes: document.getElementById('edit-workout-notes').value
      })
    })
    .then(res => res.json())
    .then(() => {
      document.getElementById('edit-workout-modal').style.display = 'none';
      loadSavedWorkouts();
    });
  });
  document.getElementById('cancel-edit-workout').onclick = function() {
    document.getElementById('edit-workout-modal').style.display = 'none';
  };

  document.getElementById('confirm-delete-workout').onclick = function() {
    fetch(`/api/workouts/${editingWorkoutId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        document.getElementById('delete-workout-modal').style.display = 'none';
        loadSavedWorkouts();
      });
  };
  document.getElementById('cancel-delete-workout').onclick = function() {
    document.getElementById('delete-workout-modal').style.display = 'none';
  };

  // Optionally, call loadSavedWorkouts() on page load to show saved workouts
  // loadSavedWorkouts();
});
