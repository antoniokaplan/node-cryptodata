import fs from 'fs';
import {formatCsv, createHeaderRow} from './csv-format';

// the first line will create a writeStream to the file path
// const FS = (filePath) => {
//   const file = filePath;
const fileError = (e) => {
  if(e) console.log("FILE ERROR",e);
};

const initDir = (myDir) => {
  try {
    fs.accessSync(myDir);
  } catch (e) {
    fs.mkdirSync(myDir);
  }
}

/**
  * checks if file exists, if not it creates the header row
*/
async function initFile(dir, fullPath, obj){
  initDir(dir);
  try {
    await fs.accessSync(fullPath);
  } catch (e) {
    const headerRow = createHeaderRow(obj);
    await fs.appendFile(fullPath, headerRow, fileError);
    return false;
  }
  return true;
}


async function addToFile(dir, filePath, obj) {
  let fileData = formatCsv(obj);
  const fullPath = `${dir}/${filePath}`;
  try {
    const exists = await initFile(dir, fullPath, obj);
    // fileData = await fs.appendFile(filePath, JSON.stringify(obj), fileError);
    if(exists) fileData = await fs.appendFile(fullPath, fileData, fileError);
  } catch(e) {
    fileData = e;
    console.log("addToFile",e);
  }
  return fileData;
}

/**
 * read file async
 */
async function readFile(filePath) {
  let fileData;
  try {
    fileData = await fs.readFile(filePath, fileError);
  } catch(e) {
    console.log(e)
    fileData = e;
  }
  return fileData;
};

// };

export { addToFile,  readFile };
