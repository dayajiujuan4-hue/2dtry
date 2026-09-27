"use strict";

/*
============================================================
 杭州探索録 Ver.7
 HANGZHOU DIALECT COLLECTION

 杭州话采集系统

 ・普通話100語とは別コレクション
 ・杭州話 0 / 20
 ・第1弾は5語
 ・街を歩いて方言を発見
 ・杭州話手帳
 ・発見場所を記録
 ・理解度システム
 ・方言発見演出
 ・既存ゲームシステムは変更しない
============================================================
*/


// ============================================================
// DATA
// ============================================================

const HZ_DIALECT={

  xiaoyar:{
    word:"小伢儿",
    mandarin:"小孩子",
    meaning:"子ども",
    note:
      "杭州の伝統的な日常語。子どもを指す表現。",
    location:"武林夜市",
    speaker:"夜市の王阿姨"
  },

  chenguang:{
    word:"辰光",
    mandarin:"时候 / 时间",
    meaning:"時・時間",
    note:
      "杭州話を含む呉語地域で見られる時間を表す語。",
    location:"老杭州茶馆",
    speaker:"茶館のおじいさん"
  },

  luoyu:{
    word:"落雨",
    mandarin:"下雨",
    meaning:"雨が降る",
    note:
      "「雨が降る」を表す杭州話。杭州話の代表的な語彙の一つ。",
    location:"西湖・湖滨",
    speaker:"西湖のおじいさん"
  },

  xiaode:{
    word:"晓得",
    mandarin:"知道",
    meaning:"知っている・分かる",
    note:
      "「知っている」「分かっている」という意味で使われる。",
    location:"武林夜市・雑貨街",
    speaker:"雑貨店のおばちゃん"
  },

  yanxiehui:{
    word:"晏歇会",
    mandarin:"等会儿见",
    meaning:"あとで会おう",
    note:
      "別れ際などに使われる杭州話の表現。",
    location:"武林・ホテル街",
    speaker:"杭州のおじさん"
  }

};


// ============================================================
// TOTAL
// ============================================================

const HZ_DIALECT_TOTAL=20;


// ============================================================
// STORAGE
// ============================================================

const HZ_DIALECT_STORAGE=
  "hangzhouDialectCollection";


let collectedDialect=[];


function hzLoadDialect(){

  try{

    const saved=
      JSON.parse(
        localStorage.getItem(
          HZ_DIALECT_STORAGE
        )
      );


    if(Array.isArray(saved)){

      collectedDialect=
        saved.filter(
          id=>HZ_DIALECT[id]
        );

    }

  }

  catch(error){

    collectedDialect=[];

  }

}


function hzSaveDialect(){

  localStorage.setItem(

    HZ_DIALECT_STORAGE,

    JSON.stringify(
      collectedDialect
    )

  );

}


// ============================================================
// STATE
// ============================================================

const HZ_STATE={

  panelOpen:false,

  discoveryOpen:false,

  selected:0,

  nearby:null,

  messageCooldown:0

};


// ============================================================
// CHECK
// ============================================================

function hzHasDialect(id){

  return collectedDialect
    .includes(id);

}


// ============================================================
// COLLECTION
// ============================================================

function hzCollectDialect(id){

  if(!HZ_DIALECT[id]){
    return false;
  }


  if(
    hzHasDialect(id)
  ){
    return false;
  }


  collectedDialect.push(id);

  hzSaveDialect();

  hzShowDiscovery(id);

  hzUpdateHeader();

  return true;

}


// ============================================================
// CSS
// ============================================================

