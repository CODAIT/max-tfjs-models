/* globals tf */

let modelPath = null

if (!process.rollupBrowser) {
  require('@tensorflow/tfjs-node')
  modelPath = `file://${__dirname}/../model/model.json`
} else {
  modelPath = 'https://s3.us-east.cloud-object-storage.appdomain.cloud/imagesegmenter/model.json'
}
let model = null
let warmed = false

/**
 * load the image segmenter model
 */
const load = function (initialize) {
  if (!model) {
    console.log('loading model...')
    console.time('model load')
    return tf.loadGraphModel(modelPath)
      .then(m => {
        console.timeEnd('model load')
        model = m
        if (istrue(initialize)) {
          warmup()
        }
        return Promise.resolve(model)
      })
      .catch(err => {
        console.timeEnd('model load')
        console.error(err)
        return Promise.reject(err)
      })
  } else if (istrue(initialize) && !warmed) {
    warmup()
    return Promise.resolve(model)
  } else {
    return Promise.resolve(model)
  }
}

/**
 * run the model to get a prediction
 */
const run = function (imageTensor) {
  if (!imageTensor) {
    console.error('no image provided')
    throw new Error('no image provided')
  } else if (!model) {
    console.error('model not available')
    throw new Error('model not available')
  } else {
    console.log('running model...')
    console.time('model inference')
    const results = model.predict(imageTensor)
    console.timeEnd('model inference')
    warmed = true
    return results
  }
}

/**
 * run inference on the TensorFlow.js model
 */
const inference = function (imageTensor) {
  return load(false).then(() => {
    try {
      const results = run(imageTensor)
      return Promise.resolve(results)
    } catch (err) {
      return Promise.reject(err)
    }
  })
}

const warmup = function () {
  try {
    run(tf.zeros([1, 512, 512, 3]))
  } catch (err) { }
}

const istrue = function (param) {
  return param === null ||
    typeof param === 'undefined' ||
    (typeof param === 'string' && param.toLowerCase() === 'true') ||
    (typeof param === 'boolean' && param)
}

if (!process.rollupBrowser) {
  // require('@tensorflow/tfjs-node')
} else {
  const init = document.currentScript.getAttribute('data-init-model')
  if (istrue(init)) {
    load(true)
  }
}

export { load, inference }
