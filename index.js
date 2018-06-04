import * as tf from '@tensorflow/tfjs';

import {StrikeZoneData} from './data';
import {strikeZoneHeatmap, testHeatmap} from './heatmap';
import {StrikeZoneModel} from './model';
import {draw, draw2, heatmap} from './plot';
import {d3plotTest} from './test';

const DATA_URL =
    'https://gist.githubusercontent.com/nkreeger/43edc6e6daecc2cb02a2dd3293a08f29/raw/51ad4623fe7811c84f9c3638c0631d64530068f6/sz-train-data.csv';
const data = new StrikeZoneData(DATA_URL, 100);
const model = new StrikeZoneModel();

// Draw out 2d histogram of training data:
function plotTrainingData() {
  const balls = {x: [], y: []};
  const strikes = {x: [], y: []};
  data.data.forEach((d) => {
    const x = d.x[0];
    const y = d.x[1];

    if (d.y) {
      balls.x.push(x);
      balls.y.push(y);
    } else {
      strikes.x.push(x);
      strikes.y.push(y);
    }
  });
  draw2('trainingData', balls, strikes);
}

function plotZoneData() {
  const results = model.predictAll(data.zone());
  const balls = {x: [], y: []};
  const strikes = {x: [], y: []};

  const coords = [];
  let index = 0;
  data.zoneCoordinates.forEach((d) => {
    const result = results[index++][0];
    coords.push(
        {x: d.x[0], y: d.x[1], strike: result.strike, value: result.value});
  });

  console.log('coords.length', coords.length);
  strikeZoneHeatmap(coords);
}

async function start() {
  await data.load();

  plotTrainingData();

  testHeatmap();
  plotZoneData();

  await tf.nextFrame();

  for (let i = 0; i < 1; i++) {  // break out.
    for (let j = 0; j < data.batches.length; j++) {
      model.train(data.batches[j], (result) => {
        if (model.steps % 100 === 0) {
          console.log(`step [${model.steps}] loss: ${
              result.loss.toFixed(4)} accuracy:${result.accuracy.toFixed(4)}`);
        }
      });
      if (j % 10 === 0) {
        plotZoneData();
      }
      await tf.nextFrame();
    }
  }
}

start();