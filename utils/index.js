const { getHTML } = require("./getHTML");
const {
  numberOfSimilarities,
  getDifference,
  freqCount,
  orderBy,
} = require("./arrays");
const { jaccard, overlap, minSimilar, sorensenDice } = require("./conditions");
const {
  renameFile,
  getSimilarData,
  getData,
  getAllFolderB4Json,
} = require("./folders");
module.exports = {
  numberOfSimilarities,
  getDifference,
  freqCount,
  orderBy,
  jaccard,
  overlap,
  minSimilar,
  sorensenDice,
  renameFile,
  getSimilarData,
  getData,
  getAllFolderB4Json,
  getHTML,
};
