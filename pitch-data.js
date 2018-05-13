/**
 * @license
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
import { readFileSync } from 'fs';
import { normalize } from './utils';


/**
 * Converts a Pitch object to a Tensor based on the given training fields.
 */
export function createPitchTensor(pitch, fields) {
  return createPitchesTensor([pitch], fields);
}

/**
 * Converts a list of Pitch objects to a batch Tensor based on the given
 * training fields.
 */
export function createPitchesTensor(pitches, fields) {
  const shape = [pitches.length, fields.length];
  const data = new Float32Array(tf.util.sizeFromShape(shape));

  return tf.tidy(() => {
    let offset = 0;
    for (let i = 0; i < pitches.length; i++) {
      const pitch = pitches[i];
      data.set(pitchTrainDataArray(pitch, fields), offset);
      offset += fields.length;
    }
    return tf.tensor2d(data, shape);
  });
}

/**
 * Returns an array of pitch class Tensors, each Tensor contains every pitch for
 * a given pitch class.
 */
export function concatPitchClassTensors(filename, fields, numPitchClasses, pitchClassSize) {
  const classTensors = [];
  const testPitches = loadPitchData('dist/pitch_type_training_data.json');
  let index = 0;
  for (let i = 0; i < numPitchClasses; i++) {
    const pitches = [];
    for (let j = 0; j < pitchClassSize; j++) {
      pitches.push(testPitches[index]);
      index++;
    }
    classTensors[i] = createPitchesTensor(pitches, fields);
  }
  return classTensors;
}

/**
 * Loads a JSON training file and the content to a Pitch array.
 */
export function loadPitchData(filename) {
  const pitches = [];
  const content = readFileSync(filename, 'utf-8').split('\n');
  for (let i = 0; i < content.length - 1; i++) {
    pitches.push(JSON.parse(content[i]));
  }
  return pitches;
}

/**
 * Data class that enables easy of converting Pitch objects into training
 * Tensors.
 */
export class PitchData {
  constructor(filename, batchSize, fields, labelCount, generateLabel) {

    this.batchSize = batchSize;
    this.fields = fields;
    this.generateLabel = generateLabel;
    this.labelCount = labelCount;
    this.index = 0;

    // Load and convert training data to batches.
    const pitchData = loadPitchData(filename);
    tf.util.shuffle(pitchData);
    this.batches = [];
    this.batches = this.generateBatch(pitchData);
  }

  /**
   * Generates a batch of training data for a list of Pitch objects.
   */
  generateBatch(pitches) {
    const batches = [];
    let index = 0;
    let batchSize = this.batchSize;
    while (index < pitches.length) {
      if (pitches.length - index < this.batchSize) {
        batchSize = pitches.length - index;
      }
      batches.push(
        this.singlePitchBatch(pitches.slice(index, index + batchSize)));

      index += this.batchSize;
    }
    return batches;
  }

  singlePitchBatch(pitches) {
    const shape = [pitches.length, this.fields.length];
    const data = new Float32Array(tf.util.sizeFromShape(shape));
    const labels = [];

    return tf.tidy(() => {
      let offset = 0;
      for (let i = 0; i < pitches.length; i++) {
        const pitch = pitches[i];

        // Assign pitch fields
        data.set(pitchTrainDataArray(pitch, this.fields), offset);
        offset += this.fields.length;

        // Assign label
        labels.push(this.generateLabel(pitch));
      }
      return {
        pitches: tf.tensor2d(data, shape),
        labels:
          tf.oneHot(tf.tensor1d(labels, 'int32'), this.labelCount).toFloat()
      };
    });
  }

  /**
   * Returns entire list of stored pitch training batches.
   */
  pitchBatches() {
    return this.batches;
  }
}

function pitchTrainDataArray(pitch, fields) {
  const values = [];
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    values.push(normalize(pitch[field.key], field.min, field.max));
  }
  return values;
}
