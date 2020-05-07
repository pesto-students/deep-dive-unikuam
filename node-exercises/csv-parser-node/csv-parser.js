const { Transform } = require('stream');
const resources = require('./resources');
const fs = require('fs');
const DEFAULT_ENCODING = 'utf8';
const lineBreakers = ["\r\n", "\n", "\r"];

// TODO: remove the commented variables
const parse = async function(data, options) {
  let csvStreamData;
  const csvReadStream = fs.createReadStream(data, {
    flags: 'r',
    encoding: DEFAULT_ENCODING,
    // highWaterMark: 10
  });
  const csvParse = new CsvParse(options);
  csvParse.setEncoding(DEFAULT_ENCODING);
  for await (const chunk of csvReadStream) {
    try {
      csvParse.write(chunk, DEFAULT_ENCODING);
    } catch(err) {
      throw new Error(err);
    }
  }
  csvParse.on('data', (chunk) => {
    console.log(chunk);
  });
  csvParse.on('error', (error) => {
    throw new Error(error);
  });
  csvReadStream.on('error', (error) => {
    throw new Error(error);
  })
}

class CsvParse extends Transform {
  constructor(options) {
    options.writableObjectMode = true;
    super(options);
    this.options = options;
  }
  _transform(csvDataChunk, encoding, callback) {
    let rowArray = csvDataChunk.split(lineBreakers[0]);
    const csvJsonResponse = [];
    const {
      separator
    } = this.options;
    for (const row of rowArray) {
      if (!row.length) continue;
      if (rowArray.indexOf(row) === 0) {
        let headerFields = row.split(separator);
        csvJsonResponse[0] = headerFields.filter(headerField => headerField != '');
      } else {
        csvJsonResponse.push(row.split(separator[0]));
      }
    }
    this.validateCsvResponse(csvJsonResponse);
    // console.log(csvJsonResponse);
    this.push(JSON.stringify(csvJsonResponse));
    callback();
  }

  validateCsvResponse(csvJsonResponse) {
    //throws error if fields count are not equal
    this.checkForFieldsCountInRows(csvJsonResponse);
  }

  checkForFieldsCountInRows(csvJsonResponse) {
    const areRowsEqual = csvJsonResponse.every(row => csvJsonResponse[0].length === row.length);
    if (!areRowsEqual) {
      throw new Error(resources.fieldsMismatchErrorIfHeaderPresents);
    }
  }
}

module.exports = parse;
