import { preprocess } from './image-segmenter-input.js'
import { load, inference } from './image-segmenter-model.js'
import { postprocess } from './image-segmenter-output.js'
import { labels as labelsMap, colors as colorsMap } from './image-segmenter-map.js'

const processInput = function (inputImage) {
  return preprocess(inputImage)
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

const predict = function (inputImage) {
  return processInput(inputImage)
    .then(runInference)
    .then(processOutput)
    .catch(err => {
      console.error(err)
    })
}

export {
  predict,
  processInput,
  loadModel,
  runInference,
  processOutput,
  labelsMap,
  colorsMap
}
