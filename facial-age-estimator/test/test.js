import * as tf from '@tensorflow/tfjs-node'
import {loadModel, processInput, runInference, processOutput, predict} from '../src/facial-age-estimator'

import {read, MIME_PNG} from 'jimp'
import {createCanvas, loadImage} from 'canvas'


const createCanvasElement = function (imageInput) {
    return new Promise(async (resolve, reject) => {
        const img = await loadImage(imageInput)
        let canvas = createCanvas(img.width, img.height)
        let ctx = canvas.getContext('2d')
        await ctx.drawImage(img, 0, 0)
        resolve(canvas)
    })
}

const imagePath = `${__dirname}/face.jpg`

// TODO Refactor this using an actual testing framework
// Test single image inputs
read(imagePath)
    .then(imageData => imageData.getBufferAsync(MIME_PNG))
    .then(imageBuffer => createCanvasElement(imageBuffer))
    .then(imageElement => processInput(imageElement))
    .then(input => runInference(input))
    .then(output => processOutput(output))
    .then(ages => console.log(ages));

read(imagePath)
    .then(imageData => imageData.getBufferAsync(MIME_PNG))
    .then(imageBuffer => createCanvasElement(imageBuffer))
    .then(imageElement => predict(imageElement))
    .then(ages => console.log(ages))

// Test multiple image inputs
read(imagePath)
    .then(imageData => imageData.getBufferAsync(MIME_PNG))
    .then(imageBuffer => createCanvasElement(imageBuffer))
    .then(imageElement => {
        let input = [imageElement, imageElement]
        console.log(input);
        return processInput(input)
    })
    .then(input => runInference(input))
    .then(output => processOutput(output))
    .then(ages => console.log(ages));