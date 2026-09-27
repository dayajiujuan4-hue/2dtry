"use strict";

/*
============================================================
 杭州探索録 Ver.6
 CHINESE LEARNING SYSTEM

 ・屋台で実践中国語
 ・3択会話
 ・間違えても自然に学べる
 ・既存100語と連動
 ・図鑑にリセットボタン追加
 ・二段階確認
 ・収集語 / 称号 / 100語達成を初期化

 game.js / motion.js の基本システムは変更しない
============================================================
*/


// ============================================================
// STATE
// ============================================================

const LEARN6 = {

  active:false,

  phase:"",

  event:null,

  selected:0,

  resultCorrect:false,

  rewardQueue:[],

  resetConfirm:false

};


// ============================================================
// CSS
// ============================================================

function learn6InstallStyle(){

  const style=
    document.createElement("style");


  style.textContent=`

    /* ===============================================
       PRACTICAL CHINESE PANEL
    =============================================== */

    #learn6Panel{
      position:absolute;
      left:50%;
      bottom:34px;
      transform:translateX(-50%);
      width:min(760px,calc(100% - 60px));
      box-sizing:border-box;

      padding:20px 22px 18px;

      background:
        linear-gradient(
          180deg,
          rgba(34,27,34,.98),
          rgba(18,15,23,.99)
        );

      border:2px solid #8c6948;

      box-shadow:
        0 0 0 2px rgba(30,18,16,.8),
        0 8px 28px rgba(0,0,0,.55);

      color:#eee0c7;

      z-index:9000;

      font-family:
        "Noto Sans JP",
        "Microsoft YaHei",
        sans-serif;
    }


    #learn6Panel.learn6-hidden{
      display:none;
    }


    .learn6-header{
      display:flex;
      align-items:center;
      justify-content:space-between;

      margin-bottom:10px;

      color:#d9b978;

      font-size:13px;
      letter-spacing:.12em;
    }


    .learn6-speaker{
      color:#f0cf8a;
      font-weight:700;
      font-size:16px;
    }


    .learn6-cn{
      margin-top:8px;

      color:#fff0cf;

      font-size:22px;
      line-height:1.6;
      font-weight:700;
    }


    .learn6-ja{
      margin-top:3px;

      color:#aaa2a0;

      font-size:13px;
      line-height:1.6;
    }


    .learn6-question{
      margin-top:13px;
      margin-bottom:10px;

      padding-top:11px;

      border-top:
        1px solid rgba(196,155,100,.24);

      color:#d9cbb7;

      font-size:14px;
    }


    .learn6-choice{
      position:relative;

      margin:6px 0;
      padding:9px 12px 9px 34px;

      background:
        rgba(255,255,255,.025);

      border:
        1px solid rgba(180,143,93,.22);

      color:#cfc5b6;

      transition:
        background .12s,
        border-color .12s,
        color .12s;
    }


    .learn6-choice.active{

      background:
        rgba(161,103,52,.20);

      border-color:#b18453;

      color:#fff0d0;
    }


    .learn6-choice.active::before{

      content:"▶";

      position:absolute;
      left:11px;
      top:9px;

      color:#e4b96d;
    }


    .learn6-choice-cn{
      font-size:16px;
      font-weight:700;
    }


    .learn6-choice-ja{
      margin-top:2px;

      color:#8f8986;

      font-size:11px;
    }


    .learn6-choice.active
    .learn6-choice-ja{
      color:#c3b5a4;
    }


    .learn6-footer{
      margin-top:12px;

      color:#766f6b;

      text-align:right;

      font-size:11px;
    }


    .learn6-result-good{
      color:#efc775;
    }


    .learn6-result-hint{
      margin-top:10px;

      padding:9px 11px;

      background:
        rgba(129,90,48,.12);

      border-left:
        3px solid #9b7448;

      color:#cbbba4;

      line-height:1.7;

      font-size:13px;
    }


    /* ===============================================
       RESET
    =============================================== */

    #learn6ResetArea{

      margin-top:12px;
      padding-top:10px;

      border-top:
        1px solid rgba(255,255,255,.08);

      text-align:right;
    }


    #learn6ResetButton{

      padding:7px 12px;

      border:
        1px solid rgba(180,110,91,.48);

      background:
        rgba(106,44,38,.15);

      color:#b9958d;

      cursor:pointer;

      font:inherit;
      font-size:11px;
    }


    #learn6ResetButton:hover{

      background:
        rgba(136,53,43,.27);

      color:#e2b5a9;
    }


    #learn6ResetConfirm{

      position:absolute;

      left:50%;
      top:50%;

      transform:
        translate(-50%,-50%);

      width:min(
        430px,
        calc(100% - 50px)
      );

      box-sizing:border-box;

      padding:24px;

      background:#1b171d;

      border:2px solid #89534b;

      box-shadow:
        0 10px 40px
        rgba(0,0,0,.7);

      color:#e6d7c4;

      z-index:12000;

      text-align:center;
    }


    #learn6ResetConfirm.learn6-hidden{
      display:none;
    }


    .learn6-reset-title{

      margin-bottom:12px;

      color:#e1b5a8;

      font-size:18px;
      font-weight:700;
    }


    .learn6-reset-text{

      color:#a99e98;

      font-size:13px;
      line-height:1.8;
    }


    .learn6-reset-buttons{

      display:flex;

      gap:10px;

      justify-content:center;

      margin-top:20px;
    }


    .learn6-reset-buttons button{

      padding:9px 18px;

      border:1px solid #6f625c;

      background:#29232a;

      color:#d5cbc0;

      cursor:pointer;

      font:inherit;
    }


    .learn6-reset-buttons
    .danger{

      border-color:#99564d;

      background:#5d2926;

      color:#f1d0c7;
    }

  `;


  document.head.appendChild(style);

}


