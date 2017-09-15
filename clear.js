const jsonfile = require('jsonfile');
const { remove } = require('ramda');
const [scenario, testId] = process.argv[2].split(':');

const year = '20' + testId.slice(0,2);
const month = testId.slice(2,4);

console.log(scenario, year, month, testId);
const filename = `./results/${scenario}/${year}/${month}.json`;

function clearInData(data, index) {
  for (const key in data) {
    if (typeof data[key] === 'object') {
      if (data[key] instanceof Array) {
        data[key] = remove(index, 1, data[key]);
      } else {
        clearInData(data[key], index)
      }
    }
  }
}

jsonfile.readFile(filename, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const index = data._r.id.indexOf(testId);
  if(~index) {
    clearInData(data, index);
    jsonfile.writeFile(filename, data, err => {
      if (err) {
        console.error(err);
        return;
      }
    });
  } else {
    console.log('Test with testId ===', testId, 'not found')
  }
});

