# MAX for TensorFlow.js: Image Segmenter

This is a TensorFlow.js port of the [MAX Image Segmenter](https://github.com/IBM/MAX-Image-Segmenter) pre-trained model. The Image Segmenter was trained to identify objects in an image and assigns each pixel of the image to a particular object.

## Install

> **Note**: _When installing for a Node.js environment, the `node-gyp` module will need to get built as part of the installation of the `tfjs-node` dependency. For `node-gyp` to successfully build, Python 2.7 is required._

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script src="https://cdn.jsdelivr.net/npm/@codait/max-image-segmenter"></script>
```

### Node.js

```
npm install --save @codait/max-image-segmenter
```

### Development

```
git clone https://github.com/CODAIT/max-tfjs-models.git
cd max-tfjs-models/image-segmenter
npm install
npm run build
```

## Usage

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

const imagePath = `file://${ __dirname }/my-image.jpg`

read(imagePath)
  .then(imageData => imageData.scaleToFit(512, 512).getBufferAsync(MIME_PNG))
  .then(imageBuffer => predict(imageBuffer))
  .then(prediction => {
    console.log(prediction.segmentationMap)
    console.log(prediction.objectsDetected)
  })
```

### API

#### loadModel()

Loads the model files from Object Storage.

Returns the TensorFlow.js model.


#### processInput(_image_)

Preprocessing the input image to the shape and format expected by the model. The image is resized and converted to a 4D Tensor.

**image** - (Required) an instance of ImageData, HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement.

Returns a 4D Tensor.


#### runInference(_inputTensor_)

Runs inference on the input Tensor. The output is 2D Tensor with an object ID assigned to each index of the input Tensor.

**inputTensor** - (Required) a 4D Tensor representing an ImageData

Returns the inference results.


#### processOutput(_inferenceResults_)

Processes the inference output replacing the output Tensor with an 2D array and including the labels of the object detected.

**inferenceResults** - (Required) the model output from running inference.

Returns an object containing

- `segmentationMap`: a 2D array with an object ID assigned to each pixel of the image
- `objectsDetected`: an array of objects detected in the image
- `imageSize`: an object with the width and height of the resized image (corresponds to the size of the `segmentationMap`)


#### predict(_image_)

Loads the model (if not loaded), preprocesses the input image, runs inference, process the inference output, and returns a prediction object.

**image** - (Required) an instance of ImageData, HTMLImageElement, HTMLCanvasElement, or HTMLVideoElement.

Returns an object containing

- `segmentationMap`: a 2D array with an object ID assigned to each pixel of the image
- `objectsDetected`: an array of objects detected in the image
- `imageSize`: an object with the width and height of the resized image (corresponds to the size of the `segmentationMap`)


#### labelsMap()

An array of object labels where the label's index corresponds to its ID.


#### colorsMap()

An array of RGB color values used in PASCAL VOC segmentation benchmark.


## Resources

- [MAX Image Segmenter](https://github.com/IBM/MAX-Image-Segmenter)
- [MAX Image Segmenter Web App](https://github.com/IBM/MAX-Image-Segmenter-Web-App)
- [magicat](https://github.com/CODAIT/magicat)
- [TensorFlow.js](https://www.tensorflow.org/js/)

## License

[Apache-2.0](https://github.com/CODAIT/max-tfjs-models/blob/master/LICENSE)
