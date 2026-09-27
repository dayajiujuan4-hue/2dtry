"use strict";

const bgm = new Audio("./assets/audio/bgm.mp3");

bgm.loop = true;
bgm.volume = 0.4;
bgm.preload = "auto";

async function startBGM() {
  try {
    await bgm.play();

    console.log("BGM再生成功");
    console.log("BGM:", bgm.src);

    document.removeEventListener("click", startBGM);
    document.removeEventListener("keydown", startBGM);

  } catch (error) {
    console.error("BGM再生失敗:", error);
  }
}

document.addEventListener("click", startBGM);
document.addEventListener("keydown", startBGM);

bgm.addEventListener("canplaythrough", () => {
  console.log("bgm.mp3 読み込み完了");
});

bgm.addEventListener("error", () => {
  console.error(
    "bgm.mp3を読み込めませんでした。",
    bgm.error
  );
});
