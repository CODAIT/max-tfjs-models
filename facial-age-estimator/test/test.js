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

describe('A suite', function () {
  const input = jimp.read(imagePath)
    .then(imageData => imageData.getBufferAsync(jimp.MIME_PNG))
    .then(imageBuffer => createCanvasElement(imageBuffer))

  it('processInput, runInference, and processOutput', function () {
    return input.then(imageElement => ageEstimator.processInput(imageElement))
      .then(input => ageEstimator.runInference(input))
      .then(output => ageEstimator.processOutput(output))
      .then(result => expect(result[0]).toBeCloseTo(36, 0))
  })

  it('predict function works', function () {
    return input.then(imageElement => ageEstimator.predict(imageElement))
      .then(result => expect(result[0]).toBeCloseTo(36, 0))
  })

  it('multiple array works', function () {
    return input.then(imageElement => ageEstimator.processInput([imageElement, imageElement]))
      .then(input => ageEstimator.runInference(input))
      .then(output => ageEstimator.processOutput(output))
      .then(result => expect(result.length).toEqual(2))
  })
})
