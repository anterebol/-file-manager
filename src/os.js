import colors from "./colors.js";
import os from 'os';
const {whiteColor, blueColor, redColor} = colors;

function osLog(info) {
  console.log(blueColor, info, whiteColor);
}

function lookOs(currentData) {
  const search = currentData.slice(2).trim();
  switch (search) {
    case '--EOL':
      osLog(JSON.stringify(os.EOL));
      break;
    case '--cpus':
      const st = os.cpus();
      console.log('Count: ' + st.length);
      os.cpus().forEach(item => {
        console.log('model: ' + item.model);
        console.log('speed: ' + item.speed * 0.001 + 'GHz')
      });
      // osLog();
      break;
    case '--homedir':
      osLog(os.homedir());
      break;
    case '--username':
      osLog(os.userInfo().username);
      break;
    case '--architecture':
      osLog(os.arch());
      break;
    default:
      console.log(redColor, `"${currentData}" Incorrect comand`, whiteColor)
      break;
  }
}

export default lookOs;