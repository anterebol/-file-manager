import colors from './colors.js';
import fsPromise from 'fs/promises';
import path from 'path';

const {whiteColor, greenColor} = colors;

const add = (currentData, currentDir) => {
  const currentPath = currentData.split(' ').filter((_, index) => index !== 0).join(' ');
  if (currentPath) {
    let filePath = path.join(currentDir, currentPath)
    fsPromise.writeFile(filePath, '', 'utf-8').then(() => {
      console.log(greenColor, 'File created', whiteColor);
    }).catch(err => console.log(err));
  }
}

export default add;