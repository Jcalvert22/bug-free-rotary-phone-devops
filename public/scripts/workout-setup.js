// Workout Setup Modal logic

document.addEventListener('DOMContentLoaded', function() {
  // Show modal on Start Workout click
  var startBtn = document.querySelector('.hero-btn.primary');
  if (startBtn) {
    startBtn.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('workout-setup-modal').style.display = 'flex';
    });
  }

  // Close modal
  document.getElementById('close-setup-modal').onclick = function() {
    document.getElementById('workout-setup-modal').style.display = 'none';
  };

  // Handle Generate Workout
  document.getElementById('workout-setup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const muscles = Array.from(document.querySelectorAll('input[name="muscle"]:checked')).map(cb => cb.value);
    const equipment = Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(cb => cb.value);
    const gymxiety = document.getElementById('gymxiety-toggle').checked;

    // Call your existing generator function
    const workout = generateWorkout({ muscles, equipment, gymxiety });

    // Render the generated workout
    const container = document.getElementById('generated-workout');
    container.innerHTML = renderWorkout(workout); // assumes you have a renderWorkout() function

    // Show Save button
    document.getElementById('save-workout-btn').style.display = '';

    // Hide modal
    document.getElementById('workout-setup-modal').style.display = 'none';
  });
});
// File intentionally left blank: logic is now in app.mjs
