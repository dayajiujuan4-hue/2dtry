"use strict";

/*
============================================================
 杭州探索録 - BGM SYSTEM
 武林夜市 共通BGM

 ・全マップ共通
 ・ループ再生
 ・マップ移動しても曲を止めない
 ・最初のプレイヤー操作で再生開始
 ・タブが非表示になっても再生位置を維持
============================================================
*/


// ============================================================
// BGM
// ============================================================

const WULIN_BGM =
  new Audio("assets/audio/bgm.mp3");

WULIN_BGM.loop = true;

// 0.0 ～ 1.0
WULIN_BGM.volume = 0.32;

WULIN_BGM.preload = "auto";


// ============================================================
// STATE
// ============================================================

let wulinBgmStarted = false;


// ============================================================
// START
// ============================================================

function startWulinBGM(){

  if(wulinBgmStarted){
    return;
  }


  WULIN_BGM.play()
    .then(()=>{

      wulinBgmStarted = true;

      removeBGMStartListeners();

      console.log(
        "武林夜市 BGM started"
      );

    })
    .catch(()=>{

      /*
        ブラウザ側で再生を拒否された場合は、
        次の操作でもう一度試す。
      */

      wulinBgmStarted = false;

    });

}


// ============================================================
// FIRST USER ACTION
// ============================================================

function bgmKeyHandler(){

  startWulinBGM();

}


function bgmPointerHandler(){

  startWulinBGM();

}


function bgmTouchHandler(){

  startWulinBGM();

}


// ============================================================
// REMOVE START LISTENERS
// ============================================================

function removeBGMStartListeners(){

  window.removeEventListener(
    "keydown",
    bgmKeyHandler
  );

  window.removeEventListener(
    "pointerdown",
    bgmPointerHandler
  );

  window.removeEventListener(
    "touchstart",
    bgmTouchHandler
  );

}


// ============================================================
// INSTALL LISTENERS
// ============================================================

window.addEventListener(
  "keydown",
  bgmKeyHandler
);


window.addEventListener(
  "pointerdown",
  bgmPointerHandler
);


window.addEventListener(
  "touchstart",
  bgmTouchHandler
);


// ============================================================
// TAB RETURN SAFETY
// ============================================================

document.addEventListener(
  "visibilitychange",
  ()=>{

    if(
      !document.hidden &&
      wulinBgmStarted &&
      WULIN_BGM.paused
    ){

      WULIN_BGM.play()
        .catch(()=>{});

    }

  }
);


// ============================================================
// DEBUG
// ============================================================

console.log(
  "杭州探索録 BGM System loaded"
);
