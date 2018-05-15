import * as tf from '@tensorflow/tfjs';

import {StrikeZoneData} from './data';
import {StrikeZoneModel} from './model';

const data = new StrikeZoneData('http://localhost:1234/data.csv', 100);
const model = new StrikeZoneModel();

async function start() {
  await data.load();

  model.train(1, data.batches, (result) => {
    console.log(`step ${model.steps}] loss: ${
        result.loss.toFixed(4)} accuracy: ${result.accuracy.toFixed(4)}`);
  });

  const result = model.predict(data.zone());
}

start();