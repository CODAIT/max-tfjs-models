import * as tf from "@tensorflow/tfjs";
import SentimentAnalysis from "./server/sentimentanalysis";
import packageJson from "../package.json";

export interface SentRes{
  neg: number,
  pos: number
}

async function processInput(text: string): Promise<tf.NamedTensorMap>{
  const sa = new SentimentAnalysis();
  await sa.loadTokenizer()
  return await sa.tokenizer.inputFeature(text);
}

async function loadModel(): Promise<tf.GraphModel> {
  const sa = new SentimentAnalysis();
  await sa.loadModel()
  return sa.model;
}

async function runInference(feature: tf.NamedTensorMap): Promise<tf.Tensor>{
  const sa = new SentimentAnalysis();
  await sa.init()
  return await sa.inference(feature);
}

function processOutput(res: tf.Tensor): SentRes{
  const arr = res.arraySync() as number[];
  return {"pos": arr[0], "neg": arr[1]};
}

async function predict(text: string): Promise<SentRes>{
  const sa = new SentimentAnalysis();
  await sa.init();
  let res = await sa.analyzeText(text);
  return processOutput(res);
}

async function encode(text: string): Promise<number[]>{
  const sa = new SentimentAnalysis();
  await sa.loadTokenizer()
  return await sa.tokenizer.tokenize(text);
}

async function idsToTokens(ids: number[]){
  const sa = new SentimentAnalysis();
  await sa.loadTokenizer();
  return sa.tokenizer.convertIdsToTokens(ids);
}


export default {
  processInput,
  loadModel,
  runInference,
  processOutput,
  predict,
  encode,
  idsToTokens,
  version: packageJson.version
}
