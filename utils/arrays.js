const _ = require("lodash");

function numberOfSimilarities(arr1, arr2) {
  const similarities = _.intersectionWith(arr1, arr2, _.isEqual);
  return similarities.length;
}
function getDifference(toCompare, original) {
  const difference = _.differenceWith(
    toCompare,
    original,
    (obj1, obj2) => obj1.title === obj2.title
  );
  return difference;
}
function freqCount(arr) {
  const frequency = arr.reduce((count, obj) => {
    const key = JSON.stringify(obj);
    count[key] = (count[key] || 0) + 1;
    return count;
  }, {});
  const sortedArray = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
  const sortedObj = Object.fromEntries(sortedArray);
  return sortedObj;
}
function orderBy(arr) {
  return _.orderBy(arr, "rating", "desc");
}

module.exports = { numberOfSimilarities, getDifference, freqCount, orderBy };
