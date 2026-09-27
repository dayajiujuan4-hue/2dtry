"use strict";

/*
============================================================
 杭州探索録 Ver.7.2
 杭州话采集系统 - 20 WORD COMPLETE EDITION

 ・杭州話20語
 ・普通話100語とは完全に別管理
 ・Hキー：杭州話手帳
 ・5カテゴリ
 ・マップ探索による発見
 ・発見場所記録
 ・レア度
 ・理解度
 ・19語収集後に最後の1語を解放
 ・20/20コンプリート演出
 ・称号「杭州话小达人」
============================================================
*/


// ============================================================
// CONFIG
// ============================================================

const HZ_DIALECT_TOTAL = 20;

const HZ_DIALECT_STORAGE =
  "hangzhouDialectCollection";

const HZ_DIALECT_COMPLETE_STORAGE =
  "hangzhouDialectCompleted";


// ============================================================
// DIALECT DATA
// ============================================================

const HZ_DIALECT = {

  xiaoyar: {
    no: 1,
    word: "小伢儿",
    mandarin: "小孩子",
    meaning: "子ども",
    category: "日常",
    rarity: 1,
    location: "武林夜市・小吃街",
    speaker: "夜市の親子",
    note:
      "杭州話で子どもを表す言葉。街中の家族の会話から聞こえてくることがある。"
  },

  chenguang: {
    no: 2,
    word: "辰光",
    mandarin: "时候 / 时间",
    meaning: "時・時間",
    category: "時間",
    rarity: 1,
    location: "老杭州茶馆",
    speaker: "茶館のおじいさん",
    note:
      "時や時間を表す言葉。杭州話を含む呉語地域で見られる語彙。"
  },

  luoyu: {
    no: 3,
    word: "落雨",
    mandarin: "下雨",
    meaning: "雨が降る",
    category: "自然",
    rarity: 1,
    location: "西湖・湖滨",
    speaker: "湖畔のおじいさん",
    note:
      "雨が降ることを表す杭州話。西湖の景色にもよく似合う言葉。"
  },

  xiaode: {
    no: 4,
    word: "晓得",
    mandarin: "知道",
    meaning: "知っている・分かる",
    category: "日常",
    rarity: 1,
    location: "武林夜市・雑貨街",
    speaker: "雑貨店のおばちゃん",
    note:
      "「知っている」「分かっている」という意味で使われる。"
  },

  yanxiehui: {
    no: 5,
    word: "晏歇会",
    mandarin: "等会儿见",
    meaning: "あとで会おう",
    category: "会話",
    rarity: 2,
    location: "武林・ホテル街",
    speaker: "杭州のおじさん",
    note:
      "別れ際などに使われる杭州話の表現。"
  },

  gemao: {
    no: 6,
    word: "葛毛",
    mandarin: "现在",
    meaning: "今・現在",
    category: "時間",
    rarity: 1,
    location: "武林夜市・中央広場",
    speaker: "夜市の常連客",
    note:
      "「現在」「今」を表す杭州話。"
  },

  toumao: {
    no: 7,
    word: "头毛",
    mandarin: "刚才",
    meaning: "さっき・たった今",
    category: "時間",
    rarity: 2,
    location: "武林夜市・小吃街",
    speaker: "屋台のおじさん",
    note:
      "少し前の出来事を指して「さっき」と言うときに使われる。"
  },

  yelitou: {
    no: 8,
    word: "夜里头",
    mandarin: "夜晚",
    meaning: "夜・夜間",
    category: "時間",
    rarity: 1,
    location: "武林夜市",
    speaker: "夜市の客",
    note:
      "夜や夜間を表す杭州話。夜市そのものと相性のよい言葉。"
  },

  luoxue: {
    no: 9,
    word: "落雪",
    mandarin: "下雪",
    meaning: "雪が降る",
    category: "自然",
    rarity: 2,
    location: "西湖・湖滨",
    speaker: "湖畔の老人",
    note:
      "雪が降ることを表す。『落雨』と並べて覚えると面白い。"
  },

  nongtang: {
    no: 10,
    word: "弄堂",
    mandarin: "胡同 / 小巷",
    meaning: "路地・小路",
    category: "街",
    rarity: 2,
    location: "武林夜市・雑貨街",
    speaker: "老杭州の住民",
    note:
      "住宅や店の間を通る細い路地を表す言葉。江南の街歩きを感じさせる語彙。"
  },

  chicha: {
    no: 11,
    word: "吃茶",
    mandarin: "喝茶",
    meaning: "お茶を飲む",
    category: "食文化",
    rarity: 2,
    location: "老杭州茶馆",
    speaker: "茶館の主人",
    note:
      "普通話では『喝茶』と言うところを、杭州話では『吃茶』と表す。"
  },

  kunjiao: {
    no: 12,
    word: "睏觉",
    mandarin: "睡觉",
    meaning: "寝る・眠る",
    category: "日常",
    rarity: 2,
    location: "武林・ホテル街",
    speaker: "ホテルの宿泊客",
    note:
      "寝る、眠るという意味。宿泊街で聞くと意味を想像しやすい。"
  },

  xieli: {
    no: 13,
    word: "歇力",
    mandarin: "休息",
    meaning: "休む・休憩する",
    category: "日常",
    rarity: 2,
    location: "西湖・湖滨",
    speaker: "ベンチのおじいさん",
    note:
      "疲れたときに休憩することを表す杭州話。"
  },

  zuosha: {
    no: 14,
    word: "做啥",
    mandarin: "做什么",
    meaning: "何をする？",
    category: "会話",
    rarity: 2,
    location: "武林夜市・中央広場",
    speaker: "夜市の若者",
    note:
      "『何をする？』という日常的な問いかけ。"
  },

  shadifang: {
    no: 15,
    word: "啥地方",
    mandarin: "什么地方",
    meaning: "どこ・どの場所",
    category: "会話",
    rarity: 2,
    location: "西湖・湖滨",
    speaker: "観光客",
    note:
      "場所を尋ねるときに使われる表現。"
  },

  yixixi: {
    no: 16,
    word: "一息息",
    mandarin: "一会儿",
    meaning: "少しの間・しばらく",
    category: "時間",
    rarity: 3,
    location: "湖滨茶室",
    speaker: "茶室の老人",
    note:
      "短い時間を表す杭州話。響きも特徴的な表現。"
  },

  mulaolao: {
    no: 17,
    word: "木佬佬",
    mandarin: "很 / 非常",
    meaning: "とても・非常に",
    category: "老杭州",
    rarity: 3,
    location: "武林夜市・小吃街",
    speaker: "老杭州のおばちゃん",
    note:
      "程度が大きいことを表す杭州らしい表現。"
  },

  faye: {
    no: 18,
    word: "发靥",
    mandarin: "可笑 / 好笑",
    meaning: "おかしい・笑える",
    category: "老杭州",
    rarity: 3,
    location: "武林夜市・雑貨街",
    speaker: "杭州の若者",
    note:
      "面白い、笑えるといった意味で使われる杭州話。"
  },

  wentunshui: {
    no: 19,
    word: "温吞水",
    mandarin: "温水",
    meaning: "ぬるい水・ぬるま湯",
    category: "食文化",
    rarity: 3,
    location: "杭州面馆",
    speaker: "麺館の店員",
    note:
      "温かすぎず冷たすぎない水を表す語。杭州方言辞典資料では比喩的な用法も紹介されている。"
  },

  shahetaor: {
    no: 20,
    word: "沙核桃儿",
    mandarin: "山核桃",
    meaning: "山胡桃",
    category: "杭州名物",
    rarity: 4,
    location: "西湖礼物",
    speaker: "土産物店の主人",
    note:
      "山核桃を指す杭州話。19語を集めた人だけが出会える最後の杭州話。"
  }

};


