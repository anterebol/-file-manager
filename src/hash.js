import { createReadStream } from 'fs';
import crypto from 'crypto';
import os from 'os';
import path from 'path';
import colors from './colors.js';
import { showPathDir } from './index.js';
const {whiteColor, yellowCollor} = colors;

const hash = (currentData, currentDir) => {
  const currentPath = currentData.split(' ').filter((_, index) => index !== 0).join(' ');
  if (currentPath.includes(os.homedir())) {
    const readebleStream = createReadStream(currentPath);
    readebleStream.on('data', (chunk) => {
      const hex = crypto.createHash('sha256').update(chunk).digest('hex');
      console.log(yellowCollor, hex, whiteColor);
      showPathDir(currentDir);
    })
    readebleStream.on('error', (err) => {
      console.log(err);
      showPathDir(currentDir);
    });
  } else {
    const readebleStream = createReadStream(path.join(currentDir, currentPath));
    readebleStream.on('data', (chunk) => {
      const hex = crypto.createHash('sha256').update(chunk).digest('hex');
      console.log(yellowCollor, hex, whiteColor);
      showPathDir(currentDir);
    })
    readebleStream.on('error', (err) => {
      console.log(err);
      showPathDir(currentDir);
    });
  }
}
export default hash;