import { labels } from './image-segmenter-map.js'

const predictedObjs = function (segArray) {
  let segLabels = {}
  segArray.forEach(arr => {
    arr.forEach(seg => {
      if (!segLabels[labels[seg]]) {
        segLabels[labels[seg]] = true
      }
    })
  })
  return Object.keys(segLabels)
}

/**
 * convert model Tensor output to image data for previewing
 *
 * @param {Tensor} inferenceResults - the output from running the model
 */
const postprocess = function (inferenceResults) {
  return inferenceResults.unstack()[0].array()
    .then(segArray => {
      return Promise.resolve({
        segmentationMap: segArray,
        objectsDetected: predictedObjs(segArray),
        imageSize: {
          width: segArray[0].length,
          height: segArray.length
        }
      })
    })
}

export { postprocess }
