const cheerio = require("cheerio");
const fs = require("fs");
const moment = require("moment");
const _ = require("lodash");
const {
  getHTML,
  numberOfSimilarities,
  getAllFolderB4Json,
} = require("../utils");

class MangaGoTest {
  // get a list of mangas
  async one() {
    let listUrl = `https://www.mangago.me/home/mangalist/123/?filter=&page=1`;
    let htmlString = await getHTML(listUrl);
    let getPage = getOnePage(htmlString);
    if (getPage.length > 1) {
      if (getPage[0].title && getPage[0].rating) {
        console.log("Okay, can get title and rating", getPage[0]);
      }
    }
  }
  // can get list data
  async two() {
    let navData = await getListData("123");
    let length = navData.length - 1;
    if (navData.length > 1) {
      if (navData[length].title && navData[length].rating) {
        console.log("Okay, can get title and rating", navData[length]);
      } else {
        console.log("error?");
      }
    } else {
      console.log("error", navData.length);
    }
  }
  // get rec list
  async three() {
    let recList = await getRecList("inso_s_law");
    if (recList.length) {
      console.log("Works", recList[0]);
    } else {
      console.log("no");
    }
  }
  // loop through lists and compare
  async four() {
    let myList = "2359589";
    let toCompare = "inso_s_law";
    let number1 = 1;
    let number2 = 2;
    let data = await loopThroughRecList(myList, toCompare, number1, number2);
    console.log(data);
  }
  async final() {}
}

// let test = new MangaGoTest();
// test.one();
// test.two();
// test.three();
// test.final();

async function loopThroughRecList(myList, manga, number1, number2, minSim) {
  let myMangas = await getListData(myList);
  let getMangas = [];
  let recList = await getRecList(manga, number1, number2);
  for (let i = 0; i < recList.length; i++) {
    let link = recList[i].link;
    link = link.replace("https://www.mangago.me/home/mangalist/", "");
    link = link.replace("/", "");
    let data = await getListData(link);
    if (numberOfSimilarities(myMangas, data) > minSim) {
      console.log("page", i, "/", recList.length);
      console.log("LINK", link);
      data = _.orderBy(data, "rating", "desc");
      let fileName = `./data/${manga}_${link}.json`;
      let stringed = JSON.stringify(data);
      fs.writeFileSync(fileName, stringed);
      getMangas.push(data);
    }
  }
  getMangas = _.flattenDeep(getMangas);
  getMangas = _.orderBy(getMangas, "rating", "desc");
  return getMangas;
}

async function getRecList(mangaToCompare, number1, number2) {
  let recLists = [];
  for (let i = number1; i < number2; i++) {
    let url = `https://www.mangago.me/home/manga/list/${mangaToCompare}/1/?page=${i}`;
    let html = await getHTML(url);
    let getList = getOneRecList(html);
    recLists.push(getList);
    recLists = _.flattenDeep(recLists);
  }
  return recLists;
}
//
function getOneRecList(htmlString) {
  let recLists = [];
  const $ = cheerio.load(htmlString);
  let allFiles = getAllFolderB4Json("./data");
  let recLinks = $(
    "div[style='border-bottom:1px dashed #bdbdbd;width:620px;float:left;line-height:25px;padding:10px 0']"
  );
  recLinks.each((index, element) => {
    let date = $(element)
      .find(
        "span[style='text-align:right;color:#bdbdbd;font-size:13px;width:100px;line-height:50px;']"
      )
      .text();
    if (moment(date).isAfter(moment("2021-12-31"))) {
      let link = $(element)
        .find("a[href*=https://www.mangago.me/home/mangalist/]")
        .attr("href");
      let getId = link.split("mangalist/");
      getId = link[1] + ".json";
      if (!allFiles.includes(getId)) {
        let title = $(element)
          .find("a[href*=https://www.mangago.me/home/mangalist/]")
          .text();
        let obj = { title, link, date };
        recLists.push(obj);
      }
    }
  });
  return recLists;
}

// input: 2359589
async function getListData(LIST_ID) {
  let firstPage = await getHTML(
    `https://www.mangago.me/home/mangalist/${LIST_ID}`
  );
  let data = [];
  const $ = cheerio.load(firstPage);
  let navigation = parseInt($(".navigation option").length);
  if (navigation == 0) {
    let listUrl = `https://www.mangago.me/home/mangalist/${LIST_ID}/?filter=&page=1`;
    let getData = await getHTML(listUrl);
    let getPage = getOnePage(getData);
    data.push(getPage);
    return _.flattenDeep(data);
  } else {
    for (let j = 1; j <= navigation; j++) {
      let listUrl = `https://www.mangago.me/home/mangalist/${LIST_ID}/?filter=&page=${j}`;
      let getData = await getHTML(listUrl);
      let getPage = getOnePage(getData);
      console.log(getPage);
      data.push(getPage);
    }
    return _.flattenDeep(data);
  }
}
// input: html of https://www.mangago.me/home/mangalist/2359589 / page whatever
function getOnePage(htmlString) {
  const mangas = [];
  const $ = cheerio.load(htmlString);
  const sections = $(".comment");
  sections.each((index, element) => {
    let filterForConditions = $(element).text().toLowerCase();
    let no = filterForConditions.includes("asdf");
    let no2 = filterForConditions.includes("adsf");
    if (!no && !no2) {
      let title = $(element).find(".title a").text();
      if (title.length > 1) {
        let link = $(element).find("a").attr("href");
        let rating = $(element)
          .find("span[style='color:#FBFA7C;line-height:16px;']")
          .text();
        rating = parseFloat(rating.trim());
        let obj = {
          title,
          rating,
          link,
        };
        mangas.push(obj);
      }
    }
  });
  return _.flattenDeep(mangas);
}

module.exports = { loopThroughRecList, getListData };