// ============================================================
// COLLECTION STATE
// ============================================================

let collectedDialect = [];
let hzDialectCompleted = false;

const HZ_STATE = {
  panelOpen: false,
  discoveryOpen: false,
  completionOpen: false,
  selected: 0,
  filter: "全部"
};


// ============================================================
// CATEGORY
// ============================================================

const HZ_CATEGORIES = [
  "全部",
  "日常",
  "時間",
  "会話",
  "自然",
  "街",
  "食文化",
  "老杭州",
  "杭州名物"
];


// ============================================================
// STORAGE
// ============================================================

function hzLoadDialect(){

  try{

    const saved =
      JSON.parse(
        localStorage.getItem(
          HZ_DIALECT_STORAGE
        )
      );

    if(Array.isArray(saved)){

      collectedDialect =
        saved.filter(
          id => HZ_DIALECT[id]
        );

    }

  }catch(error){

    collectedDialect = [];

  }


  hzDialectCompleted =
    localStorage.getItem(
      HZ_DIALECT_COMPLETE_STORAGE
    ) === "true";

}


function hzSaveDialect(){

  localStorage.setItem(
    HZ_DIALECT_STORAGE,
    JSON.stringify(
      collectedDialect
    )
  );

  localStorage.setItem(
    HZ_DIALECT_COMPLETE_STORAGE,
    String(
      hzDialectCompleted
    )
  );

}


// ============================================================
// UTILITIES
// ============================================================

function hzHasDialect(id){

  return collectedDialect.includes(id);

}


function hzGetSortedEntries(){

  return Object.entries(HZ_DIALECT)
    .sort(
      (a,b) =>
        a[1].no - b[1].no
    );

}


function hzGetVisibleEntries(){

  const entries =
    hzGetSortedEntries();

  if(
    HZ_STATE.filter === "全部"
  ){
    return entries;
  }

  return entries.filter(
    ([id,data]) =>
      data.category === HZ_STATE.filter
  );

}


