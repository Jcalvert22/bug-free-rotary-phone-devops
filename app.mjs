//app.js
//es5 syntax => const express = require('express')
//es6 syntax => import { express } from 'module-name'

import express from 'express'

const app = express()


// Basic equipment and workout plan logic
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

const WORKOUTS = [
  { name: 'Push-ups', equipment: ['Bodyweight Only'] },
  { name: 'Squats', equipment: ['Bodyweight Only', 'Dumbbells', 'Barbell'] },
  { name: 'Bench Press', equipment: ['Barbell', 'Bench', 'Dumbbells'] },
  { name: 'Deadlift', equipment: ['Barbell', 'Dumbbells'] },
  { name: 'Pull-ups', equipment: ['Pull-up Bar'] },
  { name: 'Kettlebell Swings', equipment: ['Kettlebell'] },
  { name: 'Banded Rows', equipment: ['Resistance Bands'] },
  { name: 'Running', equipment: ['Treadmill'] },
  { name: 'Cycling', equipment: ['Stationary Bike'] },
];

const EXERCISES = [
  {
    "name": "Push-up",
    "equipment": ["Bodyweight"],
    "muscle_group": "Chest"
  },
  {
    "name": "Incline Push-up",
    "equipment": ["Bodyweight", "Bench"],
    "muscle_group": "Upper Chest"
  },
  {
    "name": "Triceps Dip",
    "equipment": ["Bodyweight", "Bench"],
    "muscle_group": "Triceps"
  },
  {
    "name": "Bicep Curl",
    "equipment": ["Dumbbells", "Barbell", "Resistance Bands"],
    "muscle_group": "Biceps"
  },
  {
    "name": "Wrist Curl",
    "equipment": ["Dumbbells", "Barbell"],
    "muscle_group": "Forearms"
  },
  {
    "name": "Pull-up",
    "equipment": ["Pull-up Bar"],
    "muscle_group": "Back"
  },
  {
    "name": "Shrug",
    "equipment": ["Dumbbells", "Barbell"],
    "muscle_group": "Traps"
  },
  {
    "name": "Squat",
    "equipment": ["Bodyweight", "Barbell", "Dumbbells"],
    "muscle_group": "Quads"
  },
  {
    "name": "Calf Raise",
    "equipment": ["Bodyweight", "Dumbbells"],
    "muscle_group": "Calves"
  },
  {
    "name": "Hamstring Curl",
    "equipment": ["Resistance Bands"],
    "muscle_group": "Hamstrings"
  }
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

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const equipmentOptions = EQUIPMENT_LIST.map(eq => `<label><input type="checkbox" name="equipment" value="${eq}"> ${eq}</label><br>`).join('');
  const muscleOptions = MUSCLE_GROUPS.map(mg => `<label><input type="checkbox" name="muscle" value="${mg}"> ${mg}</label><br>`).join('');
  res.send(`
    <h1>Starter Gym Planner</h1>
    <form method="POST" action="/plan">
      <p>Select the equipment you have access to:</p>
      ${equipmentOptions}
      <hr>
      <p>Select the muscle groups you want to hit:</p>
      ${muscleOptions}
      <hr>
      <p>
        <label>
          <input type="radio" name="mode" value="dieting" checked> Dieting (High reps, low weight)
        </label>
        <label>
          <input type="radio" name="mode" value="bulking"> Bulking (Low reps, high weight)
        </label>
      </p>
      <button type="submit">Build My Plan</button>
    </form>
  `);
});

app.post('/plan', (req, res) => {
  let selected = req.body.equipment;
  let selectedMuscles = req.body.muscle;
  let mode = req.body.mode || 'dieting';
  if (!selected) selected = [];
  if (!Array.isArray(selected)) selected = [selected];
  if (!selectedMuscles) selectedMuscles = [];
  if (!Array.isArray(selectedMuscles)) selectedMuscles = [selectedMuscles];

  const repRange = mode === 'bulking' ? '4-8 reps, heavy weight' : '12-20 reps, light/moderate weight';

  const plan = EXERCISES.filter(ex =>
    ex.equipment.some(eq => selected.includes(eq) || (eq === "Bodyweight" && selected.includes("Bodyweight Only"))) &&
    selectedMuscles.includes(ex.muscle_group)
  );
  const planHtml = plan.length
    ? `<ul>${plan.map(ex => `<li>${ex.name} (${ex.equipment.join(', ')}) - ${ex.muscle_group} <br><strong>Recommended: ${repRange}</strong></li>`).join('')}</ul>`
    : '<p>No workouts available for selected equipment and muscle group.</p>';
  res.send(`
    <h1>Your Custom Gym Plan</h1>
    <p>Based on your equipment, muscle group(s), and goal (${mode === 'bulking' ? 'Bulking' : 'Dieting'}):</p>
    ${planHtml}
    <a href="/">Back</a>
  `);
});

//start the server.
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
