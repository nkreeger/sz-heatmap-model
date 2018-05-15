import * as tf from '@tensorflow/tfjs';
import request from 'request';

// Training data min/max
const PX_MIN = -4.45762067272607;
const PX_MAX = 3.85448981704365;
const PZ_MIN = -1.61563125700913;
const PZ_MAX = 6.26978752306894;
const SZ_TOP_MIN = 2.5935608664315772;
const SZ_TOP_MAX = 4.168012842802437;
const SZ_BOT_MIN = 1.101950458012329;
const SZ_BOT_MAX = 2.0567841383940433;

export async function loadTrainingData(path) {
  request(path, (err, response) => {
    const values = response.body.split(/\r|\n/);
    values.forEach((value) => {
      const values = value.split(',');
      if (values.length > 0) {
        console.log('values.length', values.length);
      }
    });
  });
}

function normalize(value, min, max) {
  if (min === undefined || max === undefined) {
    return value;
  }
  return (value - min) / (max - min);
}
