import * as tf from '@tensorflow/tfjs';
import request from 'request';

// Training data min/max
const PX_MIN = -4.45762067272607;
const PX_MAX = 3.85448981704365;
const PZ_MIN = -3.76231226128815;
const PZ_MAX = 11.180078178590072;
const SZ_TOP_MIN = 1.7929009850154356;
const SZ_TOP_MAX = 4.237597144526745;
const SZ_BOT_MIN = 1.0886030433281277;
const SZ_BOT_MAX = 3.290477690029501;

export async function loadTrainingData(path) {
  request(path, (err, response) => {
    const values = response.body.split(/\r|\n/);
    // values.forEach((value) => {
    // });
    console.log('left off right here', values.length);
    console.log('test', values[0].split(','));
  });
}

function normalize(value, min, max) {
  if (min === undefined || max === undefined) {
    return value;
  }
  return (value - min) / (max - min);
}