function hzStars(rarity){

  let text = "";

  for(let i=0;i<4;i++){

    text +=
      i < rarity
      ? "★"
      : "☆";

  }

  return text;

}


// ============================================================
// COLLECTION
// ============================================================

function hzCollectDialect(id){

  if(!HZ_DIALECT[id]){
    return false;
  }

  if(hzHasDialect(id)){
    return false;
  }


  /*
    No.20 は19語収集後のみ
  */

  if(
    id === "shahetaor" &&
    collectedDialect.length < 19
  ){
    return false;
  }


  collectedDialect.push(id);

  hzSaveDialect();

  hzUpdateHeader();

  hzShowDiscovery(id);

  return true;

}


// ============================================================
// CSS
// ============================================================

function hzInstallStyle(){

  if(
    document.getElementById(
      "hzDialectStyle"
    )
  ){
    return;
  }


  const style =
    document.createElement("style");

  style.id =
    "hzDialectStyle";


  style.textContent = `

    #hzDialectHeader{
      margin-left:14px;
      color:#c3a574;
      font-size:12px;
      letter-spacing:.08em;
      white-space:nowrap;
    }


    .hz-hidden{
      display:none !important;
    }


    /* =============================================
       DISCOVERY
    ============================================= */

    #hzDiscovery{

      position:absolute;

      left:50%;
      top:50%;

      transform:
        translate(-50%,-50%);

      width:min(
        520px,
        calc(100% - 50px)
      );

      box-sizing:border-box;

      padding:28px;

      background:
        linear-gradient(
          180deg,
          #251c24,
          #151117
        );

      border:
        2px solid #bc8d4f;

      box-shadow:
        0 0 0 3px #34221c,
        0 18px 55px rgba(0,0,0,.78);

      z-index:15000;

      color:#eadbc2;

      text-align:center;

    }


    .hz-discovery-small{

      color:#9e8059;

      font-size:10px;

      letter-spacing:.25em;

    }


    .hz-discovery-title{

      margin-top:7px;

      color:#e4b96d;

      font-size:17px;

      font-weight:700;

    }


    .hz-discovery-category{

      display:inline-block;

      margin-top:13px;

      padding:
        3px 9px;

      border:
        1px solid #705438;

      color:#a98d68;

      font-size:10px;

    }


    .hz-discovery-word{

      margin-top:10px;

      color:#fff0c9;

      font-size:40px;

      font-weight:700;

      letter-spacing:.05em;

    }


    .hz-discovery-meaning{

      margin-top:5px;

      color:#d1c0a8;

      font-size:16px;

    }


    .hz-discovery-compare{

      margin-top:18px;

      padding:13px;

      background:
        rgba(160,112,62,.10);

      border:
        1px solid rgba(194,147,82,.25);

      color:#aaa093;

      font-size:13px;

      line-height:1.9;

    }


    .hz-discovery-rarity{

      margin-top:11px;

      color:#c49c5f;

      letter-spacing:.12em;

      font-size:12px;

    }


    .hz-discovery-footer{

      margin-top:19px;

      color:#746b66;

      font-size:10px;

    }


    /* =============================================
       BOOK
    ============================================= */

    #hzDialectBook{

      position:absolute;

      left:50%;
      top:50%;

      transform:
        translate(-50%,-50%);

      width:min(
        900px,
        calc(100% - 40px)
      );

      height:min(
        600px,
        calc(100% - 40px)
      );

      box-sizing:border-box;

      padding:20px;

      background:
        linear-gradient(
          135deg,
          #1e181e,
          #111015
        );

      border:
        2px solid #7e6446;

      box-shadow:
        0 16px 60px rgba(0,0,0,.82);

      z-index:14000;

      color:#e5d7c2;

      overflow:hidden;

    }


    .hz-book-header{

      display:flex;

      align-items:center;

      justify-content:space-between;

      padding-bottom:11px;

      border-bottom:
        1px solid rgba(190,148,88,.23);

    }


    .hz-book-title{

      color:#e2bb75;

      font-size:21px;

      font-weight:700;

      letter-spacing:.06em;

    }


    .hz-book-subtitle{

      margin-left:10px;

      color:#74695d;

      font-size:10px;

      font-weight:400;

    }


    .hz-book-progress{

      color:#b49b79;

      font-size:13px;

    }


    /* CATEGORY */

    #hzCategoryBar{

      display:flex;

      gap:5px;

      margin-top:10px;

      padding-bottom:9px;

      overflow-x:auto;

      border-bottom:
        1px solid rgba(255,255,255,.05);

    }


    .hz-category{

      padding:
        4px 8px;

      border:
        1px solid #40352f;

      color:#77706b;

      font-size:9px;

      white-space:nowrap;

    }


    .hz-category.active{

      border-color:#98724a;

      background:
        rgba(151,102,52,.16);

      color:#d8bb8e;

    }


    .hz-book-body{

      display:grid;

      grid-template-columns:
        310px 1fr;

      gap:18px;

      height:
        calc(100% - 110px);

      padding-top:12px;

    }


    #hzDialectList{

      display:grid;

      grid-template-columns:
        1fr 1fr;

      gap:6px;

      align-content:start;

      overflow-y:auto;

      padding-right:7px;

    }


    .hz-book-entry{

      min-height:47px;

      box-sizing:border-box;

      padding:7px 8px;

      border:
        1px solid rgba(255,255,255,.06);

      background:
        rgba(255,255,255,.012);

      color:#8b8177;

    }


    .hz-book-entry.active{

      border-color:#a47a4b;

      background:
        rgba(156,105,55,.18);

      color:#f0d7ad;

    }


    .hz-book-entry.locked{

      color:#4f4b50;
    }


    .hz-entry-top{

      display:flex;

      align-items:center;

      justify-content:space-between;

    }


    .hz-entry-number{

      color:#665e58;

      font-size:8px;

    }


    .hz-entry-category{

      color:#78684f;

      font-size:8px;

    }


    .hz-entry-word{

      margin-top:3px;

      font-size:14px;

      font-weight:700;

    }


    .hz-entry-sub{

      margin-top:2px;

      color:#716a64;

      font-size:9px;

    }


    /* DETAIL */

    #hzDialectDetail{

      padding:
        6px 12px;

      overflow-y:auto;

    }


    .hz-detail-number{

      color:#806d55;

      font-size:10px;

      letter-spacing:.18em;

    }


    .hz-detail-category{

      display:inline-block;

      margin-top:8px;

      padding:
        3px 8px;

      border:
        1px solid #59452f;

      color:#a18460;

      font-size:9px;

    }


    .hz-detail-word{

      margin-top:8px;

      color:#f2d69f;

      font-size:36px;

      font-weight:700;

    }


    .hz-detail-meaning{

      margin-top:3px;

      color:#c5b6a2;

      font-size:15px;

    }


    .hz-detail-stars{

      margin-top:7px;

      color:#b99158;

      font-size:11px;

      letter-spacing:.1em;

    }


    .hz-detail-section{

      margin-top:16px;

      padding-top:10px;

      border-top:
        1px solid rgba(255,255,255,.065);

    }


    .hz-detail-label{

      margin-bottom:4px;

      color:#887357;

      font-size:9px;

      letter-spacing:.14em;

    }


    .hz-detail-text{

      color:#bdb0a0;

      font-size:12px;

      line-height:1.75;

    }


    .hz-understanding{

      margin-top:15px;

      padding:11px;

      background:
        rgba(138,93,49,.11);

      border-left:
        3px solid #9c7448;

      color:#c5b397;

      font-size:11px;

      line-height:1.7;

    }


    .hz-book-footer{

      position:absolute;

      right:20px;

      bottom:10px;

      color:#625c5b;

      font-size:9px;

    }


    /* =============================================
       COMPLETION
    ============================================= */

    #hzCompletion{

      position:absolute;

      left:50%;
      top:50%;

      transform:
        translate(-50%,-50%);

      width:min(
        580px,
        calc(100% - 50px)
      );

      box-sizing:border-box;

      padding:
        36px 30px;

      background:
        radial-gradient(
          circle at center,
          #39271d,
          #171117 70%
        );

      border:
        2px solid #d0a05d;

      box-shadow:
        0 0 0 4px #3a241a,
        0 20px 70px rgba(0,0,0,.85);

      z-index:16000;

      text-align:center;

      color:#f1dfbf;

    }


    .hz-complete-small{

      color:#aa8555;

      font-size:10px;

      letter-spacing:.3em;

    }


    .hz-complete-title{

      margin-top:10px;

      color:#ffd98d;

      font-size:28px;

      font-weight:700;

    }


    .hz-complete-number{

      margin-top:15px;

      color:#fff0ca;

      font-size:43px;

      font-weight:700;

    }


    .hz-complete-text{

      margin-top:13px;

      color:#bcae9c;

      font-size:13px;

      line-height:1.9;

    }


    .hz-complete-badge{

      margin:
        21px auto 0;

      width:230px;

      padding:
        12px 10px;

      border:
        1px solid #a77d48;

      background:
        rgba(182,127,61,.10);

    }


    .hz-complete-badge-label{

      color:#846d52;

      font-size:9px;

      letter-spacing:.18em;

    }


    .hz-complete-badge-name{

      margin-top:5px;

      color:#edc57d;

      font-size:19px;

      font-weight:700;

    }


    .hz-complete-footer{

      margin-top:22px;

      color:#706864;

      font-size:9px;

    }

  `;


  document.head.appendChild(style);

}