// ============================================================
// CREATE UI
// ============================================================

function learn6CreateUI(){

  const panel=
    document.createElement("div");


  panel.id="learn6Panel";

  panel.className="learn6-hidden";


  panel.innerHTML=`

    <div class="learn6-header">

      <div>
        实用中文 · PRACTICAL CHINESE
      </div>

      <div>
        ↑↓ 選択 / E 決定
      </div>

    </div>

    <div
      id="learn6Content">
    </div>

  `;


  /*
    gameCanvasの親要素に配置すると
    ゲーム画面と重ねやすい。
  */

  const parent=
    canvas.parentElement||
    document.body;


  if(
    getComputedStyle(parent)
    .position==="static"
  ){
    parent.style.position="relative";
  }


  parent.appendChild(panel);


  // RESET CONFIRM

  const reset=
    document.createElement("div");


  reset.id=
    "learn6ResetConfirm";

  reset.className=
    "learn6-hidden";


  reset.innerHTML=`

    <div class="learn6-reset-title">
      学習進行をリセット
    </div>

    <div class="learn6-reset-text">

      集めた100語の進行状況と称号を
      最初の状態へ戻します。<br>

      一度リセットすると、
      元には戻せません。<br><br>

      マップやゲームそのものは
      削除されません。

    </div>

    <div class="learn6-reset-buttons">

      <button
        id="learn6ResetCancel">
        キャンセル
      </button>

      <button
        id="learn6ResetExecute"
        class="danger">
        リセットする
      </button>

    </div>

  `;


  parent.appendChild(reset);


  document
    .getElementById(
      "learn6ResetCancel"
    )
    .addEventListener(
      "click",
      learn6CloseReset
    );


  document
    .getElementById(
      "learn6ResetExecute"
    )
    .addEventListener(
      "click",
      learn6ExecuteReset
    );

}


// ============================================================
// EVENTS
// ============================================================

/*
  rewardWord は
  「中国語そのもの」で指定します。

  既存VOCABULARYの100語に
  その単語が存在する場合のみ、
  既存の obtainWord() を使用して取得。

  したがって100語を勝手に101語へ
  増やすことはありません。
*/


