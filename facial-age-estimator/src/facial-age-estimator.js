import { version } from '../package.json'
import { preprocess } from './facial-age-estimator-input'
import { load, inference } from './facial-age-estimator-model'
import { postprocess } from './facial-age-estimator-output'

if (!process.rollupBrowser) {
  global.tf = require('@tensorflow/tfjs-node')
}

const loadModel = function (init) {
  return load(init)
}

const processInput = function (inputImage) {
  return preprocess(inputImage)
}

const runInference = function (inputTensor) {
  return inference(inputTensor)
}

const processOutput = function (inferenceResults) {
  return postprocess(inferenceResults)
}

const predict = function (inputImage) {
  return processInput(inputImage)
    .then(runInference)
    .then(processOutput)
    .catch(err => {
      console.error(err)
    })
}

export {
  version,
  predict,
  loadModel,
  processInput,
  runInference,
  processOutput
}
