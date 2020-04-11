const _ = require('lodash');
const fs = require('fs');
const csv = require('csvtojson');
const YAML = require('./json-to-yaml.js');

const csvFilePath='./input/translate.csv';

csv({
  noheader: true,
  delimiter: ';'
})
.fromFile(csvFilePath)
.then((jsonArray)=>{
  const newJson = jsonArray.reduce((acc, item) => {
    const string = item.field1.replace(/\//g, ".");

    const newAcc = _.set(acc, string, item.field2);

    return {
      ...newAcc,
    };
  }, {});

  const data = YAML.stringify(newJson);

  fs.writeFile('./output/translate.yml', data, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  console.log(data);
});
