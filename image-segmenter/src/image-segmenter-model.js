/* globals tf */

let modelPath = '/model/model.json'
let model = null

if (!process.rollupBrowser) {
  global.tf = require('@tensorflow/tfjs-node')
  global.fetch = require('node-fetch')
  modelPath = `file://${__dirname}/model/model.json`
}

/**
 * load the TensorFlow.js model
 */
const load = function () {
  if (!model) {
    console.log('loading model...')
    console.time('model load')
    return tf.loadGraphModel(modelPath)
      .then(m => {
        model = m
        console.timeEnd('model load')
        return Promise.resolve(model)
      })
      .catch(err => {
        console.error(err)
        console.timeEnd('model load')
        return Promise.reject(err)
      })
  } else {
    return Promise.resolve(model)
  }
}

/**
 * run the model to get a prediction
 */
const run = function (imageTensor) {
  if (!imageTensor) {
    console.error('no image provided')
    throw new Error('no image provided')
  } else if (!model) {
    console.error('model not available')
    throw new Error('model not available')
  } else {
    console.log('running model...')
    console.time('model inference')
    const results = model.predict(imageTensor)
    console.timeEnd('model inference')

    return results
  }
}

/**
 * run inference on the TensorFlow.js model
 */
const inference = function (imageTensor) {
  return load().then(() => {
    try {
      const results = run(imageTensor)
      return Promise.resolve(results)
    } catch (err) {
      return Promise.reject(err)
    }
  })
}

export { load, inference }
