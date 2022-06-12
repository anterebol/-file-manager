import path from 'path';
import os from 'os';
import fs from 'fs';
import fsPromise from 'fs/promises';
import colors from './colors.js';
import { showPathDir } from './index.js';
const {whiteColor, greenColor, redColor} = colors;

export default function cpFile(currentData, currentDir, status = '') {
  const home = os.homedir();
  const way1 = currentData.slice(2).trim().split(new RegExp(/\.\/|\.\\/, 'g')).filter(item => item !== '');
  const way2 = currentData.slice(2).trim().split(home).filter(item => item !== '');
  if (way1.length === 2) {
    const arrReadeblePath = way1[0].split(new RegExp(/\/|\\/, 'g'));
    const currentName = arrReadeblePath.length > 1 ? arrReadeblePath[arrReadeblePath.length - 1] : arrReadeblePath[0];
    const readeblePath = way1[0].includes(home) ? way1[0].trim() : path.join(currentDir, way1[0]).trim();
    const writeblePath = way1[1].includes(home) ? path.join(way1[1].trim(), currentName) : path.join(currentDir, way1[1].trim(), currentName).trim();
    const writebleStream = fs.createWriteStream(writeblePath);
    const readebleStream = fs.createReadStream(readeblePath);
    readebleStream.on('error', (err) => {
      writebleStream.end();
      console.log(err);
    }).pipe(writebleStream).on('finish', () => {
      if (status === 'moved') {
        fsPromise.unlink(readeblePath).then(() => {
          console.log(greenColor, 'File moved', whiteColor);
          showPathDir(currentDir);
        }).catch((err) => {
          console.log(err);
          showPathDir(currentDir);
        })
      } else {
        console.log(greenColor, 'File copied', whiteColor);
        showPathDir(currentDir);
      }
    }).on('error', (err) => console.log(err));
  } else if (way2.length === 2) {
    const longHomePath = home.length;
    const repeatHomePath = currentData.slice(2).trim().slice(0, longHomePath) === home;
    const arrReadeblePath = way2[0].split(new RegExp(/\/|\\/, 'g')).filter((item) => item.trim() !== '');
    const currentName = arrReadeblePath.length > 1 ? arrReadeblePath[arrReadeblePath.length - 1].trim() : arrReadeblePath[0].trim();
    const readeblePath = repeatHomePath ? path.join(home, way2[0]).trim() : path.join(currentDir, way2[0].trim().slice(2));
    const writeblePath = path.join(home, way2[1].trim() ? way2[1].trim() : '', currentName);
    const writebleStream = fs.createWriteStream(writeblePath);
    const readebleStream = fs.createReadStream(readeblePath);
    readebleStream.on('error', (err) => {
      writebleStream.end();
      console.log(err);
    }).pipe(writebleStream).on('finish', () => {
      if (status === 'moved') {
        fsPromise.unlink(readeblePath).then(() => {
          console.log(greenColor, 'File moved', whiteColor);
          showPathDir(currentDir);
        }).catch((err) => console.log(err))
      } else {
        console.log(greenColor, 'File copied', whiteColor);
        showPathDir(currentDir);
      }
    }).on('error', (err) => {
      console.log(err);
      showPathDir(currentDir);
    });
  } else {
    console.log(redColor, `This command: "${currentData}" not correct. Please write path correct (example: ${currentData.slice(0, 2)} C:\\Users\\user\\Новая папка\\Новый текстовый документ.txt C:\\Users\\user\\way.txt, you must use home directory ${home}\\, or write path from "./": ./Новая папка/Новый текстовый документ.txt ./way.txt or combine both)`, whiteColor);
  }
}