// ============================================================
// CREATE UI
// ============================================================

function hzCreateUI(){

  const parent =
    canvas.parentElement ||
    document.body;


  if(
    getComputedStyle(parent)
      .position === "static"
  ){

    parent.style.position =
      "relative";

  }


  // HEADER
  let header =
    document.getElementById(
      "hzDialectHeader"
    );


  if(!header){

    header =
      document.createElement(
        "span"
      );

    header.id =
      "hzDialectHeader";


    if(
      typeof collectionHeader !==
        "undefined" &&
      collectionHeader &&
      collectionHeader.parentElement
    ){

      collectionHeader
        .parentElement
        .appendChild(header);

    }

  }


  // DISCOVERY
  if(
    !document.getElementById(
      "hzDiscovery"
    )
  ){

    const discovery =
      document.createElement("div");

    discovery.id =
      "hzDiscovery";

    discovery.className =
      "hz-hidden";

    parent.appendChild(
      discovery
    );

  }


  // BOOK
  if(
    !document.getElementById(
      "hzDialectBook"
    )
  ){

    const book =
      document.createElement("div");

    book.id =
      "hzDialectBook";

    book.className =
      "hz-hidden";

    book.innerHTML = `

      <div class="hz-book-header">

        <div>

          <span class="hz-book-title">
            杭州话手帐
          </span>

          <span class="hz-book-subtitle">
            HANGZHOU DIALECT COLLECTION
          </span>

        </div>

        <div
          id="hzBookProgress"
          class="hz-book-progress">
        </div>

      </div>


      <div id="hzCategoryBar">
      </div>


      <div class="hz-book-body">

        <div id="hzDialectList">
        </div>

        <div id="hzDialectDetail">
        </div>

      </div>


      <div class="hz-book-footer">
        ↑↓ 選択　←→ カテゴリ　H / Esc 閉じる
      </div>

    `;

    parent.appendChild(book);

  }


  // COMPLETION
  if(
    !document.getElementById(
      "hzCompletion"
    )
  ){

    const completion =
      document.createElement("div");

    completion.id =
      "hzCompletion";

    completion.className =
      "hz-hidden";

    parent.appendChild(
      completion
    );

  }

}


