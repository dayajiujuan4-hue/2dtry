"use strict";

const bgm = new Audio("bgm.mp3");

bgm.loop = true;
bgm.volume = 0.5;
bgm.preload = "auto";

function startBGM() {

  bgm.play()
    .then(() => {

      console.log("♪ BGM再生成功");

    })
    .catch((error) => {

      console.error(
        "BGM再生エラー:",
        error
      );

    });

}


// 最初のクリックで再生
document.addEventListener(
  "click",
  startBGM,
  { once: true }
);


// または最初のキー入力で再生
document.addEventListener(
  "keydown",
  startBGM,
  { once: true }
);
