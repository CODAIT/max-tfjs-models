# MAX for TensorFlow.js: Image Segmenter

This is a TensorFlow.js port of the [MAX Image Segmenter](https://github.com/IBM/MAX-Image-Segmenter) pre-trained model. The Image Segmenter was trained to identify objects in an image and assigns each pixel of the image to a particular object.

## Install

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script src="https://cdn.jsdelivr.net/npm/@codait/max-image-segmenter"></script>
```

By default when the `@codait/max-image-segmenter` JavaScript module is loaded, the model is automatically loaded and the cache warmed up (by running inference against an all zero input). To change this default behavior (and prevent the model from being automatically initialized) set attribute `data-init-model="false"` in the `script` tag for the `@codait/max-image-segmenter`.

### Node.js

```
npm install --save @codait/max-image-segmenter
```

When installing for a Node.js environment, the `node-gyp` module will need to get built as part of the installation of the `tfjs-node` dependency. Currently, for `node-gyp` to successfully build, Python 2.7 is required.

## Usage

The complete examples for browser and Node.js environments are in the [`/examples`](https://github.com/CODAIT/max-tfjs-models/tree/master/image-segmenter/examples) directory.

### Browser

> **Note**: _When loaded in a browser, the global variable `imageSegmenter` will be available to access the API._

```javascript
let image = document.getElementById('my-image')

imageSegmenter
  .predict(image)
  .then(prediction => {
    console.log(prediction.segmentationMap)
    console.log(prediction.objectsDetected)
  })
```

### Node.js

```javascript
const { predict } = require('@codait/max-image-segmenter')
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
    // console.log(prediction.segmentationMap)
    console.log(prediction.objectsDetected)
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

  Returns a 4D Tensor that can be passed to the model.

- **runInference(_inputTensor_)**

  Runs inference on the input Tensor passed. The output is 2D Tensor with an object ID assigned to each index of the input Tensor.

  `inputTensor` - a 4D Tensor representing an ImageData

  Returns the inference results.

- **processOutput(_inferenceResults_)**

  Processes the inference output replacing the output Tensor with an 2D array.

  `inferenceResults` - the model output from running inference.

  Returns an object containing

  - `segmentationMap`: a 2D array with an object ID assigned to each pixel of the image
  - `objectsDetected`: an array of objects detected in the image
  - `imageSize`: an object with the width and height of the resized image (corresponds to the size of the `segmentationMap`)

- **predict(_image_)**

  Loads the model (if not loaded), processes the input image, runs inference, processes the inference output, and returns a prediction object. This is a convenience function to avoid having to call each of the functions (`loadModel`, `processInput`, `runInference`, `processOutput`) individually.

  `image` - an instance of HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement.

  Returns an object containing

  - `segmentationMap`: a 2D array with an object ID assigned to each pixel of the image
  - `objectsDetected`: an array of objects detected in the image
  - `imageSize`: an object with the width and height of the resized image (corresponds to the size of the `segmentationMap`)

- **labelsMap()**

  An array of object labels where the label's index corresponds to its ID. It can be used to map the IDs in the `segmentationMap` to its corresponding label.

- **colorsMap()**

  An array of RGB color values that can be used to map each object to a specific color.

- **version**

  Returns the version

## Model

The model assets produced by converting the pre-trained model to the TensorFlow.js format can be found in the [`/model`](https://github.com/CODAIT/max-tfjs-models/tree/master/image-segmenter/model) directory.

## Resources

- [MAX Image Segmenter](https://github.com/IBM/MAX-Image-Segmenter)
- [MAX Image Segmenter Web App](https://github.com/IBM/MAX-Image-Segmenter-Web-App)
- [magicat](https://github.com/CODAIT/magicat)
- [TensorFlow.js](https://www.tensorflow.org/js/)

## License

[Apache-2.0](https://github.com/CODAIT/max-tfjs-models/blob/master/LICENSE)
