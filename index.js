import * as tf from '@tensorflow/tfjs';

import {loadTrainingData} from './data';

loadTrainingData('http://localhost:1234/data.csv');

// import {StrikeZoneModel} from './model';

// const model = new StrikeZoneModel();
// console.log(model);