const LEARN6_EVENTS=[

  // ----------------------------------------------------------
  // PRICE
  // ----------------------------------------------------------

  {

    id:"price",

    speaker:"屋台のおじさん",

    opening:
      "看看吧！刚做好的！",

    openingJa:
      "見ていって！できたてだよ！",

    question:
      "値段を聞いてみましょう。",

    choices:[

      {
        cn:"这个多少钱？",
        ja:"これはいくらですか？",
        correct:true
      },

      {
        cn:"你叫什么名字？",
        ja:"あなたの名前は何ですか？"
      },

      {
        cn:"你去哪儿？",
        ja:"どこへ行くのですか？"
      }

    ],

    success:
      "十五块。要不要来一份？",

    successJa:
      "15元だよ。一つどう？",

    lesson:
      "「多少钱？」は値段を尋ねる基本表現です。夜市や市場でそのまま使えます。",

    rewardWords:[
      "多少钱"
    ]

  },


  // ----------------------------------------------------------
  // ORDER
  // ----------------------------------------------------------

  {

    id:"order",

    speaker:"小吃摊老板",

    opening:
      "想吃什么？",

    openingJa:
      "何を食べたい？",

    question:
      "「一つください」と注文してみましょう。",

    choices:[

      {
        cn:"我要一份。",
        ja:"一つください。",
        correct:true
      },

      {
        cn:"我没有工作。",
        ja:"私は仕事がありません。"
      },

      {
        cn:"今天星期几？",
        ja:"今日は何曜日ですか？"
      }

    ],

    success:
      "好嘞！稍等一下！",

    successJa:
      "はいよ！ちょっと待ってね！",

    lesson:
      "「一份」は料理などを一人前・一つ分注文するときによく使います。",

    rewardWords:[
      "一份"
    ]

  },


  // ----------------------------------------------------------
  // SPICY
  // ----------------------------------------------------------

  {

    id:"spicy",

    speaker:"焼き串の店員",

    opening:
      "要辣吗？",

    openingJa:
      "辛くする？",

    question:
      "辛さを控えめにしてほしいと伝えてみましょう。",

    choices:[

      {
        cn:"可以少辣一点吗？",
        ja:"少し辛さ控えめにできますか？",
        correct:true
      },

      {
        cn:"这里有地铁吗？",
        ja:"ここに地下鉄はありますか？"
      },

      {
        cn:"我喜欢下雨。",
        ja:"私は雨が好きです。"
      }

    ],

    success:
      "可以，给你少放一点辣椒。",

    successJa:
      "いいよ。唐辛子を少なめにするね。",

    lesson:
      "「少～一点」は「～を少し少なめに」という便利な形です。",

    rewardWords:[
      "辣"
    ]

  },


  // ----------------------------------------------------------
  // RECOMMEND
  // ----------------------------------------------------------

  {

    id:"recommend",

    speaker:"夜市のお姉さん",

    opening:
      "第一次来武林夜市吗？",

    openingJa:
      "武林夜市は初めて？",

    question:
      "おすすめを聞いてみましょう。",

    choices:[

      {
        cn:"有什么推荐的吗？",
        ja:"何かおすすめはありますか？",
        correct:true
      },

      {
        cn:"你家有几个人？",
        ja:"家族は何人ですか？"
      },

      {
        cn:"明天几点上班？",
        ja:"明日は何時に出勤しますか？"
      }

    ],

    success:
      "可以试试葱包桧，很有杭州特色。",

    successJa:
      "葱包桧を食べてみて。杭州らしい食べ物だよ。",

    lesson:
      "「有什么推荐的吗？」は店やレストランでおすすめを尋ねる自然な表現です。",

    rewardWords:[
      "推荐"
    ]

  },


  // ----------------------------------------------------------
  // PACK
  // ----------------------------------------------------------

  {

    id:"takeaway",

    speaker:"小吃店の店員",

    opening:
      "在这里吃吗？",

    openingJa:
      "ここで食べますか？",

    question:
      "持ち帰りたいと伝えてみましょう。",

    choices:[

      {
        cn:"我要打包。",
        ja:"持ち帰りにします。",
        correct:true
      },

      {
        cn:"我要睡觉。",
        ja:"寝たいです。"
      },

      {
        cn:"我要去西湖。",
        ja:"西湖へ行きたいです。"
      }

    ],

    success:
      "好的，我帮你打包。",

    successJa:
      "わかりました。包みますね。",

    lesson:
      "「打包」は飲食店で「持ち帰り用に包む」という意味でよく使われます。",

    rewardWords:[
      "打包"
    ]

  }

];


