import WordPieceTokenizer from "../tokenization";
import * as tf from '@tensorflow/tfjs';
import {fetchModel, untar} from './util';

const vocabUrl = 'http://s3.us.cloud-object-storage.appdomain.cloud/bert-sentiment-tfjs/model/vocab.json'
const modelArch = 'http://s3.us.cloud-object-storage.appdomain.cloud/bert-sentiment-tfjs/model.tgz';

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
    const tfn = require('@tensorflow/tfjs-node');
    const fs = require('fs');
    const path = require('path');
    const modelTgz = path.join(`${__dirname}`, '..', '..', '/model/model.tgz');
    const modelJson = path.join(`${__dirname}`,'..', '..', '/model/model.json');
    // console.log(modelJson);
    const modelDir = path.join(`${__dirname}`, '..', '..','/model');
    if(!fs.existsSync(modelJson)){
      await fetchModel(modelArch, modelDir);
      await untar(modelTgz,modelDir);
    }
    const fileSystem = require('@tensorflow/tfjs-node/dist/io/file_system');
    this._model = await tfn.loadGraphModel(fileSystem.fileSystem(modelJson));
    // console.log(`Model loaded from ${modelJson}.`);
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
