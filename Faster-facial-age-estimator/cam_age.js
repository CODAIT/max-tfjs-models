//
// Copyright 2018 IBM Corp. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const modelUrl = '/model/tensorflowjs_model.pb'
const weightsUrl = '/model/weights_manifest.json'
var theModel

async function loadModel () {
  tf.disableDeprecationWarnings();
  theModel = await tf.loadFrozenModel(modelUrl, weightsUrl);
}

async function runface (videoEl, detectresult) {
    let ppl_count=0;
    var i;
    var img=tf.zeros([1, 64, 64, 3]);
    var age_rst = new Array (detectresult.length)
    var x = new Array (detectresult.length)
    var y = new Array (detectresult.length)
    var bbxwidth = new Array (detectresult.length)
    var bbxheight = new Array (detectresult.length)
    for (i = 0; i <detectresult.length; i++) {
        ppl_count+=1
        x[i]=detectresult[i][1]-detectresult[i][2]/2;
        y[i]=detectresult[i][0]-detectresult[i][2]/2;
        bbxwidth[i]=detectresult[i][2];
        bbxheight[i]=detectresult[i][2];
        // crop detected faces
        tmp=await crop_tensor(videoEl,x[i],y[i],bbxwidth[i],bbxheight[i]);
        if (i==0){
            img=tmp
        }
        else{
        img=tf.concat([img, tmp])
        }
    }

   // Inference
   stats.begin();
   let output = tf.tidy(() => theModel.predict(img))
   stats.end();
   age_rst = output.toInt()
   return age_rst
}

//// crop detected faces
//async function crop_tensor(imageInput,x,y,w,h) {
//return tf.tidy(() => {
//
//    // read input image into tensor
//    let inputTensor = tf.browser.fromPixels(imageInput)
//
//    // crop face tensor
////    inputTensor = inputTensor.slice([y,x], [h, w])
//
//    inputTensor=tf.image.resizeBilinear(inputTensor,([64,64]))
//    inputTensor=inputTensor.toFloat();
//    let cropped_face_tensor = tf.expandDims(inputTensor);
//    return cropped_face_tensor
//    })
//}

async function crop_tensor (imageInput,x,y,w,h) {
return tf.tidy(() => {
     var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
     var imgData = ctx.getImageData(imageInput,x,y,w,h);
     let inputTensor = tf.browser.fromPixels(imgData)
     inputTensor=tf.image.resizeBilinear(inputTensor,([64,64]))
     inputTensor=inputTensor.toFloat();
     let cropped_face_tensor = tf.expandDims(inputTensor);
    return cropped_face_tensor
    })
}