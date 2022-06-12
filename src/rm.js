import colors from './colors.js';
import fsPromise from 'fs/promises';
import path from 'path';
import os from 'os';
import { showPathDir } from './index.js';

const {whiteColor, greenColor} = colors;

const rm = (currentData, currentDir) => {
  const currentPath = currentData.split(' ').filter((_, index) => index !== 0).join(' ');
  if (currentPath.includes(os.homedir())) {
    fsPromise.unlink(currentPath).then(() => {
      console.log(greenColor, 'File deleted', whiteColor)
      showPathDir(currentDir);
    }).catch((err) => {
      console.log(err);
      showPathDir(currentDir);
    });
  } else {
    fsPromise.unlink(path.join(currentDir, currentPath)).then(() => {
      console.log(greenColor, 'File deleted', whiteColor)
      showPathDir(currentDir);
    }).catch((err) => {
      console.log(err);
      showPathDir(currentDir);
    });
  }
}

export default rm;