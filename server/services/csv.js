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

export default loadCsv;
