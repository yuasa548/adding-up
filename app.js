'use strict';
const fs = require("node:fs");
const readline = require("node:readline");
const rs = fs.createReadStream("./popu-pref.csv");
const rl = readline.createInterface({input: rs});
const prefectureDataMap = new Map();

rl.on("line", lineString => {
  // console.log(lineString);
  const columns = lineString.split(",");
  const year = parseInt(columns[0]);
  const prefecture = columns[1]; // 場所情報
  const popu = parseInt(columns[3]);

  

  if(year===2016 || year===2021){
    // console.log(year);
    // console.log(prefecture);
    // console.log(popu);
    let value = null; // 場所ごとの推移
    if(prefectureDataMap.has(prefecture)){
      value = prefectureDataMap.get(prefecture);
    }else{
      value = { //taple?
        before: 0,
        after: 0,
        change: null
      };
    }
    if(year===2016){
      value.before = popu;
    }
    if(year===2021){
      value.after = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});

rl.on("close", () => {
  for (const [key, value] of prefectureDataMap){
    value.change = value.after / value.before;
  }
  // console.log(prefectureDataMap);
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2)=>{
    return pair2[1].change - pair1[1].change;
  });
  // console.log(rankingArray);
  const rankingStrings = rankingArray.map(([key, value])=>{
    return `${key}: ${value.before}=>${value.after} 変化率: ${value.change}`;
  });
  console.log(rankingStrings);
}); // 全ての行を読み込んだら"close"イベントが発生