export function getRecommendedWeight(ex, benchMax, squatMax, deadliftMax, percent, noMax) {
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