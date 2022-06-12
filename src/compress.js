import path from 'path';
import os from 'os';
import fs from 'fs';
import zlib from 'zlib';
import colors from './colors.js';
import { showPathDir } from './index.js';
const {whiteColor, greenColor, redColor} = colors;

const compressDecFile = (currentData, currentDir, status) => {
  const home = os.homedir();
  const way1 = currentData.slice(status === 'compress' ? 8 : 11).trim().split(new RegExp(/\.\/|\.\\/, 'g')).filter(item => item !== '');
  const way2 = currentData.slice(status === 'compress' ? 8 : 11).trim().split(home).filter(item => item !== '');
  if (way1.length === 2) {
    const arrReadeblePath = way1[0].split(new RegExp(/\/|\\/, 'g'));
    const currentName = arrReadeblePath.length > 1 ? arrReadeblePath[arrReadeblePath.length - 1] : arrReadeblePath[0];
    const readeblePath = way1[0].includes(home) ? way1[0].trim() : path.join(currentDir, way1[0]).trim();
    const writeblePath = way1[1].includes(home) ? path.join(way1[1].trim(), `${status + 'ed_' + currentName}`) : path.join(currentDir, way1[1].trim(), `${status + 'ed_' + currentName}`).trim();
    if (status === 'compress') {
      compress(readeblePath, writeblePath, currentDir);
    } else if (status === 'decompress') {
      decompress(writeblePath, readeblePath, currentDir);
    }
  } else if (way2.length === 2) {
    const longHomePath = home.length;
    const repeatHomePath = currentData.slice(status === 'compress' ? 8 : 11).trim().slice(0, longHomePath) === home;
    const arrReadeblePath = way2[0].split(new RegExp(/\/|\\/, 'g')).filter((item) => item.trim() !== '');
    const currentName = arrReadeblePath.length > 1 ? arrReadeblePath[arrReadeblePath.length - 1].trim() : arrReadeblePath[0].trim();
    const readeblePath = repeatHomePath ? path.join(home, way2[0]).trim() : path.join(currentDir, way2[0].trim().slice(2));
    const writeblePath = path.join(home, way2[1].trim() ? way2[1].trim() : '', `${status + 'ed_' + currentName}`);
    if (status === 'compress') {
      compress(readeblePath, writeblePath, currentDir);
    } else if (status === 'decompress') {
      decompress(writeblePath, readeblePath, currentDir);
    }
  } else {
    console.log(redColor, `This command: "${currentData}" not correct. Please write path correct (example: ${currentData.slice(0, status === 'compress' ? 8 : 11)} C:\\Users\\user\\Новая папка\\Новый текстовый документ.txt C:\\Users\\user\\way.txt, you must use home directory ${home}\\, or write path from "./": ./Новая папка/Новый текстовый документ.txt ./way.txt or combine both)`, whiteColor);
  }
}

async function compress (readebleFilePath, fileCompressPath, currentDir) {
  console.log(readebleFilePath, fileCompressPath);
  const readebleStream = fs.createReadStream(readebleFilePath);
  const brotliStream = zlib.createBrotliCompress();
  const writebleStream = fs.createWriteStream(fileCompressPath);

  const handlerErr = (err) => {
      console.log(err);
      readebleStream.destroy();
      brotliStream.destroy();
      writebleStream.destroy();
  }

  readebleStream.on('error', handlerErr).pipe(brotliStream).on('error', handlerErr).pipe(writebleStream).on('error', handlerErr).on('finish', () => {
    console.log(greenColor, `File compressed`, whiteColor);
    showPathDir(currentDir);
  });
};

const decompress = async (writebleFilePath, fileDecompressPath, currentDir) => {
  const readebleStream = fs.createReadStream(fileDecompressPath);
  const brotliDecStream = zlib.createBrotliDecompress();
  const writebleStream = fs.createWriteStream(writebleFilePath);

  const handlerErr = (err) => {
      console.log(err);
      readebleStream.destroy();
      brotliDecStream.destroy();
      writebleStream.destroy();
  }
  readebleStream.on('error', handlerErr).pipe(brotliDecStream).on('error', handlerErr).pipe(writebleStream).on('error', handlerErr).on('finish', () => {
    console.log(greenColor, `File decompressed`, whiteColor);
    showPathDir(currentDir);
  });
};

export default compressDecFile;