const jimp = require('jimp')
const nodeCanvas = require('canvas')
const ageEstimator = require('../dist/max.ageest.cjs.js')

const imagePath = `${__dirname}/face.jpg`

const createCanvasElement = function (imageInput) {
  return new Promise(async (resolve, reject) => {
    const img = await nodeCanvas.loadImage(imageInput)
    let canvas = nodeCanvas.createCanvas(img.width, img.height)
    let ctx = canvas.getContext('2d')
    await ctx.drawImage(img, 0, 0)
    resolve(canvas)
  })
}

/* eslint-disable no-undef */
describe('Facial Age Estimator', function () {
  const input = jimp.read(imagePath)
    .then(imageData => imageData.getBufferAsync(jimp.MIME_PNG))
    .then(imageBuffer => createCanvasElement(imageBuffer))

  it('version returns a valid version number', function () {
    expect(ageEstimator.version).toMatch(/(\d+\.){2}(\d+)/)
  })

  it('processInput() creates tensor', function () {
    return input.then(imageElement => ageEstimator.processInput(imageElement))
      .then(result => expect(result.shape).toEqual([1, 64, 64, 3]))
  })

  it('runInference() works on input', function () {
    return ageEstimator.runInference(tf.zeros([1, 64, 64, 3]))
      .then(result => expect(result).toEqual(jasmine.any(tf.Tensor)))
  })

  it('processOutput() converts tensor into array', function () {
    return ageEstimator.processOutput(tf.tensor([[25], [30]]))
      .then(result => expect(result).toEqual([25, 30]))
  })

  it('predict() works on single input', function () {
    return input.then(imageElement => ageEstimator.predict(imageElement))
      .then(result => expect(result[0]).toBeCloseTo(36, 0))
  })

  it('predict() works on array input', function () {
    return input.then(imageElement => ageEstimator.processInput([imageElement, imageElement]))
      .then(input => ageEstimator.runInference(input))
      .then(output => ageEstimator.processOutput(output))
      .then(result => expect(result.length).toEqual(2))
  })
})
/* eslint-enable no-undef */
