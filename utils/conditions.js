const _ = require("lodash");
const { numberOfSimilarities } = require("./arrays");
function minSimilar(arr, arr2, minSimilar) {
  if (numberOfSimilarities(arr, arr2) >= minSimilar) {
    return true;
  } else {
    return false;
  }
}
// ranges from 0-1
// high is like > 0.1
function jaccard(arr1, arr2, minRating) {
  const set1 = new Set(arr1.map((item) => item["title"]));
  const set2 = new Set(arr2.map((item) => item["title"]));
  const intersection = new Set(arr1.filter((item) => set2.has(item["title"])));
  const union = new Set([...set1, ...set2]);
  let rating = intersection.size / union.size;
  if (rating > minRating) {
    return true;
  } else {
    return false;
  }
}
// let overlap = overlapCoefficient(parsed, arr, minRating);
// ranges from 0-1 (high is like >0.6)
function overlap(userA, userB, minRating) {
  const setA = new Set(userA.map((manga) => manga.title));
  const setB = new Set(userB.map((manga) => manga.title));
  const intersectionSize = Array.from(setA).filter((title) =>
    setB.has(title)
  ).length;
  const minSize = Math.min(setA.size, setB.size);
  let rating = intersectionSize / minSize;
  if (rating > minRating) {
    return true;
  } else {
    return false;
  }
}

function sorensenDice(arr1, arr2, minRating) {
  const set1 = new Set(arr1.map((item) => item["title"]));
  const set2 = new Set(arr2.map((item) => item["title"]));
  const intersectionSize = new Set(
    arr1.filter((item) => set2.has(item["title"]))
  ).size;
  const denominator = set1.size + set2.size;
  let rating = (2 * intersectionSize) / denominator;
  if (rating > minRating) {
    return true;
  } else {
    return false;
  }
}

module.exports = { jaccard, overlap, minSimilar, sorensenDice };
