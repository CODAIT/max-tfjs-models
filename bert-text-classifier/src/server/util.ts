import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';


export async function fetchModel(url: string, dir: string){
  const target = path.join(dir, 'model.tgz');
  const res = await fetch(url);
  // console.log("in fetching mode model");
  const fileStream = fs.createWriteStream(target);
  return new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", (err)=>{
      reject(err);
    });
    fileStream.on("finish", ()=>{
      resolve();
    })
  });
}
export async function untar(source: string, dest: string){
  const {extract} = require('tar');
  await extract({
    file: source,
    cwd: dest,
    strip: 1
  })
}

