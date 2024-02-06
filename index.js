const _ = require("lodash");
const fs = require("fs");
const { getHTML } = require("./utils");

async function letsPrint() {
  // let data = await getHTML("https://j2semi.com/cpxx");
  // fs.writeFileSync("./openAi/cpxx.html", data);

  // let data2 = await getHTML(
  //   "https://www.hkstp.org/zh-hk/news-room/mou-signing-ceremony/"
  // );
  // fs.writeFileSync("./openAi/hkstp.html", data2);

  let data3 = await getHTML("https://www.j2semi.com/gsjj");
  fs.writeFileSync("./openAi/gsjj.html", data3);
}

letsPrint();
