# MAX for TensorFlow.js: Human Pose Estimator

This is a TensorFlow.js port of the [MAX Human Pose Estimator](https://github.com/IBM/MAX-Human-Pose-Estimator) pre-trained model. The Human Pose Estimator was trained to detect humans in an image and identifies the body parts, including nose, neck, eyes, shoulders, elbows, wrists, hips, knees, and ankles..

## Install

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script src="https://cdn.jsdelivr.net/npm/@codait/max-human-pose-estimator"></script>
```

By default when the `@codait/max-human-pose-estimator` JavaScript module is loaded, the model is automatically loaded and the cache warmed up (by running inference against an all zero input). To change this default behavior (and prevent the model from being automatically initialized) set attribute `data-init-model="false"` in the `script` tag for the `@codait/max-human-pose-estimator`.

### Node.js

```
npm install --save @codait/max-human-pose-estimator
```

When installing for a Node.js environment, the `node-gyp` module will need to get built as part of the installation of the `tfjs-node` dependency. Currently, for `node-gyp` to successfully build, Python 2.7 is required.

## Usage

The complete examples for browser and Node.js environments are in the [`/examples`](https://github.com/CODAIT/max-tfjs-models/tree/master/human-pose-estimator/examples) directory.

### Browser

> **Note**: _When loaded in a browser, the global variable `poseEstimator` will be available to access the API._

```javascript
let image = document.getElementById('my-image')

poseEstimator
  .predict(image)
  .then(prediction => {
    console.log(prediction.posesDetected)
  })
```

### Node.js

```javascript
const { predict } = require('@codait/max-human-pose-estimator')
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
  .then(imageData => imageData.scaleToFit(512, 512).getBufferAsync(MIME_PNG))
  .then(imageBuffer => createCanvasElement(imageBuffer))
  .then(imageElement => predict(imageElement))
  .then(prediction => {
    console.log(prediction.posesDetected)
  })
```

### API

- **loadModel(_init_)**

  Loads the model files.

  `init` - if `true`, a prediction will be triggered using an all zero Tensor to warm up the model (helps increase speed of subsequent predictions when running in a browser). Default is `true`.

  Returns the TensorFlow.js model.

- **processInput(_image_)**

  Processes the input image to the shape and format expected by the model. The image is resized and converted to a 4D Tensor.

  `image` - an instance of HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement.

  Returns a 4D Tensor representation of the image that can be passed to the model.

- **runInference(_inputTensor_)**

  Runs inference on the input Tensor passed. The output is 4D Tensor comprised of the concatenation of the heatmap and part affinity field map predictions

  `inputTensor` - a 4D Tensor representing an ImageData

  Returns the inference results.

- **processOutput(_inferenceResults_)**

  Processes the inference output replacing the output Tensor with calculated poses along with the heat map and part affinity field map predictions.

  `inferenceResults` - the model output from running inference.

  Returns an object containing

  - `heatMap`: a 2D array with the predicted heat map
  - `pafMap`: a 2D array with the predicted part affinity field map
  - `posesDetected`: an array of human poses detected in the image
  - `imageSize`: an object with the width and height of the resized image

- **predict(_image_)**

  Loads the model (if not loaded), processes the input image, runs inference, processes the inference output, and returns a prediction object. This is a convenience function to avoid having to call each of the functions (`loadModel`, `processInput`, `runInference`, `processOutput`) individually.

  `image` - an instance of HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement.

  Returns an object containing

  - `heatMap`: a 2D array with the predicted heat map
  - `pafMap`: a 2D array with the predicted part affinity field map
  - `posesDetected`: an array of human poses detected in the image
  - `imageSize`: an object with the width and height of the resized image

- **cocoUtil()**

  An object containing a set of helper variables for processing the inference output:

  - `parts`: an array of named body parts with the part's index corresponding to its ID
  - `pairs`: a 2D array listing body part connections (e.g., [1, 2] = Neck to Right Shoulder)
  - `pairsNetwork`: a 2D array listing part affinity field indexing corresponding to the each pair of body parts
  - `colors`: a 2D array of RBG color values

- **config(_params_)**

  Set or get configuration params for the post processing calculations. Do not include _`params`_ to get the configuration values.

  `params` - an object containing parameters to set.

  Available parameters include:

  - `NMSWindowSize`: pixel size when applying non-maximum suppression to calculate peaks (default: 6)
  - `NMSThreshold`: minimum pixel score required when calculating peaks (default: 0.001)
  - `LocalPAFThreshold`: minimum part affinity field score when calculating possible pairs (default: 0.141)
  - `PartScoreThreshold`: minimum part score required when calculating parts (default: 0.247)
  - `PAFCountThreshold`: minimum part affinity field values when calculating possible pairs (default: 4)
  - `PartCountThreshold`: minimum parts required when calculating poses (default: 4)


## Model

The model assets produced by converting the pre-trained model to the TensorFlow.js format can be found in the [`/model`](https://github.com/CODAIT/max-tfjs-models/tree/master/human-pose-estimator/model) directory.

## Resources

- [MAX Human Pose Estimator](https://github.com/IBM/MAX-Human-Pose-Estimator)
- [Use your arms to make music](https://developer.ibm.com/patterns/making-music-with-the-max-human-pose-estimator-and-tensorflowjs/)
- [veremax](https://ibm.biz/veremax)
- [TensorFlow.js](https://www.tensorflow.org/js/)
 - Human pose estimation using OpenPose with TensorFlow - [Part 1](https://arvrjourney.com/human-pose-estimation-using-openpose-with-tensorflow-part-1-7dd4ca5c8027), [Part II](https://arvrjourney.com/human-pose-estimation-using-openpose-with-tensorflow-part-2-e78ab9104fc8)

## License

[Apache-2.0](https://github.com/CODAIT/max-tfjs-models/blob/master/LICENSE)
