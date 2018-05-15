import * as tf from '@tensorflow/tfjs';

import {StrikeZoneData} from './data';
import {StrikeZoneModel} from './model';
import {draw} from './plot';

const data = new StrikeZoneData('http://localhost:1234/data.csv', 100);
const model = new StrikeZoneModel();

async function start() {
  await data.load();

  // model.train(1, data.batches, (result) => {
  //   console.log(`step ${model.steps}] loss: ${
  //       result.loss.toFixed(4)} accuracy: ${result.accuracy.toFixed(4)}`);
  // });

  const result = model.predict(data.zone());

  // Draw out 2d histogram of training data:
  const pxs = [];
  const pzs = [];
  data.data.forEach((d) => {
    pxs.push(d.x[0]);
    pzs.push(d.x[1]);
  });

  draw(pxs, pzs);
}

start();