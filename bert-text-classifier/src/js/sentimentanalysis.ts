import WordPieceTokenizer from "../tokenization";
import * as tf from '@tensorflow/tfjs';

const vocabUrl = 'https://s3.us-south.cloud-object-storage.appdomain.cloud/max-assets-prod/max-text-sentiment-classifier/tfjs/0.1.0/vocab.json'
const modelUrl = 'https://s3.us-south.cloud-object-storage.appdomain.cloud/max-assets-prod/max-text-sentiment-classifier/tfjs/0.1.0/model.json';


export default class SentimentAnalysis {
  private _model: tf.GraphModel;
  private _tokenizer: WordPieceTokenizer;

  public get tokenizer(): WordPieceTokenizer {
    return this._tokenizer;
  }

  public get model() : tf.GraphModel {
    return this._model;
  }

  async init(){
    if(! this.model) await this.loadModel();
    if(! this.tokenizer) await this.loadTokenizer();
  }

  async loadModel(){
    this._model = await tf.loadGraphModel(
      modelUrl, {requestInit: {headers: {"origin": "localhost"}}})
    // console.log(`Model loaded from ${modelUrl}.`);
  }

  async loadTokenizer(){
    this._tokenizer = new WordPieceTokenizer(true);
    await this.tokenizer.init(vocabUrl);
    // console.log("Tokenizer loaded.")
  }
  /**
 * Classify a text input and return a json object with pos and neg
 * sentiment percentages
 */
  async analyzeText(text: string){
    return await this.inference(await this.tokenizer.inputFeature(text));
  }

  async inference(feature: tf.NamedTensorMap){
    if (! this.model) await this.loadModel();
    return tf.tidy(() => {
      let pred: tf.Tensor = this.model.execute({...feature}, 'loss/Softmax') as tf.Tensor;
      return pred.squeeze([0]);
    });
  }
}
