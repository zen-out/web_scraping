const fs = require("fs");
const _ = require("lodash");
const { numberOfSimilarities, orderBy, getDifference } = require("./arrays");

let testLinks = "https://www.mangago.me/home/mangalist/123";

class Test {
  one() {
    let data = getData(9.4);
  }
  two() {
    let data = getData(9.4);
    let stringed = JSON.stringify(freqCount(data));
    fs.writeFileSync("./test.json", stringed);
  }
  three() {
    let atLeastTenSimilarities = getSimilarData(10, 9.4);
    let stringed = JSON.stringify(freqCount(atLeastTenSimilarities));
    fs.writeFileSync("./test2.json", stringed);
  }
}
// let test = new Test();
// test.one();
// test.two();
// test.three();

function renameFile() {
  let FOLDER_NAME = "./deletemac";
  fs.readdirSync(FOLDER_NAME).forEach((file) => {
    if (file.endsWith(".json") && file.includes("_")) {
      let fileName = `${FOLDER_NAME}/${file}`;
      let numbersOnly = file.split("_");
      numbersOnly = numbersOnly[numbersOnly.length - 1];
      numbersOnly = `${FOLDER_NAME}/${numbersOnly}`;
      fs.renameSync(fileName, numbersOnly);
    } else {
      console.log("not json");
    }
  });
}

function getSimilarData(getFunction, condition) {
  let myData = fs.readFileSync("./myData.json");
  let parsed = JSON.parse(myData);
  let data = [];
  fs.readdirSync("./data").forEach((file) => {
    if (file.endsWith(".json")) {
      let getData = fs.readFileSync(`./data/${file}`);
      let arr = JSON.parse(getData);
      let pass = getFunction(parsed, arr, condition);
      if (pass) {
        let getDiff = getDifference(arr, parsed);
        data.push(getDiff);
        // data.push(arr);
        data = _.flattenDeep(data);
      }
    } else {
      console.log("not json");
    }
  });
  return orderBy(data);
}

function getData(minRating) {
  let data = [];
  fs.readdirSync("./data").forEach((file) => {
    if (file.endsWith(".json")) {
      let getData = fs.readFileSync(`./data/${file}`);
      let arr = JSON.parse(getData);
      const filteredData = arr.filter((obj) => obj.rating > minRating);
      data.push(filteredData);
      data = _.flattenDeep(data);
    } else {
      console.log("not json");
    }
  });
  return orderBy(data);
}

function getAllFolderB4Json(folderName) {
  let fileNames = fs.readdirSync(folderName);
  let names = [];
  fileNames.forEach((name) => {
    let number = name.split(".");
    let getName = number[0];
    names.push(getName);
  });
  return names;
}
module.exports = { renameFile, getSimilarData, getData, getAllFolderB4Json };
