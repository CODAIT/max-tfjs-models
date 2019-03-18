# MAX for TensorFlow.js: Image Segmenter

The pre-trained model was taken from the [MAX Image Segmenter](https://github.com/IBM/MAX-Image-Segmenter). The Image Segmenter was trained to identify objects in an image and assigns each pixel of the image to a particular object.

## Install

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

**Note**: _When install the dependencies, `node-gyp` will get built as part of the `tfjs-node` installation. To successfully build `node-gyp` Python 2.7 is required. Otherwise, `tfjs-node` will fail to install._

## Usage



## Resources

- [MAX Image Segmenter](https://github.com/IBM/MAX-Image-Segmenter)
- [MAX Image Segmenter Web App](https://github.com/IBM/MAX-Image-Segmenter-Web-App)
- [magicat](https://github.com/CODAIT/magicat)
- [TensorFlow.js](https://www.tensorflow.org/js/)

## License

[Apache-2.0](https://github.com/CODAIT/max-tfjs-models/blob/master/LICENSE)