// ============================================================
// HEADER
// ============================================================

function hzUpdateHeader(){

  const header =
    document.getElementById(
      "hzDialectHeader"
    );

  if(!header){
    return;
  }

  header.textContent =
    `杭州话 ${collectedDialect.length} / ${HZ_DIALECT_TOTAL}`;

}


// ============================================================
// DISCOVERY
// ============================================================

function hzShowDiscovery(id){

  const data =
    HZ_DIALECT[id];

  if(!data){
    return;
  }


  if(
    typeof clearMovementKeys ===
    "function"
  ){
    clearMovementKeys();
  }


  HZ_STATE.discoveryOpen =
    true;


  const panel =
    document.getElementById(
      "hzDiscovery"
    );


  panel.innerHTML = `

    <div class="hz-discovery-small">
      LOCAL LANGUAGE DISCOVERED
    </div>

    <div class="hz-discovery-title">
      杭州话发现！
    </div>

    <div class="hz-discovery-category">
      ${data.category}
    </div>

    <div class="hz-discovery-word">
      ${data.word}
    </div>

    <div class="hz-discovery-meaning">
      ${data.meaning}
    </div>

    <div class="hz-discovery-compare">

      杭州话：${data.word}

      <br>

      普通话：${data.mandarin}

      <br>

      日本語：${data.meaning}

    </div>

    <div class="hz-discovery-rarity">
      ${hzStars(data.rarity)}
    </div>

    <div class="hz-discovery-footer">
      ${collectedDialect.length} / ${HZ_DIALECT_TOTAL}
      　E / Enter で閉じる
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

  HZ_STATE.discoveryOpen =
    false;


  const panel =
    document.getElementById(
      "hzDiscovery"
    );


  panel.classList.add(
    "hz-hidden"
  );


  /*
    20語目を閉じた瞬間に
    コンプリート演出
  */

  if(
    collectedDialect.length >=
      HZ_DIALECT_TOTAL &&
    !hzDialectCompleted
  ){

    hzShowCompletion();

  }

}


// ============================================================
// COMPLETION
// ============================================================

function hzShowCompletion(){

  hzDialectCompleted =
    true;

  hzSaveDialect();


  HZ_STATE.completionOpen =
    true;


  if(
    typeof clearMovementKeys ===
    "function"
  ){
    clearMovementKeys();
  }


  const panel =
    document.getElementById(
      "hzCompletion"
    );


  panel.innerHTML = `

    <div class="hz-complete-small">
      HANGZHOU DIALECT COMPLETE
    </div>

    <div class="hz-complete-title">
      杭州话收集完成！
    </div>

    <div class="hz-complete-number">
      20 / 20
    </div>

    <div class="hz-complete-text">

      杭州の街を歩き、
      人々の言葉に耳を傾け、

      <br>

      20の杭州話を
      集めました。

    </div>

    <div class="hz-complete-badge">

      <div class="hz-complete-badge-label">
        NEW TITLE
      </div>

      <div class="hz-complete-badge-name">
        杭州话小达人
      </div>

    </div>

    <div class="hz-complete-footer">
      E / Enter で閉じる
    </div>

  `;


  panel.classList.remove(
    "hz-hidden"
  );

}


// ============================================================
// CLOSE COMPLETION
// ============================================================

function hzCloseCompletion(){

  HZ_STATE.completionOpen =
    false;


  document
    .getElementById(
      "hzCompletion"
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
    HZ_STATE.discoveryOpen ||
    HZ_STATE.completionOpen
  ){
    return;
  }


  if(
    typeof dialogue !==
      "undefined" &&
    dialogue.active
  ){
    return;
  }


  if(
    typeof wordGetActive !==
      "undefined" &&
    wordGetActive
  ){
    return;
  }


  if(
    typeof completionActive !==
      "undefined" &&
    completionActive
  ){
    return;
  }


  if(
    typeof libraryOpen !==
      "undefined" &&
    libraryOpen
  ){
    return;
  }


  if(
    typeof transitionLock !==
      "undefined" &&
    transitionLock
  ){
    return;
  }


  if(
    typeof LEARN6 !==
      "undefined" &&
    LEARN6.active
  ){
    return;
  }


  if(
    typeof clearMovementKeys ===
    "function"
  ){
    clearMovementKeys();
  }


  HZ_STATE.panelOpen =
    true;

  HZ_STATE.selected =
    0;


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

  HZ_STATE.panelOpen =
    false;


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
// CATEGORY BAR
// ============================================================

function hzRenderCategories(){

  const bar =
    document.getElementById(
      "hzCategoryBar"
    );


  bar.innerHTML = "";


  HZ_CATEGORIES.forEach(
    category => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "hz-category";


      if(
        category ===
        HZ_STATE.filter
      ){

        item.classList.add(
          "active"
        );

      }


      item.textContent =
        category;


      bar.appendChild(item);

    }
  );

}


// ============================================================
// BOOK
// ============================================================

function hzRenderBook(){

  hzRenderCategories();


  const entries =
    hzGetVisibleEntries();


  if(
    HZ_STATE.selected >=
    entries.length
  ){

    HZ_STATE.selected =
      Math.max(
        0,
        entries.length - 1
      );

  }


  const list =
    document.getElementById(
      "hzDialectList"
    );


  const progress =
    document.getElementById(
      "hzBookProgress"
    );


  list.innerHTML = "";


  progress.textContent =
    `杭州话 ${collectedDialect.length} / ${HZ_DIALECT_TOTAL}`;


  entries.forEach(
    ([id,data],index) => {

      const obtained =
        hzHasDialect(id);


      const item =
        document.createElement(
          "div"
        );


      item.className =
        "hz-book-entry";


      if(
        index ===
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


      item.innerHTML = `

        <div class="hz-entry-top">

          <span class="hz-entry-number">
            ${String(data.no).padStart(2,"0")}
          </span>

          <span class="hz-entry-category">
            ${obtained ? data.category : "？？"}
          </span>

        </div>

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
            : "未発見"
          }

        </div>

      `;


      list.appendChild(item);

    }
  );


  if(entries.length){

    const [id,data] =
      entries[
        HZ_STATE.selected
      ];


    hzRenderDetail(
      id,
      data
    );

  }

}


// ============================================================
// DETAIL
// ============================================================

function hzRenderDetail(
  id,
  data
){

  const detail =
    document.getElementById(
      "hzDialectDetail"
    );


  if(
    !hzHasDialect(id)
  ){

    let hint =
      "杭州の街を歩き、地元の人の言葉に耳を傾けてみましょう。";


    /*
      最後の一語だけ特殊ヒント
    */

    if(
      data.no === 20
    ){

      if(
        collectedDialect.length <
          19
      ){

        hint =
          "この言葉には、まだ出会えないようです。まずは他の杭州話を集めてみましょう。";

      }else{

        hint =
          "西湖の近くにある土産物店を訪ねてみましょう。";

      }

    }


    detail.innerHTML = `

      <div class="hz-detail-number">
        HANGZHOU DIALECT
        ${String(data.no).padStart(2,"0")}
      </div>

      <div class="hz-detail-word">
        ？？？
      </div>

      <div class="hz-detail-meaning">
        未発見
      </div>

      <div class="hz-understanding">
        ${hint}
      </div>

    `;


    return;

  }


  detail.innerHTML = `

    <div class="hz-detail-number">
      HANGZHOU DIALECT
      ${String(data.no).padStart(2,"0")}
    </div>

    <div class="hz-detail-category">
      ${data.category}
    </div>

    <div class="hz-detail-word">
      ${data.word}
    </div>

    <div class="hz-detail-meaning">
      ${data.meaning}
    </div>

    <div class="hz-detail-stars">
      ${hzStars(data.rarity)}
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
// CATEGORY MOVE
// ============================================================

