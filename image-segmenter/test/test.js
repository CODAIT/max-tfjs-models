/* globals describe, it, expect, beforeAll, jasmine, tf */

const jimp = require('jimp')
const nodeCanvas = require('canvas')
const imageSegmenter = require('../dist/max.imgseg.cjs.js')

const imagePath = `${__dirname}/group.jpg`

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

describe('Image Segmenter', function () {
  const input = jimp.read(imagePath)
    .then(imageData => imageData.getBufferAsync(jimp.MIME_PNG))
    .then(imageBuffer => createCanvasElement(imageBuffer))

  it('version returns a valid version number', function () {
    expect(imageSegmenter.version).toMatch(/(\d+\.){2}(\d+)/)
  })

  it('processInput() resizes to a maximum of 512px length/width', function () {
    return input.then(imageElement => imageSegmenter.processInput(imageElement))
      .then(result => expect(result.shape).toContain(512))
  })

  it('runInference() returns a tf.Tensor', function () {
    return imageSegmenter.runInference(tf.zeros([1, 512, 512, 3]))
      .then(result => expect(result).toEqual(jasmine.any(tf.Tensor)))
  })

  describe('predict results are consistent', function () {
    var prediction

    beforeAll(async function () {
      prediction = await input.then(imageElement => imageSegmenter.predict(imageElement))
    })

    it('predict() works returns object containing segmentationMap, objectsDetected, imageSize', function () {
      expect(Object.keys(prediction)).toEqual(jasmine.arrayContaining(['segmentationMap', 'objectsDetected', 'imageSize']))
    })

    it('segmentationMap has same dimensions as imageSize', function () {
      expect(prediction.imageSize.height).toEqual(prediction.segmentationMap.length)
      expect(prediction.imageSize.width).toEqual(prediction.segmentationMap[0].length)
    })

    it('test image has multiple objects detected', function () {
      expect(prediction.objectsDetected.length).toBeGreaterThan(1)
    })
  })
})