function hzInstallStyle(){

  const style=
    document.createElement(
      "style"
    );


  style.textContent=`

    /* ===============================================
       HEADER
    =============================================== */

    #hzDialectHeader{

      margin-left:14px;

      color:#bda276;

      font-size:12px;

      letter-spacing:.08em;

      white-space:nowrap;

    }


    /* ===============================================
       DISCOVERY
    =============================================== */

    #hzDiscovery{

      position:absolute;

      left:50%;
      top:50%;

      transform:
        translate(-50%,-50%);

      width:min(
        520px,
        calc(100% - 60px)
      );

      box-sizing:border-box;

      padding:28px;

      background:
        linear-gradient(
          180deg,
          #211a22,
          #151218
        );

      border:
        2px solid #b38a51;

      box-shadow:
        0 0 0 3px #2b1c19,
        0 14px 45px rgba(0,0,0,.72);

      z-index:15000;

      color:#eadcc3;

      text-align:center;

    }


    #hzDiscovery.hz-hidden{
      display:none;
    }


    .hz-discovery-small{

      color:#a17f52;

      font-size:12px;

      letter-spacing:.2em;

    }


    .hz-discovery-title{

      margin-top:8px;

      color:#e5bd72;

      font-size:16px;

      letter-spacing:.1em;

    }


    .hz-discovery-word{

      margin-top:16px;

      color:#fff0ca;

      font-size:38px;

      font-weight:700;

    }


    .hz-discovery-meaning{

      margin-top:7px;

      color:#d2c4ae;

      font-size:16px;

    }


    .hz-discovery-compare{

      margin-top:18px;

      padding:12px;

      background:
        rgba(160,112,62,.09);

      border:
        1px solid rgba(194,147,82,.25);

      color:#a99e8e;

      font-size:13px;

      line-height:1.8;

    }


    .hz-discovery-footer{

      margin-top:20px;

      color:#716a65;

      font-size:11px;

    }


    /* ===============================================
       DIALECT BOOK
    =============================================== */

    #hzDialectBook{

      position:absolute;

      left:50%;
      top:50%;

      transform:
        translate(-50%,-50%);

      width:min(
        850px,
        calc(100% - 50px)
      );

      height:min(
        570px,
        calc(100% - 50px)
      );

      box-sizing:border-box;

      padding:22px;

      background:
        linear-gradient(
          135deg,
          #1c171d,
          #121016
        );

      border:
        2px solid #796146;

      box-shadow:
        0 12px 45px rgba(0,0,0,.75);

      z-index:14000;

      color:#e5d8c4;

      overflow:hidden;

    }


    #hzDialectBook.hz-hidden{
      display:none;
    }


    .hz-book-header{

      display:flex;

      align-items:center;

      justify-content:space-between;

      padding-bottom:13px;

      border-bottom:
        1px solid rgba(190,148,88,.22);

    }


    .hz-book-title{

      color:#e1bc78;

      font-size:21px;

      font-weight:700;

    }


    .hz-book-progress{

      color:#9d8c76;

      font-size:13px;

    }


    .hz-book-body{

      display:grid;

      grid-template-columns:
        260px 1fr;

      gap:20px;

      height:
        calc(100% - 70px);

      padding-top:16px;

    }


    #hzDialectList{

      overflow-y:auto;

      padding-right:7px;

    }


    .hz-book-entry{

      margin-bottom:6px;

      padding:9px 11px;

      border:
        1px solid rgba(255,255,255,.06);

      color:#837b74;

    }


    .hz-book-entry.active{

      border-color:#9f7950;

      background:
        rgba(151,102,52,.15);

      color:#f0d9b0;

    }


    .hz-book-entry.locked{

      color:#555058;

    }


    .hz-entry-word{

      font-size:16px;

      font-weight:700;

    }


    .hz-entry-sub{

      margin-top:2px;

      font-size:10px;

      color:#756e69;

    }


    #hzDialectDetail{

      padding:8px 12px;

      overflow-y:auto;

    }


    .hz-detail-number{

      color:#806d56;

      font-size:11px;

      letter-spacing:.15em;

    }


    .hz-detail-word{

      margin-top:9px;

      color:#f3d9a6;

      font-size:34px;

      font-weight:700;

    }


    .hz-detail-meaning{

      margin-top:4px;

      color:#c5b8a5;

      font-size:16px;

    }


    .hz-detail-section{

      margin-top:20px;

      padding-top:12px;

      border-top:
        1px solid rgba(255,255,255,.07);

    }


    .hz-detail-label{

      margin-bottom:5px;

      color:#8b7559;

      font-size:10px;

      letter-spacing:.14em;

    }


    .hz-detail-text{

      color:#bdb0a0;

      font-size:13px;

      line-height:1.8;

    }


    .hz-understanding{

      margin-top:16px;

      padding:12px;

      background:
        rgba(138,93,49,.11);

      border-left:
        3px solid #9c7448;

      color:#c5b397;

      font-size:12px;

    }


    .hz-book-footer{

      position:absolute;

      right:22px;

      bottom:13px;

      color:#68615f;

      font-size:10px;

    }

  `;


  document.head.appendChild(
    style
  );

}


// ============================================================
// UI CREATION
// ============================================================