function hzMoveCategory(direction){

  let index =
    HZ_CATEGORIES.indexOf(
      HZ_STATE.filter
    );


  index += direction;


  if(index < 0){

    index =
      HZ_CATEGORIES.length - 1;

  }


  if(
    index >=
    HZ_CATEGORIES.length
  ){

    index = 0;

  }


  HZ_STATE.filter =
    HZ_CATEGORIES[index];


  HZ_STATE.selected =
    0;


  hzRenderBook();

}


// ============================================================
// INPUT
// ============================================================

window.addEventListener(

  "keydown",

  event => {

    const key =
      event.key.toLowerCase();


    // COMPLETION
    if(
      HZ_STATE.completionOpen
    ){

      event.preventDefault();

      event.stopImmediatePropagation();


      if(
        key === "e" ||
        key === "enter" ||
        key === "escape"
      ){

        hzCloseCompletion();

      }

      return;

    }


    // DISCOVERY
    if(
      HZ_STATE.discoveryOpen
    ){

      event.preventDefault();

      event.stopImmediatePropagation();


      if(
        key === "e" ||
        key === "enter" ||
        key === "escape"
      ){

        hzCloseDiscovery();

      }

      return;

    }


    // BOOK
    if(
      HZ_STATE.panelOpen
    ){

      event.preventDefault();

      event.stopImmediatePropagation();


      if(
        key === "h" ||
        key === "escape"
      ){

        hzCloseBook();

        return;

      }


      const entries =
        hzGetVisibleEntries();


      if(
        key === "arrowup" ||
        key === "w"
      ){

        HZ_STATE.selected--;

        if(
          HZ_STATE.selected < 0
        ){

          HZ_STATE.selected =
            entries.length - 1;

        }

        hzRenderBook();

        return;

      }


      if(
        key === "arrowdown" ||
        key === "s"
      ){

        HZ_STATE.selected++;

        if(
          HZ_STATE.selected >=
          entries.length
        ){

          HZ_STATE.selected = 0;

        }

        hzRenderBook();

        return;

      }


      if(
        key === "arrowleft" ||
        key === "a"
      ){

        hzMoveCategory(-1);

        return;

      }


      if(
        key === "arrowright" ||
        key === "d"
      ){

        hzMoveCategory(1);

        return;

      }


      return;

    }


    // OPEN BOOK
    if(key === "h"){

      event.preventDefault();

      event.stopImmediatePropagation();

      hzOpenBook();

    }

  },

  true

);


