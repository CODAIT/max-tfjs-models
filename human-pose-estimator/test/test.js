/* globals jasmine, describe, it, expect, beforeAll, tf */

const jimp = require('jimp')
const nodeCanvas = require('canvas')
const poseEstimator = require('../dist/max.humanpose.cjs.js')

const imagePath = `${__dirname}/Pilots.jpg`

const createCanvasElement = function (imageInput) {
  let canvas = null
  return nodeCanvas.loadImage(imageInput).then(img => {
    canvas = nodeCanvas.createCanvas(img.width, img.height)
    const ctx = canvas.getContext('2d')
    return ctx.drawImage(img, 0, 0)
  }).then(() => {
    return canvas
  })
}

describe('Human Pose Estimator', function () {
  const input = jimp.read(imagePath)
    .then(imageData => imageData.getBufferAsync(jimp.MIME_PNG))
    .then(imageBuffer => createCanvasElement(imageBuffer))

  beforeAll(async function () {
    // Load model before all tests so initial memory conditions are consistent
    await poseEstimator.loadModel()
  })

  it('version returns a valid version number', function () {
    expect(poseEstimator.version).toMatch(/(\d+\.){2}(\d+)/)
  })

  it('processInput() resizes image to maximum of 432px', function () {
    return input.then(imageElement => poseEstimator.processInput(imageElement))
      .then(result => expect(result.shape).toContain(432))
  })

  it('processInput() cleans up its tensors', function () {
    const initialNumTensors = tf.memory().numTensors
    // Should garbage collect every tensor except the one returned
    return input.then(imageElement => poseEstimator.processInput(imageElement))
      .then(() => expect(tf.memory().numTensors - initialNumTensors).toEqual(1))
  })

  it('runInference() outputs correct dimensions (1, x, y, 57)', function () {
    return poseEstimator.runInference(tf.zeros([1, 512, 512, 3]))
      .then(result => expect(result.shape[3]).toEqual(57))
  })

  it('runInference() cleans up its tensors', function () {
    const initialNumTensors = tf.memory().numTensors
    // Should garbage collect every tensor except the one returned
    return poseEstimator.runInference(tf.zeros([1, 512, 512, 3]))
      .then(() => expect(tf.memory().numTensors - initialNumTensors).toEqual(1))
  })

  it('predict() returns object with heatMap, pafMap, posesDetected, and imageSize', function () {
    return input.then(imageElement => poseEstimator.predict(imageElement))
      .then(result => expect(Object.keys(result)).toEqual(jasmine.arrayContaining(['heatMap', 'pafMap', 'posesDetected', 'imageSize'])))
  })

  it('has no memory leaks', function () {
    const initialMemory = tf.memory()
    return input.then(imageElement => poseEstimator.predict(imageElement))
      .then(result => expect(initialMemory).toEqual(tf.memory()))
  })
})
