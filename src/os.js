import colors from "./colors.js";
import os from 'os';
import { showPathDir } from "./index.js";
const {whiteColor, blueColor, redColor} = colors;

function osLog(info, currentDir) {
  console.log(blueColor, info, whiteColor);
  showPathDir(currentDir)
}

function lookOs(currentData, currentDir) {
  const search = currentData.slice(2).trim();
  switch (search) {
    case '--EOL':
      osLog(JSON.stringify(os.EOL), currentDir);
      break;
    case '--cpus':
      const st = os.cpus();
      console.log('Count: ' + st.length);
      os.cpus().forEach(item => {
        console.log('model: ' + item.model);
        console.log('speed: ' + item.speed * 0.001 + 'GHz')
      });
      showPathDir(currentDir)
      // osLog();
      break;
    case '--homedir':
      osLog(os.homedir(), currentDir);
      break;
    case '--username':
      osLog(os.userInfo().username, currentDir);
      break;
    case '--architecture':
      osLog(os.arch(), currentDir);
      break;
    default:
      console.log(redColor, `"${currentData}" Incorrect comand`, whiteColor);
      showPathDir(currentDir);
      break;
  }
}

export default lookOs;