// ============================================================
// FIND EXISTING VOCABULARY
// ============================================================

function learn6FindVocabId(word){

  for(
    const [id,data]
    of Object.entries(
      VOCABULARY
    )
  ){

    if(
      data.word===word
    ){
      return id;
    }

  }


  return null;

}


// ============================================================
// NEARBY STALL
// ============================================================

function learn6NearbyStall(){

  const map=
    getCurrentMap();


  if(
    !map.stalls ||
    !map.stalls.length
  ){
    return null;
  }


  const px=
    player.x+
    player.width/2;


  const py=
    player.y+
    player.height/2;


  let nearest=null;

  let best=70;


  for(
    let i=0;
    i<map.stalls.length;
    i++
  ){

    const stall=
      map.stalls[i];


    const sx=
      (
        stall.x+
        stall.width/2
      )*
      TILE;


    /*
      屋台正面側
    */

    const sy=
      stall.y*TILE+
      58;


    const distance=
      Math.hypot(
        sx-px,
        sy-py
      );


    if(distance<best){

      best=distance;

      nearest={
        stall,
        index:i
      };

    }

  }


  return nearest;

}


// ============================================================
// EVENT SELECTION
// ============================================================

function learn6EventForStall(data){

  if(!data){
    return null;
  }


  /*
    同じ屋台でも毎回完全ランダムにはせず、
    マップ＋屋台番号で基本イベントを決定。
  */

  let mapSeed=0;


  for(
    let i=0;
    i<currentMapId.length;
    i++
  ){

    mapSeed+=
      currentMapId.charCodeAt(i);

  }


  const index=
    (
      data.index+
      mapSeed
    )%
    LEARN6_EVENTS.length;


  return LEARN6_EVENTS[index];

}


// ============================================================
// START EVENT
// ============================================================

function learn6Start(event){

  if(!event){
    return;
  }


  clearMovementKeys();


  LEARN6.active=true;

  LEARN6.phase="choice";

  LEARN6.event=event;

  LEARN6.selected=0;

  LEARN6.resultCorrect=false;

  LEARN6.rewardQueue=[];


  learn6Render();


  document
    .getElementById(
      "learn6Panel"
    )
    .classList
    .remove(
      "learn6-hidden"
    );

}


// ============================================================
// CLOSE EVENT
// ============================================================

function learn6Close(){

  LEARN6.active=false;

  LEARN6.phase="";

  LEARN6.event=null;


  document
    .getElementById(
      "learn6Panel"
    )
    .classList
    .add(
      "learn6-hidden"
    );

}


// ============================================================
// RENDER
// ============================================================

