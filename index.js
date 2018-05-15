import * as tf from '@tensorflow/tfjs';

import {StrikeZoneData} from './data';
import {StrikeZoneModel} from './model';
import {draw} from './plot';
import {HeatMap} from './simpleheat';

const data = new StrikeZoneData('http://localhost:1234/data.csv', 100);
const model = new StrikeZoneModel();

async function start() {
  await data.load();

  // model.train(1, data.batches, (result) => {
  //   console.log(`step ${model.steps}] loss: ${
  //       result.loss.toFixed(4)} accuracy: ${result.accuracy.toFixed(4)}`);
  // });

  const results = model.predictAll(data.zone());
  console.log(`Found: ${results.length}`);
  console.log(`Data coords: ${data.zoneCoordinates.length}`);

  // Draw out 2d histogram of training data:
  const pxs = [];
  const pzs = [];
  data.data.forEach((d) => {
    pxs.push(d.x[0]);
    pzs.push(d.x[1]);
  });
  draw('trainingData', pxs, pzs);

  const heatmap = new HeatMap('test');
  const points = [];
  let index = 0;
  data.zoneCoordinates.forEach((d) => {
    const result = results[index++][0];
    if (result.strike) {
      points.push({x: d.x[0], y: d.x[1], value: result.value});
      heatmap.add([d.x[0], d.x[1], result.value]);
    }
  });
  heatmap.draw();
}

start();