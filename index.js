const _ = require('lodash');
const fs = require('fs');
const csv = require('csvtojson');
const YAML = require('./json-to-yaml.js');

const csvFilePath='./input/translate.csv';

// Escape single "'" characters (for French language for example)
const escapeCharacters = escapedString => {
  const lettersArr = [...escapedString];


  const escapedLettersArr = lettersArr.reduce((acc, item, index) => {
    if (item === "'" && _.get(lettersArr, [index + 1]) !== "'" && _.get(lettersArr, [index - 1]) !== "'") {
      return [...acc, item, "'"];
    }
    
    return [...acc, item];
  }, []);

  const newEscapedString = escapedLettersArr.join("");

  return newEscapedString;
}

csv({
  noheader: true,
  delimiter: ';'
})
.fromFile(csvFilePath)
.then((jsonArray)=>{
  const newJson = jsonArray.reduce((acc, item, index) => {
    const string = item.field1.replace(/\//g, ".");

    if (index === 18) {
      console.log({ item });
    }
    // Used setWith instead set, for case then numbers is a keys for object
    const newAcc = _.setWith(acc, string, escapeCharacters(item.field2), Object);

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