function learn6Render(){

  const content=
    document.getElementById(
      "learn6Content"
    );


  const event=
    LEARN6.event;


  if(!event){
    return;
  }


  // CHOICE

  if(
    LEARN6.phase==="choice"
  ){

    let choices="";


    event.choices.forEach(
      (choice,index)=>{

        choices+=`

          <div
            class="
              learn6-choice
              ${
                index===
                LEARN6.selected
                ? "active"
                : ""
              }
            "
          >

            <div
              class="learn6-choice-cn">
              ${index+1}. ${choice.cn}
            </div>

            <div
              class="learn6-choice-ja">
              ${choice.ja}
            </div>

          </div>

        `;

      }
    );


    content.innerHTML=`

      <div class="learn6-speaker">
        ${event.speaker}
      </div>

      <div class="learn6-cn">
        「${event.opening}」
      </div>

      <div class="learn6-ja">
        ${event.openingJa}
      </div>

      <div class="learn6-question">
        ${event.question}
      </div>

      ${choices}

      <div class="learn6-footer">
        W/S・↑↓で選択　E / Enterで決定
      </div>

    `;


    return;

  }


  // RESULT

  const choice=
    event.choices[
      LEARN6.selected
    ];


  if(
    LEARN6.resultCorrect
  ){

    content.innerHTML=`

      <div class="learn6-speaker">
        ${event.speaker}
      </div>

      <div class="learn6-cn">
        「${event.success}」
      </div>

      <div class="learn6-ja">
        ${event.successJa}
      </div>

      <div
        class="
          learn6-result-hint
          learn6-result-good
        "
      >

        通じました。<br>

        あなた：
        「${choice.cn}」

      </div>

      <div class="learn6-result-hint">
        ${event.lesson}
      </div>

      <div class="learn6-footer">
        E / Enterで続ける
      </div>

    `;

  }

  else{

    const correct=
      event.choices.find(
        item=>item.correct
      );


    content.innerHTML=`

      <div class="learn6-speaker">
        ${event.speaker}
      </div>

      <div class="learn6-cn">
        「嗯？你是不是想说……」
      </div>

      <div class="learn6-ja">
        「ん？もしかして、こう言いたかった？」
      </div>

      <div class="learn6-result-hint">

        あなた：
        「${choice.cn}」<br><br>

        この場面なら――<br>

        <strong>
          ${correct.cn}
        </strong><br>

        ${correct.ja}

      </div>

      <div class="learn6-result-hint">
        ${event.lesson}
      </div>

      <div class="learn6-footer">
        E / Enterで続ける
      </div>

    `;

  }

}


// ============================================================
// CHOOSE
// ============================================================

function learn6ConfirmChoice(){

  const event=
    LEARN6.event;


  if(!event){
    return;
  }


  const choice=
    event.choices[
      LEARN6.selected
    ];


  LEARN6.resultCorrect=
    !!choice.correct;


  LEARN6.phase=
    "result";


  learn6Render();

}


// ============================================================
// FINISH EVENT
// ============================================================

function learn6Finish(){

  const event=
    LEARN6.event;


  const correct=
    LEARN6.resultCorrect;


  learn6Close();


  /*
    正解した場合のみ、
    既存100語に存在する単語を
    1語取得する。

    100語外の語彙を追加しない。
  */

  if(
    correct &&
    event.rewardWords
  ){

    for(
      const word
      of event.rewardWords
    ){

      const id=
        learn6FindVocabId(
          word
        );


      if(
        id &&
        !hasVocabulary(id)
      ){

        obtainWord(id);

        return;

      }

    }

  }

}


// ============================================================
// INPUT
// ============================================================

window.addEventListener(

  "keydown",

  event=>{

    if(!LEARN6.active){
      return;
    }


    event.preventDefault();

    event.stopImmediatePropagation();


    if(event.repeat){
      return;
    }


    const key=
      event.key.toLowerCase();


    if(
      LEARN6.phase==="choice"
    ){

      if(
        key==="arrowup" ||
        key==="w"
      ){

        LEARN6.selected--;


        if(
          LEARN6.selected<0
        ){

          LEARN6.selected=
            LEARN6.event
            .choices.length-1;

        }


        learn6Render();

        return;

      }


      if(
        key==="arrowdown" ||
        key==="s"
      ){

        LEARN6.selected++;


        if(
          LEARN6.selected>=
          LEARN6.event
          .choices.length
        ){

          LEARN6.selected=0;

        }


        learn6Render();

        return;

      }


      if(
        key==="e" ||
        key==="enter"
      ){

        learn6ConfirmChoice();

        return;

      }


      if(
        key==="escape"
      ){

        learn6Close();

      }


      return;

    }


    if(
      LEARN6.phase==="result"
    ){

      if(
        key==="e" ||
        key==="enter"
      ){

        learn6Finish();

        return;

      }

    }

  },

  true

);


