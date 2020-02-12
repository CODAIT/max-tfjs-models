/* globals jasmine, describe, it, expect, tf */

import sa from '../src/text-sentiment-classifier';
import * as tf from '@tensorflow/tfjs';

const posText = "i like strawberries";
const negText = "i hate strawberries";
const posTokenids = [ 1045, 2066, 13137, 20968 ];
const posTokens = ['▁i', '▁like', '▁straw', 'berries'];
const resTensor = tf.tensor1d([0.4, 0.6], 'float32');

function genInput(){
    // Novel input lengths force recompilation which slows down inference, so it's a good idea to enforce a max length.
    const EXAMPLE_INPUT_LENGTH = 15;
    const MAX_INPUT_LENGTH = 128;
    // This is the tokenization of '[CLS] Hello, my dog is cute. [SEP]'.
    const input_ids = tf.tensor1d([101, 7592, 1010, 2026, 3899, 2003, 10140, 1012, 102, 0, 0, 0, 0, 0, 0], 'int32')
        .pad([[0,MAX_INPUT_LENGTH - EXAMPLE_INPUT_LENGTH]]).expandDims();
    const segment_ids = tf.tensor1d(
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 'int32')
        .pad([[0, MAX_INPUT_LENGTH - EXAMPLE_INPUT_LENGTH]]).expandDims();
    const input_mask = tf.tensor1d(
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], 'int32')
        .pad([[0, MAX_INPUT_LENGTH - EXAMPLE_INPUT_LENGTH]]).expandDims(0);
    return {'segment_ids_1': segment_ids,
            'input_ids_1': input_ids,
            'input_mask_1': input_mask}
}

describe('Bert Sentiment Classifier', () => {
    it('version returns a valid version number', () => {
        expect(sa.version).toMatch(/(\d+)\.(\d+)\.(\d+)/);
    });

    it('encode returns correct the coresponding token ids', async () => {
        const res = await sa.encode(posText);
        expect(res).toEqual(posTokenids);
    });

    it('runInference takes proper named tensor map and returns a tensor', async () => {
        const res = await sa.runInference(genInput());
        expect(res).toBeInstanceOf(tf.Tensor);
    });

    it('idsToTokens convert token ids back to tokens', async () => {
        const res = await sa.idsToTokens(posTokenids);
        expect(res).toEqual(posTokens);
    });

    it('processOutput convert a result Tensor to a Json object', () => {
        const res =  sa.processOutput(resTensor);
        expect(res.neg).toBeInstanceOf(Number);
        expect(res.pos).toBeInstanceOf(Number);
    })

    it('processInput convert text to input for inference', async () => {
        const res = await sa.processInput(posText);
        expect(res.input_ids_1.shape).toEqual([1,128]);
        expect(res.segment_ids_1.shape).toEqual([1,128]);
        expect(res.input_mask_1.shape).toEqual([1,128]);
    });
    beforeEach(function() {
    //   var originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
    });

    it('predict() leans towards pos prediction', async () => {
        const res = await sa.predict(posText);
        expect(res.pos).toBeGreaterThan(res.neg);
      });

    it('predict() leans towards neg prediction', async () => {
        const res = await sa.predict(negText);
        expect(res.neg).toBeGreaterThan(res.pos);
    });

    it('The sum of neg and pos of prediction should be close to 1', async () => {
        const res = await sa.predict(negText);
        expect(res.neg + res.pos).toBeCloseTo(1);
    });
});
