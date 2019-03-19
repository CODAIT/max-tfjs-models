/* globals tf, Image */

const IMAGESIZE = 512
let targetSize = { w: IMAGESIZE, h: IMAGESIZE }

if (!process.rollupBrowser) {
  global.tf = require('@tensorflow/tfjs-node')
  var createCanvas = require('canvas').createCanvas
  var loadImage = require('canvas').loadImage
}

const resizeImage = function (img) {
  let resizeRatio = IMAGESIZE / Math.max(img.width, img.height)
  targetSize.w = Math.round(resizeRatio * img.width)
  targetSize.h = Math.round(resizeRatio * img.height)
  img.width = targetSize.w
  img.height = targetSize.h
  return img
}

const getImageData = function (imageInput) {
  if (process.rollupBrowser) {
    return new Promise((resolve, reject) => {
      if (typeof imageInput === 'string') {
        const img = new Image()
        img.onload = () => resolve(resizeImage(img))
        img.onerror = err => reject(err)
        img.src = imageInput
      } else {
        resolve(resizeImage(imageInput))
      }
    })
  } else {
    return new Promise(async (resolve, reject) => {
      const img = resizeImage(await loadImage(imageInput))
      let canvas = createCanvas(img.width, img.height)
      let ctx = canvas.getContext('2d')
      await ctx.drawImage(img, 0, 0)
      resolve(canvas)
    })
  }
}

const imageToTensor = function (imageData) {
  return tf.browser.fromPixels(imageData).expandDims()
}

/**
 * convert image to Tensor input required by the model
 *
 * @param {HTMLImageElement} imageInput - the image element
 */
const preprocess = function (imageInput) {
  return getImageData(imageInput)
    .then(imageToTensor)
    .then(inputTensor => {
      return Promise.resolve(inputTensor)
    })
    .catch(err => {
      console.error(err)
      return Promise.reject(err)
    })
}

export { preprocess }
