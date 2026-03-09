// Workout Setup Modal UI and JS
// Add the HTML snippet to your main HTML file where appropriate
// Requires a button with id="startWorkoutBtn" somewhere in your UI

document.addEventListener('DOMContentLoaded', function() {
  // Show modal on Start Workout click
  var startBtn = document.getElementById('startWorkoutBtn');
  if (startBtn) {
    startBtn.onclick = function() {
      document.getElementById('workoutSetupModal').style.display = 'block';
    };
  }

  // Close modal
  document.getElementById('closeWorkoutSetup').onclick = function() {
    document.getElementById('workoutSetupModal').style.display = 'none';
  };

  // Handle Generate Workout
  document.getElementById('generateWorkoutBtn').onclick = function() {
    const muscles = Array.from(document.querySelectorAll('input[name="muscle"]:checked')).map(cb => cb.value);
    const equipment = Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(cb => cb.value);

    const workout = generateWorkout(muscles, equipment);
    renderWorkout(workout);
    document.getElementById('workoutSetupModal').style.display = 'none';
  };
});

// Render the generated workout in #generatedWorkout
function renderWorkout(workout) {
  const container = document.getElementById('generatedWorkout');
  container.innerHTML = '';
  if (!workout || !workout.exercises || !workout.exercises.length) {
    container.innerHTML = '<p>No workout generated.</p>';
    return;
  }
  const html = workout.exercises.map(ex =>
    `<div class="exercise-card">
      <h3>${ex.name}</h3>
      <p><strong>Muscle:</strong> ${ex.muscle} · <strong>Equipment:</strong> ${Array.isArray(ex.equipment) ? ex.equipment.join(', ') : ex.equipment}</p>
      <p>${ex.steps}</p>
    </div>`
  ).join('');
  container.innerHTML = html;
}
