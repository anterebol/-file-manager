import path from 'path';
import fs from 'fs';
import fsPromise from 'fs/promises'
import os from 'os';
import cpFile from './cp.js';
import lookOs from './os.js';
import colors from './colors.js';
import { argv } from 'process';
import hash from './hash.js';
import ls from './ls.js';
import add from './add.js';
import rm from './rm.js';
import cat from './cat.js';
import compressDecFile from './compress.js';

const { blueColor, whiteColor, greenColor, redColor, yellowCollor} = colors;

export const showPathDir = (currentDir) => console.log(whiteColor, `You are currently in`, blueColor, `${currentDir}`, whiteColor);

const fileManager = async (name) => {
  const home = os.homedir();
  const stdin = process.stdin;
  let currentDir = os.homedir();
  showPathDir(currentDir);
  let currentPath;
  console.log(' Welcome to the File Manager,', greenColor, name.trim() + '!', whiteColor)
  
  stdin.on('data', (data) => {
    const currentData = data.toString().trim();
    switch (true) {
      case '.exit' === currentData:
        console.log(whiteColor,`Thank you for using File Manager, ${name}!`);
        process.exit(0);
      case 'ls' === currentData:
        ls(currentDir);
        break;
      case currentData.slice(0, 2) === 'cd':
        currentPath = currentData.split(' ').filter((_, index) => index !== 0).join(' ');
          if (currentPath.includes(os.homedir())) {
            fs.readdir(currentPath, 'utf-8', (err, dirs) => {
              if (!err, dirs) {
                currentDir = currentPath;
                showPathDir(currentDir);
              } else {
                  console.log(redColor, `"${currentData}" Write correct path`, whiteColor)
              }
            })
          } else {
              fs.readdir(path.join(currentDir, currentPath.slice(2)), 'utf-8', (err, dirs) => {
                if (!err, currentPath, dirs) {
                  fs.stat(path.join(currentDir, currentPath), (err, data) => {
                    if (!data.isFile()) {
                      currentDir = path.join(currentDir, currentPath);
                      showPathDir(currentDir);
                    } else {
                      console.log(redColor, `"${currentPath}": not a dilsrectory`, whiteColor)
                    }
                  })
                } else {
                  console.log(redColor, `"${currentData}" Please write correct path`, whiteColor)
                }
              })
            }      
          break;
      case 'up' === currentData:
        if (currentDir !== os.homedir()) {
          const arrDir = currentDir.split('\\');
          if (arrDir.length > 1) {
            currentDir = arrDir.filter((_, index) => index !== arrDir.length - 1).join('\\');
          }
          } else {
            console.log(redColor, `You can't up of your home directory`, whiteColor)
          }
          showPathDir(currentDir);
          break;
      case currentData.slice(0, 3) === 'cat':
        cat(currentData, currentDir);
        break;
      case currentData.slice(0, 3) === 'add':
        add(currentData, currentDir);
        break;
      case currentData.slice(0, 2) === 'rn':
        if (currentData.includes(os.homedir())) {
          const arrPath = currentData.slice(2).trim().split(' ');
          const last = arrPath[arrPath.length - 1];
          currentPath = arrPath[0];
          let status;
          const arrSplit = currentPath.split(new RegExp(/\/|\\/, 'g'));
          currentPath = arrSplit.filter((item, index) => index !== arrSplit.length - 1);
          const startName = arrSplit[arrSplit.length - 1];
          const searhArr = arrPath.slice(1, arrPath.length - 1);
          currentPath = path.join(...currentPath);
          fsPromise.readdir(currentPath, 'utf-8').then((res) => {
            for (let i = searhArr.length - 1; i > 0; i--) {
              // add emit
              const searchName = startName + ' ' + searhArr.slice(0, i).join(' ');
              if (res.includes(searchName)) {
                const oldName = searchName;
                const currentName = searhArr.slice(i).join(' ') + ' ' + last;
                if (!res.includes(currentName)) {
                  fsPromise.rename(path.join(currentPath, oldName), path.join(currentPath, currentName)).then(() => {
                    status = true;
                    console.log(greenColor, 'File renamed', whiteColor);
                    showPathDir(currentDir);
                    console.log(oldName, currentName, currentPath)
                  }).catch((err) => {
                    console.log(err);
                    showPathDir(currentDir);
                  });
                } else {
                  console.log(redColor, 'File with the same name already exists', whiteColor);
                  showPathDir(currentDir);
                }
                break;
              }
            }
          }).catch((err) => {
            console.log(err);
            showPathDir(currentDir);
          })
        } else {
          const arrPath = currentData.slice(2).trim().split(' ').slice(2);
          const last = arrPath[arrPath.length - 1];
          currentPath = arrPath[0];
          let status;
        }
        break;
      case currentData.slice(0, 2) === 'cp':
        cpFile(currentData, currentDir)
        break;
      case currentData.slice(0, 2) === 'mv':
        cpFile(currentData, currentDir, 'moved')
        break;
      case currentData.slice(0, 2) === 'rm':
        rm(currentData, currentDir);
        break;
      case currentData.slice(0, 8) === 'compress':
        compressDecFile(currentData, currentDir, 'compress');
        break;
      case currentData.slice(0, 10) === 'decompress':
        compressDecFile(currentData, currentDir, 'decompress');
        break;
      case currentData.slice(0, 2) === 'os':
        lookOs(currentData);
        break;
      case currentData.slice(0, 4) === 'hash':
        hash(currentData, currentDir);
        break;
      default:
        console.log(redColor, `"${currentData}" Incorrect comand`, whiteColor)
        break;
    }
    process.stdout.write('')
  })
}
if (argv.length === 3) {
  if (argv[2].slice(0, 11) === '--username=') {
    fileManager(argv[2].slice(11));
  }
}