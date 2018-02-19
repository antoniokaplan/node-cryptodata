import fs from 'fs';
import dataForge  from 'data-forge';

const csvParams = {
  headers: {
    included: false,
    downcase: true,
    upcase: true
  },
  delimiter: 'tab',
  decimalSign: 'comma'
};

const loadCsv = (filepath, options=csvParams) => {
  console.log("options",options);
  return dataForge
          .readFileSync(filepath)
          .parseCSV(options);

};

const fileError = (e) => {
  if(e) console.log("FILE ERROR",e);
};

async function writeCsv(filepath, dataFrame, options=csvParams) {
  // await fs.appendFile(filepath, dataFrame.toCSV(), fileError);
  dataFrame.asCSV(options).writeFileSync(filepath);
  return filepath;
}

export {
  loadCsv,
  writeCsv
};
