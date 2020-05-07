const csvParser = require('./csv-parser');
const fileName = 'test.csv';

csvParser(fileName, { separator: ','}); //parse the csv