// ============================================================
// PLAYER FREEZE
// ============================================================

const HZ72_originalUpdatePlayer =
  updatePlayer;


updatePlayer =
function(dt){

  if(
    HZ_STATE.panelOpen ||
    HZ_STATE.discoveryOpen ||
    HZ_STATE.completionOpen
  ){

    player.moving =
      false;


    if(
      typeof clearMovementKeys ===
      "function"
    ){

      clearMovementKeys();

    }

    return;

  }


  HZ72_originalUpdatePlayer(dt);

};


// ============================================================
// DIALECT POINTS
// ============================================================

/*
  既存マップを変更せず、
  見えない方言発見ポイントを配置する。

  x/y はタイル座標。
*/

const HZ_DIALECT_POINTS = {

  // ----------------------------------------------------------
  // 武林夜市・小吃街
  // ----------------------------------------------------------

  food: [

    {
      id:"xiaoyar",
      x:26,
      y:18,
      radius:58
    },

    {
      id:"gemao",
      x:18,
      y:20,
      radius:55
    },

    {
      id:"toumao",
      x:34,
      y:19,
      radius:55
    },

    {
      id:"yelitou",
      x:26,
      y:27,
      radius:55
    },

    {
      id:"zuosha",
      x:16,
      y:12,
      radius:55
    },

    {
      id:"mulaolao",
      x:37,
      y:27,
      radius:55
    }

  ],


  // ----------------------------------------------------------
  // 雑貨街
  // ----------------------------------------------------------

  market: [

    {
      id:"xiaode",
      x:26,
      y:20,
      radius:58
    },

    {
      id:"nongtang",
      x:15,
      y:28,
      radius:55
    },

    {
      id:"faye",
      x:36,
      y:28,
      radius:55
    }

  ],


  // ----------------------------------------------------------
  // ホテル街
  // ----------------------------------------------------------

  hotel: [

    {
      id:"yanxiehui",
      x:26,
      y:20,
      radius:58
    },

    {
      id:"kunjiao",
      x:31,
      y:28,
      radius:55
    }

  ],


  // ----------------------------------------------------------
  // 西湖
  // ----------------------------------------------------------

  lake: [

    {
      id:"luoyu",
      x:25,
      y:18,
      radius:60
    },

    {
      id:"luoxue",
      x:28,
      y:27,
      radius:55
    },

    {
      id:"xieli",
      x:23,
      y:10,
      radius:55
    },

    {
      id:"shadifang",
      x:31,
      y:31,
      radius:55
    }

  ],


  // ----------------------------------------------------------
  // 老杭州茶馆
  // ----------------------------------------------------------

  tea: [

    {
      id:"chenguang",
      x:14,
      y:11,
      radius:60
    },

    {
      id:"chicha",
      x:9,
      y:9,
      radius:55
    }

  ],


  // ----------------------------------------------------------
  // 湖滨茶室
  // ----------------------------------------------------------

  lakeTea: [

    {
      id:"yixixi",
      x:14,
      y:10,
      radius:60
    }

  ],


  // ----------------------------------------------------------
  // 杭州面馆
  // ----------------------------------------------------------

  noodle: [

    {
      id:"wentunshui",
      x:14,
      y:11,
      radius:60
    }

  ],


  // ----------------------------------------------------------
  // 西湖礼物
  // ----------------------------------------------------------

  lakeGift: [

    {
      id:"shahetaor",
      x:14,
      y:10,
      radius:62,
      requires:19
    }

  ]

};


