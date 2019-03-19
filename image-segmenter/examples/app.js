// const { predict } = require('@codait/max-image-segmenter')
const { predict } = require('../dist/max.imgseg.cjs.js')

const { read, MIME_PNG } = require('jimp')

if (process.argv.length < 3) {
  console.log('please pass an image to process. ex:')
  console.log('  node app.js /path/to/image.jpg')
} else {
  let imagePath = process.argv[2]

  read(imagePath)
    .then(imageData => imageData.scaleToFit(512, 512).getBufferAsync(MIME_PNG))
    .then(imageBuffer => predict(imageBuffer))
    .then(prediction => {
      console.log(prediction.segmentationMap)
      console.log(prediction.objectsDetected)
    })
}
