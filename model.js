/**
 * * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from '@tensorflow/tfjs';

/**
 * Model that learns to call balls and strikes based on ball placement at home
 * plate, strike zone height, and side the batter is hitting from.
 */
export class StrikeZoneModel {
  constructor() {
    const model = tf.sequential();
    model.add(
        tf.layers.dense({units: 40, activation: 'relu', inputShape: [5]}));
    model.add(tf.layers.dense({units: 20, activation: 'relu'}));
    model.add(tf.layers.dropout({rate: 0.1}))
    model.add(tf.layers.dense({units: 2, activation: 'softmax'}));
    model.compile({
      optimizer: tf.train.adam(),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    this.model = model;
    this.steps = 0;
  }

  async train(epochs, data, callback) {
    for (let i = 0; i < epochs; i++) {
      for (let j = 0; j < data.length; j++) {
        const batch = data[j];
        await this.model.fit(batch.x, batch.y, {
          epochs: 1,
          shuffle: false,
          validationData: [batch.x, batch.y],
          batchSize: 100,
          callbacks: {
            onEpochEnd: async (epoch, logs) => {
              callback({accuracy: logs.acc, loss: logs.loss});
            }
          }
        });
        this.steps++;
      }
    }
  }

  /**
   * Returns ball/strike prediction (sorted) for a given pitch.
   */
  predict(pitch) {
    const pitchTensor = createPitchTensor(pitch, this.fields);
    const predict = this.model.predict(pitchTensor);
    const values = predict.dataSync();

    let list = [];
    list.push({value: values[0], strike: 1});
    list.push({value: values[1], strike: 0});
    list = list.sort((a, b) => b.value - a.value);
    return list;
  }
}
