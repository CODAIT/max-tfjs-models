# MAX for TensorFlow.js: Facial Age Estimator

This is a TensorFlow.js port of the [MAX Facial Age Estimator](https://github.com/IBM/MAX-Facial-Age-Estimator) pre-trained model. The Facial Age Estimator extracts facial features for each face given as input and predicts the age of each face.

## Install

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script src="https://cdn.jsdelivr.net/npm/@codait/max-facial-age-estimator"></script>
```

By default when the `@codait/max-facial-age-estimator` JavaScript module is loaded, the model is automatically loaded and the cache warmed up (by running inference against an all zero input). To change this default behavior (and prevent the model from being automatically initialized) set attribute `data-init-model="false"` in the `script` tag for the `@codait/max-facial-age-estimator`.

### Node.js

```
npm install --save @codait/max-facial-age-estimator
```

When installing for a Node.js environment, the `node-gyp` module will need to get built as part of the installation of the `tfjs-node` dependency. Currently, for `node-gyp` to successfully build, Python 2.7 is required.

## Usage


### Browser

> **Note**: _When loaded in a browser, the global variable `ageEstimator` will be available to access the API._

```javascript
let image = document.getElementById('my-image')

ageEsimator
  .predict(image)
  .then(prediction => {
    console.log(prediction)
  })
```

### Node.js

```javascript
const { predict } = require('@codait/max-facial-age-estimator')
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

const imagePath = `file://${ __dirname}/my-image.jpg`

read(imagePath)
    .then(imageData => imageData.getBufferAsync(MIME_PNG))
    .then(imageBuffer => createCanvasElement(imageBuffer))
    .then(imageElement => predict(imageElement))
    .then(ages => console.log(ages))
```

### API

- **loadModel(_init_)**

  Loads the model files.

  `init` - if `true`, a prediction will be triggered using an all zero Tensor to warm up the model (helps increase speed of subsequent predictions when running in a browser). Default is `true`.

  Returns the TensorFlow.js model.

- **processInput(_image_)**

  Processes the input image to the shape and format expected by the model. The image is resized/scaled (to max width or height of 64px) and converted to a 4D Tensor.

  `image` - an instance or array of HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement.  

  Returns a 4D Tensor representation of the image(s) that can be passed to the model.

- **runInference(_inputTensor_)**

  Runs inference on the input Tensor passed. The output is 1D tensor containing the predicted ages.

  `inputTensor` - a 4D Tensor representing an ImageData or array of ImageData

  Returns the inference results.

- **processOutput(_inferenceResults_)**

  Processes the inference output replacing the output Tensor with an array of the ages the model predicts.

  `inferenceResults` - the model output from running inference.


- **predict(_image_)**

  Loads the model (if not loaded), processes the input image, runs inference, processes the inference output, and returns a prediction object. This is a convenience function to avoid having to call each of the functions (`loadModel`, `processInput`, `runInference`, `processOutput`) individually.

  `image` - an instance or array of HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement.  


## Model

The model assets produced by converting the pre-trained model to the TensorFlow.js format can be found in the [`/model`](https://github.com/CODAIT/max-tfjs-models/tree/master/facial-age-estimator/model) directory.

## Resources

- [MAX Facial Age Estimator](https://github.com/IBM/MAX-Facial-Age-Estimator)
- [TensorFlow.js](https://www.tensorflow.org/js/)

## License

[Apache-2.0](https://github.com/CODAIT/max-tfjs-models/blob/master/LICENSE)