// ============================================================
// INTERACTION HOOK
// ============================================================

const LEARN6_originalInteract=
  interact;


interact=
function(){

  /*
    既存NPCが最優先。
  */

  const npc=
    getNearbyNPC();


  if(npc){

    LEARN6_originalInteract();

    return;

  }


  /*
    調べられるオブジェクトも
    既存システムを優先。
  */

  const object=
    getNearbyInteractable();


  if(object){

    LEARN6_originalInteract();

    return;

  }


  /*
    建物入口も優先。
  */

  const building=
    getNearbyBuilding();


  if(building){

    LEARN6_originalInteract();

    return;

  }


  /*
    何もない場合に屋台を判定。
  */

  const stall=
    learn6NearbyStall();


  if(stall){

    const event=
      learn6EventForStall(
        stall
      );


    learn6Start(event);

    return;

  }


  LEARN6_originalInteract();

};


// ============================================================
// INTERACTION HINT HOOK
// ============================================================

const LEARN6_originalHint=
  updateInteractionHint;


updateInteractionHint=
function(){

  LEARN6_originalHint();


  if(
    LEARN6.active ||
    dialogue.active ||
    libraryOpen ||
    wordGetActive ||
    completionActive ||
    transitionLock
  ){
    return;
  }


  /*
    既存インタラクションがある場合は
    そちらを優先。
  */

  if(
    getNearbyNPC() ||
    getNearbyInteractable() ||
    getNearbyBuilding()
  ){
    return;
  }


  const stall=
    learn6NearbyStall();


  if(stall){

    interactionText.textContent=
      "中国語で注文する";


    interactionHint
      .classList
      .remove("hidden");

  }

};


// ============================================================
// RESET BUTTON
// ============================================================

function learn6InstallResetButton(){

  if(
    document.getElementById(
      "learn6ResetArea"
    )
  ){
    return;
  }


  const area=
    document.createElement("div");


  area.id=
    "learn6ResetArea";


  area.innerHTML=`

    <button
      id="learn6ResetButton"
      type="button">

      学習進行をリセット

    </button>

  `;


  /*
    図鑑パネルの中へ追加。
  */

  libraryPanel.appendChild(area);


  document
    .getElementById(
      "learn6ResetButton"
    )
    .addEventListener(
      "click",
      learn6OpenReset
    );

}


// ============================================================
// RESET OPEN
// ============================================================

function learn6OpenReset(){

  LEARN6.resetConfirm=true;


  clearMovementKeys();


  document
    .getElementById(
      "learn6ResetConfirm"
    )
    .classList
    .remove(
      "learn6-hidden"
    );

}


// ============================================================
// RESET CLOSE
// ============================================================

function learn6CloseReset(){

  LEARN6.resetConfirm=false;


  document
    .getElementById(
      "learn6ResetConfirm"
    )
    .classList
    .add(
      "learn6-hidden"
    );

}


// ============================================================
// RESET STORAGE
// ============================================================

function learn6ResetVocabularyStorage(){

  /*
    vocabulary.js の保存キー名を
    決め打ちしない。

    localStorageの中から、

    「配列であり、
      その中身がVOCABULARYのIDである」

    データだけを探して空配列へ戻す。

    他サイトデータや設定値は削除しない。
  */


  const validIds=
    new Set(
      Object.keys(
        VOCABULARY
      )
    );


  for(
    let i=0;
    i<localStorage.length;
    i++
  ){

    const key=
      localStorage.key(i);


    if(!key){
      continue;
    }


    let value;


    try{

      value=
        JSON.parse(
          localStorage.getItem(key)
        );

    }

    catch(error){

      continue;

    }


    if(
      !Array.isArray(value)
    ){
      continue;
    }


    /*
      空配列は判定材料にならない。
    */

    if(
      value.length===0
    ){
      continue;
    }


    const looksLikeVocabulary=
      value.every(
        id=>
          typeof id==="string" &&
          validIds.has(id)
      );


    if(
      looksLikeVocabulary
    ){

      localStorage.setItem(
        key,
        JSON.stringify([])
      );

    }

  }

}


