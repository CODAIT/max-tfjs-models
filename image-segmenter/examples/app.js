// const { predict, version } = require('@codait/max-image-segmenter')
const { predict, version } = require('../dist/max.imgseg.cjs.js')

const { read, MIME_PNG } = require('jimp')
const { createCanvas, loadImage } = require('canvas')

const createCanvasElement = function (imageInput) {
  let canvas = null
  return loadImage(imageInput).then(img => {
    canvas = createCanvas(img.width, img.height)
    const ctx = canvas.getContext('2d')
    return ctx.drawImage(img, 0, 0)
  }).then(() => {
    return canvas
  })
}

if (process.argv.length < 3) {
  console.log('please pass an image to process. ex:')
  console.log('  node app.js /path/to/image.jpg')
} else {
  console.log(`@codait/max-image-segmenter v${version}`)
  const imagePath = process.argv[2]

  read(imagePath)
    .then(imageData => imageData.scaleToFit(512, 512).getBufferAsync(MIME_PNG))
    .then(imageBuffer => createCanvasElement(imageBuffer))
    .then(imageElement => predict(imageElement))
    .then(prediction => {
      // console.log(prediction.segmentationMap)
      console.log(`the following object(s) were detected: ${prediction.objectsDetected}`)
    })
}
