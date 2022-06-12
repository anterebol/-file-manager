import colors from './colors.js';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { showPathDir } from './index.js';

const {whiteColor, yellowCollor} = colors;

const cat = (currentData, currentDir) => {
  const currentPath = currentData.split(' ').filter((_, index) => index !== 0).join(' ');
  if (currentPath.includes(os.homedir())) {
    const readebleStream = fs.createReadStream(currentPath);
    readebleStream.on('data', (data) => {
      if (data) {
        console.log(yellowCollor, data.toString(), whiteColor);
      }
    });
    readebleStream.on('error', (err) => {
      console.log(err);
    });
    readebleStream.on('end', () => showPathDir(currentDir));
  } else {
    let filePath = path.join(currentDir, currentPath)
    const readebleStream = fs.createReadStream(filePath);
    readebleStream.on('data', (data) => {
      if (data) {
        console.log(yellowCollor, data.toString(), whiteColor);
      }
    });
    readebleStream.on('error', (err) => {
      console.log(err);
    })
    readebleStream.on('end', () => showPathDir(currentDir));
  }
}
export default cat;