// ============================================================
// EXECUTE RESET
// ============================================================

function learn6ExecuteReset(){

  /*
    現在メモリ上にある収集語を消す。
    const配列でもspliceなら問題ない。
  */

  collectedVocabulary.splice(
    0,
    collectedVocabulary.length
  );


  /*
    保存データも初期化。
  */

  learn6ResetVocabularyStorage();


  /*
    100/100達成状態。
  */

  gameCompleted=false;

  pendingCompletion=false;

  pendingRank=null;


  /*
    game.js側の既存保存関数を利用。
  */

  if(
    typeof saveCompletionState===
    "function"
  ){

    saveCompletionState();

  }


  /*
    称号比較用状態も更新。
  */

  previousRank=
    getRank(0);


  /*
    UI更新。
  */

  updateCollectionUI();


  libraryCategoryIndex=0;

  librarySelection=0;


  renderLibrary();


  learn6CloseReset();


  /*
    リセット完了表示。
  */

  learn6ShowResetMessage();

}


// ============================================================
// RESET MESSAGE
// ============================================================

function learn6ShowResetMessage(){

  const panel=
    document.getElementById(
      "learn6Panel"
    );


  const content=
    document.getElementById(
      "learn6Content"
    );


  LEARN6.active=true;

  LEARN6.phase="resetDone";


  content.innerHTML=`

    <div class="learn6-speaker">
      学習記録
    </div>

    <div class="learn6-cn">
      新しい旅を始めましょう。
    </div>

    <div class="learn6-ja">

      単語の収集状況を
      0 / ${getVocabularyCount()}
      に戻しました。

    </div>

    <div class="learn6-result-hint">

      NPCとの会話や街の探索、
      屋台での中国語会話から、
      もう一度言葉を集められます。

    </div>

    <div class="learn6-footer">
      E / Enterで閉じる
    </div>

  `;


  panel.classList.remove(
    "learn6-hidden"
  );

}


// ============================================================
// RESET DONE INPUT
// ============================================================

window.addEventListener(

  "keydown",

  event=>{

    if(
      !LEARN6.active ||
      LEARN6.phase!==
      "resetDone"
    ){
      return;
    }


    const key=
      event.key.toLowerCase();


    if(
      key==="e" ||
      key==="enter" ||
      key==="escape"
    ){

      event.preventDefault();

      event.stopImmediatePropagation();

      learn6Close();

    }

  },

  true

);


// ============================================================
// RESET CONFIRM INPUT
// ============================================================

window.addEventListener(

  "keydown",

  event=>{

    if(
      !LEARN6.resetConfirm
    ){
      return;
    }


    event.preventDefault();

    event.stopImmediatePropagation();


    const key=
      event.key.toLowerCase();


    if(
      key==="escape" ||
      key==="l"
    ){

      learn6CloseReset();

    }

  },

  true

);


// ============================================================
// PREVENT PLAYER MOVEMENT DURING LEARNING
// ============================================================

const LEARN6_originalUpdatePlayer=
  updatePlayer;


updatePlayer=
function(dt){

  if(
    LEARN6.active ||
    LEARN6.resetConfirm
  ){

    player.moving=false;

    clearMovementKeys();

    return;

  }


  LEARN6_originalUpdatePlayer(dt);

};


// ============================================================
// INITIALIZE
// ============================================================

learn6InstallStyle();

learn6CreateUI();

learn6InstallResetButton();


console.log(
  "杭州探索録 Ver.6 Chinese Learning System loaded"
);
