import { preprocess } from './human-pose-estimator-input.js'
import { load, inference } from './human-pose-estimator-model.js'
import { postprocess, configuration } from './human-pose-estimator-output.js'
import { cocoParts, cocoPairs, cocoPairsNetwork, cocoColors } from './human-pose-estimator-coco.js'

if (!process.rollupBrowser) {
  global.tf = require('@tensorflow/tfjs-node')
}

const processInput = function (inputImage, mirrorImage) {
  return preprocess(inputImage, mirrorImage)
}

const loadModel = function (init) {
  return load(init)
}

const runInference = function (inputTensor) {
  return inference(inputTensor)
}

const processOutput = function (inferenceResults) {
  return postprocess(inferenceResults)
}

const predict = function (inputImage, mirrorImage) {
  return processInput(inputImage, mirrorImage)
    .then(runInference)
    .then(processOutput)
    .catch(err => {
      console.error(err)
    })
}

const config = function (config) {
  return configuration(config)
}

const cocoUtil = {
  parts: cocoParts,
  pairs: cocoPairs,
  pairsNetwork: cocoPairsNetwork,
  colors: cocoColors
}

export {
  predict,
  config,
  loadModel,
  processInput,
  runInference,
  processOutput,
  cocoUtil
}