function hzCreateUI(){

  const parent=
    canvas.parentElement||
    document.body;


  if(
    getComputedStyle(parent)
      .position==="static"
  ){

    parent.style.position=
      "relative";

  }


  // ----------------------------------------------------------
  // HEADER
  // ----------------------------------------------------------

  const header=
    document.createElement(
      "span"
    );


  header.id=
    "hzDialectHeader";


  /*
    collectionHeaderの近くに追加
  */

  if(
    collectionHeader &&
    collectionHeader.parentElement
  ){

    collectionHeader
      .parentElement
      .appendChild(header);

  }


  // ----------------------------------------------------------
  // DISCOVERY
  // ----------------------------------------------------------

  const discovery=
    document.createElement(
      "div"
    );


  discovery.id=
    "hzDiscovery";

  discovery.className=
    "hz-hidden";


  parent.appendChild(
    discovery
  );


  // ----------------------------------------------------------
  // BOOK
  // ----------------------------------------------------------

  const book=
    document.createElement(
      "div"
    );


  book.id=
    "hzDialectBook";

  book.className=
    "hz-hidden";


  book.innerHTML=`

    <div class="hz-book-header">

      <div class="hz-book-title">
        杭州话手帐
      </div>

      <div
        id="hzBookProgress"
        class="hz-book-progress">
      </div>

    </div>


    <div class="hz-book-body">

      <div
        id="hzDialectList">
      </div>

      <div
        id="hzDialectDetail">
      </div>

    </div>


    <div class="hz-book-footer">
      ↑↓ 選択　H / Esc 閉じる
    </div>

  `;


  parent.appendChild(book);

}


// ============================================================
// HEADER
// ============================================================

function hzUpdateHeader(){

  const header=
    document.getElementById(
      "hzDialectHeader"
    );


  if(!header){
    return;
  }


  header.textContent=
    `杭州话 ${collectedDialect.length} / ${HZ_DIALECT_TOTAL}`;

}


// ============================================================
// DISCOVERY
// ============================================================

function hzShowDiscovery(id){

  const data=
    HZ_DIALECT[id];


  if(!data){
    return;
  }


  clearMovementKeys();


  HZ_STATE.discoveryOpen=true;


  const panel=
    document.getElementById(
      "hzDiscovery"
    );


  panel.innerHTML=`

    <div class="hz-discovery-small">
      LOCAL LANGUAGE DISCOVERED
    </div>

    <div class="hz-discovery-title">
      杭州话发现！
    </div>

    <div class="hz-discovery-word">
      ${data.word}
    </div>

    <div class="hz-discovery-meaning">
      ${data.meaning}
    </div>

    <div class="hz-discovery-compare">

      杭州话：
      ${data.word}

      <br>

      普通话：
      ${data.mandarin}

      <br>

      日本語：
      ${data.meaning}

    </div>

    <div class="hz-discovery-footer">
      Hで杭州話手帳を確認できます　E / Enterで閉じる
    </div>

  `;


  panel.classList.remove(
    "hz-hidden"
  );

}


// ============================================================
// CLOSE DISCOVERY
// ============================================================

function hzCloseDiscovery(){

  HZ_STATE.discoveryOpen=false;


  document
    .getElementById(
      "hzDiscovery"
    )
    .classList
    .add(
      "hz-hidden"
    );

}


// ============================================================
// OPEN BOOK
// ============================================================

function hzOpenBook(){

  if(
    dialogue.active ||
    wordGetActive ||
    completionActive ||
    libraryOpen ||
    transitionLock ||
    (
      typeof LEARN6!=="undefined" &&
      LEARN6.active
    )
  ){
    return;
  }


  clearMovementKeys();


  HZ_STATE.panelOpen=true;

  HZ_STATE.selected=0;


  hzRenderBook();


  document
    .getElementById(
      "hzDialectBook"
    )
    .classList
    .remove(
      "hz-hidden"
    );

}


// ============================================================
// CLOSE BOOK
// ============================================================

function hzCloseBook(){

  HZ_STATE.panelOpen=false;


  document
    .getElementById(
      "hzDialectBook"
    )
    .classList
    .add(
      "hz-hidden"
    );

}


// ============================================================
// BOOK ENTRIES
// ============================================================

function hzGetBookEntries(){

  /*
    将来20語に増やしたときも
    自動で対応する。

    現在は5語のみ実装。
  */

  return Object.entries(
    HZ_DIALECT
  );

}


// ============================================================
// RENDER BOOK
// ============================================================

