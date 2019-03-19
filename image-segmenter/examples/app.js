// const { predict } = require('@codait/max-image-segmenter')
const { predict } = require('../dist/max.imgseg.cjs.js')

const jimp = require('jimp')

if (process.argv.length < 3) {
  console.log('please pass an image to process. ex:')
  console.log('  node app.js /path/to/image.jpg')
} else {
  let imagePath = process.argv[2]

  jimp.read(imagePath)
    .then(function (imageData) {
      return imageData.scaleToFit(512, 512).getBufferAsync(jimp.MIME_PNG)
    })
    .then(function (imageBuffer) {
      return predict(imageBuffer)
    })
    .then(function (prediction) {
      console.log(`the following object(s) were detected: ${prediction.objectsDetected}`)
    })
    .catch(function (err) {
      console.error(err)
    })
}
