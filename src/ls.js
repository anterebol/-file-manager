import path from 'path';
import fsPromise from 'fs/promises';
import colors from './colors.js';
import { showPathDir } from './index.js';
const {whiteColor, blueColor, redColor} = colors;

const ls = (currentDir) => {
  fsPromise.readdir(currentDir, 'utf-8').then((dirs) => {
    if (dirs.length > 0) {
      Promise.all(dirs.map( async (dir, index) => {
        return fsPromise.stat(path.join(currentDir, dir), 'utf-8').then((data) => {
          const isFile = data.isFile();
          if (isFile) {
            console.log(whiteColor, dirs[index]);
          } else {
            console.log(blueColor, dirs[index], whiteColor);
          }
        })
      })).then(() => showPathDir(currentDir));
    } else {
      console.log(redColor, 'Folder is empty', whiteColor);
      showPathDir(currentDir);
    }
  }).catch((err) => console.log(err, redColor, 'Возможно вы не имеете доступ к этой папке', whiteColor));
}

export default ls;