function hzRenderBook(){

  const entries=
    hzGetBookEntries();


  if(
    HZ_STATE.selected>=
    entries.length
  ){

    HZ_STATE.selected=
      Math.max(
        0,
        entries.length-1
      );

  }


  const list=
    document.getElementById(
      "hzDialectList"
    );


  const progress=
    document.getElementById(
      "hzBookProgress"
    );


  list.innerHTML="";


  progress.textContent=
    `${collectedDialect.length} / ${HZ_DIALECT_TOTAL}`;


  entries.forEach(
    ([id,data],index)=>{

      const obtained=
        hzHasDialect(id);


      const item=
        document.createElement(
          "div"
        );


      item.className=
        "hz-book-entry";


      if(
        index===
        HZ_STATE.selected
      ){

        item.classList.add(
          "active"
        );

      }


      if(!obtained){

        item.classList.add(
          "locked"
        );

      }


      item.innerHTML=`

        <div class="hz-entry-word">

          ${
            obtained
            ? data.word
            : "？？？"
          }

        </div>

        <div class="hz-entry-sub">

          ${
            obtained
            ? data.meaning
            : "まだ聞いたことがない"
          }

        </div>

      `;


      list.appendChild(
        item
      );

    }
  );


  if(entries.length){

    const selected=
      entries[
        HZ_STATE.selected
      ];


    hzRenderDetail(
      selected[0],
      selected[1],
      HZ_STATE.selected
    );

  }

}


// ============================================================
// DETAIL
// ============================================================

function hzRenderDetail(
  id,
  data,
  index
){

  const detail=
    document.getElementById(
      "hzDialectDetail"
    );


  if(
    !hzHasDialect(id)
  ){

    detail.innerHTML=`

      <div class="hz-detail-number">
        HANGZHOU DIALECT
        ${String(index+1).padStart(2,"0")}
      </div>

      <div class="hz-detail-word">
        ？？？
      </div>

      <div class="hz-detail-meaning">
        未発見
      </div>

      <div class="hz-understanding">

        杭州の街を歩いて、
        地元の人たちの話を
        聞いてみましょう。

        <br><br>

        普通話とは少し違う言葉が
        聞こえてくるかもしれません。

      </div>

    `;


    return;

  }


  detail.innerHTML=`

    <div class="hz-detail-number">

      HANGZHOU DIALECT
      ${String(index+1).padStart(2,"0")}

    </div>


    <div class="hz-detail-word">
      ${data.word}
    </div>


    <div class="hz-detail-meaning">
      ${data.meaning}
    </div>


    <div class="hz-detail-section">

      <div class="hz-detail-label">
        普通话
      </div>

      <div class="hz-detail-text">
        ${data.mandarin}
      </div>

    </div>


    <div class="hz-detail-section">

      <div class="hz-detail-label">
        杭州文化メモ
      </div>

      <div class="hz-detail-text">
        ${data.note}
      </div>

    </div>


    <div class="hz-detail-section">

      <div class="hz-detail-label">
        発見場所
      </div>

      <div class="hz-detail-text">
        ${data.location}
      </div>

    </div>


    <div class="hz-detail-section">

      <div class="hz-detail-label">
        教えてくれた人
      </div>

      <div class="hz-detail-text">
        ${data.speaker}
      </div>

    </div>


    <div class="hz-understanding">

      杭州话理解度

      <br>

      ${collectedDialect.length}
      /
      ${HZ_DIALECT_TOTAL}

    </div>

  `;

}


// ============================================================
// INPUT
// ============================================================

window.addEventListener(

  "keydown",

  event=>{

    const key=
      event.key.toLowerCase();


    // --------------------------------------------------------
    // DISCOVERY
    // --------------------------------------------------------

    if(
      HZ_STATE.discoveryOpen
    ){

      event.preventDefault();

      event.stopImmediatePropagation();


      if(
        key==="e" ||
        key==="enter" ||
        key==="escape"
      ){

        hzCloseDiscovery();

      }


      return;

    }


    // --------------------------------------------------------
    // BOOK
    // --------------------------------------------------------

    if(
      HZ_STATE.panelOpen
    ){

      event.preventDefault();

      event.stopImmediatePropagation();


      if(
        key==="h" ||
        key==="escape"
      ){

        hzCloseBook();

        return;

      }


      const entries=
        hzGetBookEntries();


      if(
        key==="arrowup" ||
        key==="w"
      ){

        HZ_STATE.selected--;


        if(
          HZ_STATE.selected<0
        ){

          HZ_STATE.selected=
            entries.length-1;

        }


        hzRenderBook();

        return;

      }


      if(
        key==="arrowdown" ||
        key==="s"
      ){

        HZ_STATE.selected++;


        if(
          HZ_STATE.selected>=
          entries.length
        ){

          HZ_STATE.selected=0;

        }


        hzRenderBook();

        return;

      }


      return;

    }


    // --------------------------------------------------------
    // OPEN BOOK
    // --------------------------------------------------------

    if(key==="h"){

      event.preventDefault();

      event.stopImmediatePropagation();

      hzOpenBook();

    }

  },

  true

);