// ============================================================
// NEARBY DIALECT
// ============================================================

function hzGetNearbyDialect(){

  const points =
    HZ_DIALECT_POINTS[
      currentMapId
    ];


  if(!points){
    return null;
  }


  const px =
    player.x +
    player.width / 2;


  const py =
    player.y +
    player.height / 2;


  let nearest = null;
  let best = Infinity;


  for(
    const point
    of points
  ){

    if(
      hzHasDialect(
        point.id
      )
    ){
      continue;
    }


    if(
      point.requires &&
      collectedDialect.length <
        point.requires
    ){
      continue;
    }


    const wx =
      (point.x + .5) *
      TILE;


    const wy =
      (point.y + .5) *
      TILE;


    const distance =
      Math.hypot(
        wx - px,
        wy - py
      );


    if(
      distance <
        point.radius &&
      distance <
        best
    ){

      best =
        distance;

      nearest =
        point;

    }

  }


  return nearest;

}


// ============================================================
// INTERACTION HOOK
// ============================================================

const HZ72_originalInteract =
  interact;


interact =
function(){

  const dialect =
    hzGetNearbyDialect();


  /*
    既存NPC・オブジェクト・建物を優先
  */

  let npc = null;
  let object = null;
  let building = null;


  if(
    typeof getNearbyNPC ===
    "function"
  ){
    npc =
      getNearbyNPC();
  }


  if(
    typeof getNearbyInteractable ===
    "function"
  ){
    object =
      getNearbyInteractable();
  }


  if(
    typeof getNearbyBuilding ===
    "function"
  ){
    building =
      getNearbyBuilding();
  }


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


  HZ72_originalInteract();

};


// ============================================================
// INTERACTION HINT
// ============================================================

const HZ72_originalHint =
  updateInteractionHint;


updateInteractionHint =
function(){

  HZ72_originalHint();


  if(
    HZ_STATE.panelOpen ||
    HZ_STATE.discoveryOpen ||
    HZ_STATE.completionOpen
  ){
    return;
  }


  if(
    typeof dialogue !==
      "undefined" &&
    dialogue.active
  ){
    return;
  }


  if(
    typeof libraryOpen !==
      "undefined" &&
    libraryOpen
  ){
    return;
  }


  if(
    typeof wordGetActive !==
      "undefined" &&
    wordGetActive
  ){
    return;
  }


  if(
    typeof completionActive !==
      "undefined" &&
    completionActive
  ){
    return;
  }


  if(
    typeof transitionLock !==
      "undefined" &&
    transitionLock
  ){
    return;
  }


  if(
    typeof LEARN6 !==
      "undefined" &&
    LEARN6.active
  ){
    return;
  }


  let npc = null;
  let object = null;
  let building = null;


  if(
    typeof getNearbyNPC ===
      "function"
  ){
    npc =
      getNearbyNPC();
  }


  if(
    typeof getNearbyInteractable ===
      "function"
  ){
    object =
      getNearbyInteractable();
  }


  if(
    typeof getNearbyBuilding ===
      "function"
  ){
    building =
      getNearbyBuilding();
  }


  if(
    npc ||
    object ||
    building
  ){
    return;
  }


  const dialect =
    hzGetNearbyDialect();


  if(dialect){

    const data =
      HZ_DIALECT[
        dialect.id
      ];


    if(
      typeof interactionText !==
        "undefined"
    ){

      interactionText.textContent =
        `聞き慣れない言葉が聞こえる…「${data.word}」`;

    }


    if(
      typeof interactionHint !==
        "undefined"
    ){

      interactionHint
        .classList
        .remove(
          "hidden"
        );

    }

  }

};


// ============================================================
// RESET
// ============================================================

function hzResetDialect(){

  collectedDialect.splice(
    0,
    collectedDialect.length
  );


  hzDialectCompleted =
    false;


  hzSaveDialect();

  hzUpdateHeader();


  if(
    HZ_STATE.panelOpen
  ){

    HZ_STATE.selected =
      0;

    HZ_STATE.filter =
      "全部";

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
  "杭州探索録 Ver.7.2 Hangzhou Dialect 20 Words loaded"
);
