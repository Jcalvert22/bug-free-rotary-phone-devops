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

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const equipmentOptions = EQUIPMENT_LIST.map(eq => `<label><input type="checkbox" name="equipment" value="${eq}"> ${eq}</label><br>`).join('');
  res.send(`
    <h1>Starter Gym Planner</h1>
    <form method="POST" action="/plan">
      <p>Select the equipment you have access to:</p>
      ${equipmentOptions}
      <button type="submit">Build My Plan</button>
    </form>
  `);
});

app.post('/plan', (req, res) => {
  let selected = req.body.equipment;
  if (!selected) selected = [];
  if (!Array.isArray(selected)) selected = [selected];
  const plan = WORKOUTS.filter(w => w.equipment.some(eq => selected.includes(eq)));
  const planHtml = plan.length
    ? `<ul>${plan.map(w => `<li>${w.name} (${w.equipment.join(', ')})</li>`).join('')}</ul>`
    : '<p>No workouts available for selected equipment.</p>';
  res.send(`
    <h1>Your Custom Gym Plan</h1>
    <p>Based on your equipment:</p>
    ${planHtml}
    <a href="/">Back</a>
  `);
});

//start the server.
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