// ============================================================
// PREVENT MOVEMENT
// ============================================================

const HZ_originalUpdatePlayer=
  updatePlayer;


updatePlayer=
function(dt){

  if(
    HZ_STATE.panelOpen ||
    HZ_STATE.discoveryOpen
  ){

    player.moving=false;

    clearMovementKeys();

    return;

  }


  HZ_originalUpdatePlayer(dt);

};


// ============================================================
// DIALECT EVENT LOCATIONS
// ============================================================

/*
  マップ上に見えない方言イベントポイントを置く。

  近づくと
  「聞き慣れない言葉が聞こえる」
  というヒントが表示される。

  Eで発見。
*/


const HZ_DIALECT_POINTS={

  food:[

    {
      id:"xiaoyar",
      x:26,
      y:18,
      radius:58
    }

  ],


  tea:[

    {
      id:"chenguang",
      x:14,
      y:11,
      radius:65
    }

  ],


  lake:[

    {
      id:"luoyu",
      x:25,
      y:18,
      radius:65
    }

  ],


  market:[

    {
      id:"xiaode",
      x:26,
      y:20,
      radius:60
    }

  ],


  hotel:[

    {
      id:"yanxiehui",
      x:26,
      y:20,
      radius:60
    }

  ]

};


// ============================================================
// NEARBY DIALECT
// ============================================================

function hzGetNearbyDialect(){

  const points=
    HZ_DIALECT_POINTS[
      currentMapId
    ];


  if(!points){
    return null;
  }


  const px=
    player.x+
    player.width/2;


  const py=
    player.y+
    player.height/2;


  let nearest=null;

  let best=Infinity;


  for(
    const point
    of points
  ){

    /*
      すでに発見済みなら
      発見イベントは出さない。
    */

    if(
      hzHasDialect(
        point.id
      )
    ){
      continue;
    }


    const wx=
      (
        point.x+.5
      )*
      TILE;


    const wy=
      (
        point.y+.5
      )*
      TILE;


    const distance=
      Math.hypot(
        wx-px,
        wy-py
      );


    if(
      distance<
      point.radius &&
      distance<best
    ){

      best=distance;

      nearest=point;

    }

  }


  return nearest;

}


// ============================================================
// INTERACTION HOOK
// ============================================================

const HZ_originalInteract=
  interact;


interact=
function(){

  /*
    既存NPC・物・建物を優先する。

    learning.jsで屋台会話も
    interactに追加されているため、
    方言イベントはその前に
    「方言ポイントが近いか」を確認。
  */


  const dialect=
    hzGetNearbyDialect();


  /*
    NPCなど既存対象が
    すぐ近くにある場合は
    そちらを優先。
  */

  const npc=
    getNearbyNPC();

  const object=
    getNearbyInteractable();

  const building=
    getNearbyBuilding();


  if(
    !npc &&
    !object &&
    !building &&
    dialect
  ){

    hzCollectDialect(
      dialect.id
    );

    return;

  }


  HZ_originalInteract();

};


// ============================================================
// INTERACTION HINT HOOK
// ============================================================

const HZ_originalHint=
  updateInteractionHint;


updateInteractionHint=
function(){

  HZ_originalHint();


  if(
    HZ_STATE.panelOpen ||
    HZ_STATE.discoveryOpen ||
    dialogue.active ||
    libraryOpen ||
    wordGetActive ||
    completionActive ||
    transitionLock
  ){
    return;
  }


  /*
    NPCなどがある場合は
    既存ヒントを優先。
  */

  if(
    getNearbyNPC() ||
    getNearbyInteractable() ||
    getNearbyBuilding()
  ){
    return;
  }


  const dialect=
    hzGetNearbyDialect();


  if(dialect){

    interactionText.textContent=
      "聞き慣れない言葉が聞こえる";


    interactionHint
      .classList
      .remove(
        "hidden"
      );

  }

};


// ============================================================
// OPTIONAL RESET
// ============================================================

/*
  普通話100語のリセットとは
  分離しておく。

  今後、
  「すべての学習記録をリセット」
  を追加する場合に使用可能。
*/

function hzResetDialect(){

  collectedDialect.splice(
    0,
    collectedDialect.length
  );


  hzSaveDialect();

  hzUpdateHeader();


  if(
    HZ_STATE.panelOpen
  ){

    hzRenderBook();

  }

}


// ============================================================
// INITIALIZE
// ============================================================

hzLoadDialect();

hzInstallStyle();

hzCreateUI();

hzUpdateHeader();


console.log(
  "杭州探索録 Ver.7 Hangzhou Dialect System loaded"
);
