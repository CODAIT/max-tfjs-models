/* globals jasmine, describe, it, expect, tf */

const jimp = require('jimp')
const nodeCanvas = require('canvas')
const poseEstimator = require('../dist/max.humanpose.cjs.js')

const imagePath = `${__dirname}/Pilots.jpg`

const createCanvasElement = function (imageInput) {
  return new Promise(async (resolve, reject) => {
    const img = await nodeCanvas.loadImage(imageInput)
    let canvas = nodeCanvas.createCanvas(img.width, img.height)
    let ctx = canvas.getContext('2d')
    await ctx.drawImage(img, 0, 0)
    resolve(canvas)
  })
}

describe('Human Pose Estimator', function () {
  const input = jimp.read(imagePath)
    .then(imageData => imageData.getBufferAsync(jimp.MIME_PNG))
    .then(imageBuffer => createCanvasElement(imageBuffer))

  it('version returns a valid version number', function () {
    expect(poseEstimator.version).toMatch(/(\d+\.){2}(\d+)/)
  })

  it('processInput() resizes image to maximum of 432px', function () {
    return input.then(imageElement => poseEstimator.processInput(imageElement))
      .then(result => expect(result.shape).toContain(432))
  })

  it('runInference() outputs correct dimensions (1, x, y, 57)', function () {
    return poseEstimator.runInference(tf.zeros([1, 512, 512, 3]))
      .then(result => expect(result.shape[3]).toEqual(57))
  })

  it('predict() returns object with heatpMap, pafMap, posesDetected, and imageSize', function () {
    return input.then(imageElement => poseEstimator.predict(imageElement))
      .then(result => expect(Object.keys(result)).toEqual(jasmine.arrayContaining(['heatMap', 'pafMap', 'posesDetected', 'imageSize'])))
  })
})
