# MAX for TensorFlow.js: Text Sentiment Classifier

This is a TensorFlow.js port of the [MAX Human Pose Estimator](https://developer.ibm.com/exchanges/models/all/max-text-sentiment-classifier/) This model is able to detect whether a text fragment leans towards a positive or a negative sentiment.

## Install

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script src="https://cdn.jsdelivr.net/npm/@codait/text-sentiment-classifier"></script>
```

### Node.js

```
npm install --save @codait/text-sentiment-classifier
```

## Usage

The complete examples for browser and Node.js environments are in the [`/examples`](https://github.com/CODAIT/max-tfjs-models/tree/master/text-sentiment-classifier/examples) directory.

### Browser

> **Note**: _When loaded in a browser, the global variable `textSentimentClassifier` will be available to access the API._

```javascript

textSentimentClassifier
  .predict("i like strawberries")
  .then(prediction => {
    console.log(prediction)
  });
```

### Node.js

```javascript
const tc = require('@codait/text-sentiment-classifier');
tc.predict("i like strawberries").then(res=>console.log(res)); //{ pos: 0.9981953501701355, neg: 0.0018045296892523766 }

```

### API

- **loadModel()**

  Loads the model files.

  Running in Node.js the first time will download the model assets locally under `/model` directory. The subsequent calls will load the model from the directory.

  Returns the TensorFlow.js model.

- **processInput(text)**

  Processes the input text to the shape and format expected by the model.

  `text` - sentence to be processed. It should be a sentence with a period although this is not necessary.

  Returns a named tensor map that contains:
  `{'segment_ids_1': Tensor of shape [128],
    'input_ids_1': Tensor of shape [128],
    'input_mask_1': Tensor of shape [128]}`

- **runInference(inputFeatures)**

  Runs inference on the named tensor map passed. The output is a tensor that contains softmax of positive and negative percentages.

  `inputFeature` - a named tensor map representation of a text.

  Returns the inference results as a 1D tensor.

- **processOutput(tensor)**

  Transform the inference output to a Json object.

  `tensor` - the model output from running inference.

  Returns an object containing: `{neg: number, pos: number}`


- **predict(text)**

  Loads the model, processes the input text, runs inference, processes the inference output, and returns a prediction object. This is a convenience function to avoid having to call each of the functions (`loadModel`, `processInput`, `runInference`, `processOutput`) individually.

  `text` - sentence to be analyzed. It should be a sentence with a period although this is not necessary.

  Returns an object containing: `{neg: number, pos: number}`

- **encode(text)**

  Tokenize the text as token ids using the BERT 32k vocabularies.

  `text` - sentence to be encoded.

  Returns an array of BERT token ids.

- **idsToTokens(ids)**

  Transform the BERT token ids into tokens.

  `ids` - BERT token ids.

  Returns an array of BERT tokens.

- **version**

  Returns the version

## Model

The model assets produced by converting the pre-trained model to the TensorFlow.js format can be found in the `/model` directory after loadModel is called in Node.js.

## Resources

- [MAX Text Sentiment Classifier](https://developer.ibm.com/exchanges/models/all/max-text-sentiment-classifier/)

## License

[Apache-2.0](https://github.com/CODAIT/max-tfjs-models/blob/master/LICENSE)
