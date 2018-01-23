
const formatCsv = (obj) => {
  let text = "";
  for (const prop in obj) {
    text += `${obj[prop]}\t`;
  }
  return text + `\n`;
}

const createHeaderRow = (obj) => {
  let text = "";
  for (const prop in obj) {
    text += `${prop}\t`;
  }
  return text + `\n`;
}

export { formatCsv, createHeaderRow }
