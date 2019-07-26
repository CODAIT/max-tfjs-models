// const { predict } = require('@codait/max-facial-age-estimator')
const { predict } = require('../dist/max.ageest.cjs.js')

const { read, MIME_PNG } = require('jimp')
const { createCanvas, loadImage } = require('canvas')

const createCanvasElement = function (imageInput) {
  return new Promise(async (resolve, reject) => {
    const img = await loadImage(imageInput)
    let canvas = createCanvas(img.width, img.height)
    let ctx = canvas.getContext('2d')
    await ctx.drawImage(img, 0, 0)
    resolve(canvas)
  })
}

if (process.argv.length < 3) {
  console.log('please pass an image to process. ex:')
  console.log('  node app.js /path/to/image.jpg')
} else {
  let imagePath = process.argv[2]

  read(imagePath)
    .then(imageData => imageData.scaleToFit(512, 512).getBufferAsync(MIME_PNG))
    .then(imageBuffer => createCanvasElement(imageBuffer))
    .then(imageElement => predict(imageElement))
    .then(prediction => {
      console.log(prediction)
    })
}
