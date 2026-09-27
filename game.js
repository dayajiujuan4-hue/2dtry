"use strict";


// ======================================================
// DOM
// ======================================================

const canvas=
  document.getElementById("gameCanvas");

const ctx=
  canvas.getContext("2d");

ctx.imageSmoothingEnabled=false;


const areaHeader=
  document.getElementById("areaHeader");

const rankHeader=
  document.getElementById("rankHeader");

const collectionHeader=
  document.getElementById("collectionHeader");

const clockElement=
  document.getElementById("clock");


const areaBanner=
  document.getElementById("areaBanner");

const areaBannerName=
  document.getElementById("areaBannerName");

const areaBannerSub=
  document.getElementById("areaBannerSub");


const interactionHint=
  document.getElementById("interactionHint");

const interactionText=
  document.getElementById("interactionText");


const dialogueBox=
  document.getElementById("dialogueBox");

const speakerName=
  document.getElementById("speakerName");

const dialogueText=
  document.getElementById("dialogueText");

const portraitFace=
  document.getElementById("portraitFace");


const wordGet=
  document.getElementById("wordGet");

const wordGetChinese=
  document.getElementById("wordGetChinese");

const wordGetPinyin=
  document.getElementById("wordGetPinyin");

const wordGetMeaning=
  document.getElementById("wordGetMeaning");

const wordGetCategory=
  document.getElementById("wordGetCategory");

const wordGetProgress=
  document.getElementById("wordGetProgress");


const rankUpPanel=
  document.getElementById("rankUpPanel");

const newRankName=
  document.getElementById("newRankName");


const completionPanel=
  document.getElementById("completionPanel");


const libraryPanel=
  document.getElementById("libraryPanel");

const libraryTabs=
  document.getElementById("libraryTabs");

const libraryList=
  document.getElementById("libraryList");

const libraryDetail=
  document.getElementById("libraryDetail");

const libraryProgress=
  document.getElementById("libraryProgress");

const libraryRank=
  document.getElementById("libraryRank");


const fadeLayer=
  document.getElementById("fadeLayer");


// ======================================================
// STATE
// ======================================================

let currentMapId="food";

let transitionLock=false;

let exitCooldown=0;

let bannerTimer=0;

let wordGetActive=false;

let rankUpActive=false;

let completionActive=false;

let libraryOpen=false;

let libraryCategoryIndex=0;

let librarySelection=0;

let pendingRank=null;

let pendingCompletion=false;

let previousRank=
  getRank(
    collectedVocabulary.length
  );

let gameCompleted=
  getCompletionState();


// ======================================================
// PLAYER
// ======================================================

const player={

  x:MAPS.food.spawn.x*TILE,
  y:MAPS.food.spawn.y*TILE,

  width:20,
  height:26,

  speed:150,

  direction:"up",

  moving:false

};


const camera={
  x:0,
  y:0
};


// ======================================================
// KEYS
// ======================================================

const keys={};


window.addEventListener(
  "keydown",
  event=>{

    const key=
      event.key.toLowerCase();


    if(
      [
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        " "
      ].includes(key)
    ){
      event.preventDefault();
    }


    if(event.repeat){

      keys[key]=true;

      return;

    }


    // COMPLETION

    if(completionActive){

      if(
        key==="e" ||
        key==="enter"
      ){
        closeCompletion();
      }

      return;

    }


    // RANK UP

    if(rankUpActive){

      if(
        key==="e" ||
        key==="enter"
      ){
        closeRankUp();
      }

      return;

    }


    // WORD GET

    if(wordGetActive){

      if(
        key==="e" ||
        key==="enter"
      ){
        closeWordGet();
      }

      return;

    }


    // LIBRARY

    if(libraryOpen){

      handleLibraryInput(key);

      return;

    }


    if(key==="l"){

      openLibrary();

      return;

    }


    // DIALOGUE

    if(
      key==="e" ||
      key==="enter"
    ){

      if(dialogue.active){
        advanceDialogue();
      }
      else{
        interact();
      }

      return;

    }


    keys[key]=true;

  }
);


window.addEventListener(
  "keyup",
  event=>{

    keys[
      event.key.toLowerCase()
    ]=false;

  }
);


// ======================================================
// DIALOGUE
// ======================================================

const dialogue={
  active:false,
  npc:null,
  index:0
};


function startDialogue(npc){

  dialogue.active=true;

  dialogue.npc=npc;

  dialogue.index=0;


  speakerName.textContent=
    npc.name;


  dialogueText.textContent=
    npc.dialogue[0];


  portraitFace.textContent=
    npc.label||"人";


  portraitFace.style.background=
    npc.color||"#76552f";


  dialogueBox.classList.remove(
    "hidden"
  );

}


function advanceDialogue(){

  dialogue.index++;


  if(
    dialogue.index>=
    dialogue.npc.dialogue.length
  ){

    const npc=
      dialogue.npc;

    closeDialogue();

    giveNPCReward(npc);

    return;

  }


  dialogueText.textContent=
    dialogue.npc.dialogue[
      dialogue.index
    ];

}


function closeDialogue(){

  dialogue.active=false;

  dialogue.npc=null;

  dialogueBox.classList.add(
    "hidden"
  );

}


// ======================================================
// NPC REWARDS
// ======================================================

function giveNPCReward(npc){

  if(!npc.rewards){
    return;
  }


  for(const id of npc.rewards){

    if(!hasVocabulary(id)){

      obtainWord(id);

      return;

    }

  }

}


// ======================================================
// WORD
// ======================================================

function obtainWord(id){

  const vocab=
    VOCABULARY[id];


  if(!vocab){
    return;
  }


  const oldCount=
    collectedVocabulary.length;

  const oldRank=
    getRank(oldCount);


  const isNew=
    collectVocabulary(id);


  if(!isNew){
    return;
  }


  const newCount=
    collectedVocabulary.length;

  const newRank=
    getRank(newCount);


  wordGetChinese.textContent=
    vocab.word;

  wordGetPinyin.textContent=
    vocab.pinyin;

  wordGetMeaning.textContent=
    vocab.meaning;

  wordGetCategory.textContent=
    vocab.category;

  wordGetProgress.textContent=
    `${newCount} / ${getVocabularyCount()}`;


  if(
    newRank!==oldRank &&
    newCount<100
  ){
    pendingRank=newRank;
  }


  if(
    newCount>=100 &&
    !gameCompleted
  ){

    pendingCompletion=true;

    gameCompleted=true;

    saveCompletionState();

  }


  wordGetActive=true;

  wordGet.classList.remove(
    "hidden"
  );


  updateCollectionUI();

}


function closeWordGet(){

  wordGetActive=false;

  wordGet.classList.add(
    "hidden"
  );


  if(pendingCompletion){

    pendingCompletion=false;

    showCompletion();

    return;

  }


  if(pendingRank){

    const rank=
      pendingRank;

    pendingRank=null;

    showRankUp(rank);

  }

}


// ======================================================
// RANK
// ======================================================

function showRankUp(rank){

  rankUpActive=true;

  newRankName.textContent=
    `「${rank}」`;

  rankUpPanel.classList.remove(
    "hidden"
  );

}


function closeRankUp(){

  rankUpActive=false;

  rankUpPanel.classList.add(
    "hidden"
  );

}


// ======================================================
// COMPLETION
// ======================================================

function showCompletion(){

  completionActive=true;

  completionPanel.classList.remove(
    "hidden"
  );

}


function closeCompletion(){

  completionActive=false;

  completionPanel.classList.add(
    "hidden"
  );


  updateCollectionUI();

}


// ======================================================
// LIBRARY
// ======================================================

function openLibrary(){

  if(
    dialogue.active ||
    transitionLock ||
    wordGetActive ||
    completionActive
  ){
    return;
  }


  libraryOpen=true;

  librarySelection=0;

  clearMovementKeys();

  renderLibrary();

  libraryPanel.classList.remove(
    "hidden"
  );

}


function closeLibrary(){

  libraryOpen=false;

  libraryPanel.classList.add(
    "hidden"
  );

}


function clearMovementKeys(){

  [
    "w","a","s","d",
    "arrowup",
    "arrowdown",
    "arrowleft",
    "arrowright"
  ].forEach(
    key=>keys[key]=false
  );

}


function handleLibraryInput(key){

  if(
    key==="l" ||
    key==="escape"
  ){

    closeLibrary();

    return;

  }


  if(
    key==="arrowleft" ||
    key==="a"
  ){

    libraryCategoryIndex--;

    if(libraryCategoryIndex<0){

      libraryCategoryIndex=
        VOCAB_CATEGORIES.length-1;

    }

    librarySelection=0;

    renderLibrary();

    return;

  }


  if(
    key==="arrowright" ||
    key==="d"
  ){

    libraryCategoryIndex++;

    if(
      libraryCategoryIndex>=
      VOCAB_CATEGORIES.length
    ){
      libraryCategoryIndex=0;
    }

    librarySelection=0;

    renderLibrary();

    return;

  }


  const words=
    getLibraryWords();


  if(
    key==="arrowup" ||
    key==="w"
  ){

    librarySelection=
      Math.max(
        0,
        librarySelection-1
      );

    renderLibrary();

  }


  if(
    key==="arrowdown" ||
    key==="s"
  ){

    librarySelection=
      Math.min(
        words.length-1,
        librarySelection+1
      );

    renderLibrary();

  }

}


function getLibraryWords(){

  const category=
    VOCAB_CATEGORIES[
      libraryCategoryIndex
    ];


  return Object.entries(
    VOCABULARY
  ).filter(
    ([id,data])=>
      category==="すべて" ||
      data.category===category
  );

}


function renderLibrary(){

  renderLibraryTabs();


  const words=
    getLibraryWords();


  if(
    librarySelection>=
    words.length
  ){
    librarySelection=
      Math.max(
        0,
        words.length-1
      );
  }


  libraryList.innerHTML="";


  words.forEach(
    ([id,data],index)=>{

      const collected=
        hasVocabulary(id);


      const item=
        document.createElement(
          "div"
        );


      item.className=
        "library-entry";


      if(
        index===librarySelection
      ){
        item.classList.add(
          "active"
        );
      }


      if(!collected){
        item.classList.add(
          "locked"
        );
      }


      item.innerHTML=`

        <div>

          <div class="library-word">
            ${collected ? data.word : "？？？"}
          </div>

          <div class="library-pinyin">
            ${collected ? data.pinyin : "未発見"}
          </div>

        </div>

        <div>
          ${collected ? "◆" : "◇"}
        </div>

      `;


      libraryList.appendChild(
        item
      );

    }
  );


  if(words.length){

    const selected=
      words[librarySelection];

    renderLibraryDetail(
      selected[0],
      selected[1]
    );

  }


  libraryProgress.textContent=
    `${collectedVocabulary.length} / ${getVocabularyCount()} WORDS`;


  libraryRank.textContent=
    `称号：${getRank(collectedVocabulary.length)}`;

}


function renderLibraryTabs(){

  libraryTabs.innerHTML="";


  VOCAB_CATEGORIES.forEach(
    (category,index)=>{

      const tab=
        document.createElement(
          "div"
        );


      tab.className=
        "library-tab";


      if(
        index===
        libraryCategoryIndex
      ){
        tab.classList.add(
          "active"
        );
      }


      const entries=
        Object.entries(
          VOCABULARY
        ).filter(
          ([id,data])=>
            category==="すべて" ||
            data.category===category
        );


      const obtained=
        entries.filter(
          ([id])=>
            hasVocabulary(id)
        ).length;


      tab.textContent=
        `${category} ${obtained}/${entries.length}`;


      libraryTabs.appendChild(
        tab
      );

    }
  );

}


function renderLibraryDetail(id,data){

  if(!hasVocabulary(id)){

    libraryDetail.innerHTML=`

      <div class="empty-library">

        <div style="font-size:42px;margin-bottom:12px;">
          ？
        </div>

        まだ発見していない言葉です。<br><br>

        NPCと話したり、<br>
        街の気になる物を調べてみましょう。

      </div>

    `;

    return;

  }


  libraryDetail.innerHTML=`

    <div class="detail-category">
      ${data.category}
    </div>

    <div class="detail-word">
      ${data.word}
    </div>

    <div class="detail-pinyin">
      ${data.pinyin}
    </div>

    <div class="detail-meaning">
      ${data.meaning}
    </div>

    <div class="detail-section">

      <div class="detail-label">
        EXAMPLE
      </div>

      <div class="detail-example-cn">
        ${data.example}
      </div>

      <div class="detail-example-ja">
        ${data.exampleJa}
      </div>

    </div>

    <div class="detail-section">

      <div class="detail-label">
        DISCOVERED IN
      </div>

      <div class="detail-location">
        ${data.location}
      </div>

    </div>

  `;

}


// ======================================================
// NPC
// ======================================================

for(const npc of NPCS){

  npc.homeX=npc.x;
  npc.homeY=npc.y;

  npc.moveTimer=
    Math.random()*2;

  npc.moveX=0;
  npc.moveY=0;

}


function getCurrentNPCs(){

  return NPCS.filter(
    npc=>npc.map===currentMapId
  );

}


function getNearbyNPC(){

  const px=
    player.x+
    player.width/2;

  const py=
    player.y+
    player.height/2;


  let nearest=null;
  let best=55;


  for(const npc of getCurrentNPCs()){

    const d=
      Math.hypot(
        npc.x+11-px,
        npc.y+14-py
      );

    if(d<best){

      best=d;
      nearest=npc;

    }

  }


  return nearest;

}


function updateNPCs(dt){

  if(
    dialogue.active ||
    transitionLock ||
    libraryOpen ||
    wordGetActive ||
    completionActive
  ){
    return;
  }


  for(const npc of getCurrentNPCs()){

    if(!npc.wander){
      continue;
    }


    npc.moveTimer-=dt;


    if(npc.moveTimer<=0){

      npc.moveTimer=
        1+
        Math.random()*2.5;


      const choice=
        Math.floor(
          Math.random()*5
        );


      npc.moveX=0;
      npc.moveY=0;


      if(choice===0){
        npc.moveX=1;
        npc.direction="right";
      }

      else if(choice===1){
        npc.moveX=-1;
        npc.direction="left";
      }

      else if(choice===2){
        npc.moveY=1;
        npc.direction="down";
      }

      else if(choice===3){
        npc.moveY=-1;
        npc.direction="up";
      }

    }


    const speed=18;


    const nx=
      npc.x+
      npc.moveX*speed*dt;

    const ny=
      npc.y+
      npc.moveY*speed*dt;


    const range=
      npc.range||60;


    if(
      Math.hypot(
        nx-npc.homeX,
        ny-npc.homeY
      )>range
    ){

      npc.moveX=0;
      npc.moveY=0;

      continue;

    }


    if(
      !isSolidAtPixel(
        nx+11,
        ny+14
      )
    ){

      npc.x=nx;
      npc.y=ny;

    }

  }

}


// ======================================================
// INTERACTION SEARCH
// ======================================================

function getNearbyBuilding(){

  const map=
    getCurrentMap();


  if(!map.buildings){
    return null;
  }


  const px=
    player.x+
    player.width/2;

  const py=
    player.y+
    player.height/2;


  let nearest=null;
  let best=58;


  for(const b of map.buildings){

    if(!b.target){
      continue;
    }


    const bx=
      (b.doorX+.5)*TILE;

    const by=
      (b.y+b.h)*TILE;


    const d=
      Math.hypot(
        bx-px,
        by-py
      );


    if(d<best){

      best=d;
      nearest=b;

    }

  }


  return nearest;

}


function getNearbyInteractable(){

  const map=
    getCurrentMap();


  if(!map.interactables){
    return null;
  }


  const px=
    player.x+
    player.width/2;

  const py=
    player.y+
    player.height/2;


  let nearest=null;
  let best=53;


  for(const obj of map.interactables){

    const ox=
      (obj.x+.5)*TILE;

    const oy=
      (obj.y+.5)*TILE;


    const d=
      Math.hypot(
        ox-px,
        oy-py
      );


    if(d<best){

      best=d;
      nearest=obj;

    }

  }


  return nearest;

}


// ======================================================
// INTERACT
// ======================================================

function interact(){

  const npc=
    getNearbyNPC();


  if(npc){

    startDialogue(npc);

    return;

  }


  const object=
    getNearbyInteractable();


  if(object){

    if(
      hasVocabulary(
        object.word
      )
    ){

      const vocab=
        VOCABULARY[
          object.word
        ];


      startDialogue({

        name:object.label,

        label:"物",

        color:"#76552f",

        dialogue:[
          `${vocab.word}（${vocab.pinyin}）`,
          vocab.meaning,
          vocab.example
        ]

      });

    }

    else{

      obtainWord(
        object.word
      );

    }

    return;

  }


  const building=
    getNearbyBuilding();


  if(building){

    changeMap(
      building.target,
      MAPS[
        building.target
      ].spawn.x,
      MAPS[
        building.target
      ].spawn.y
    );

  }

}


// ======================================================
// EXIT
// ======================================================

function getActiveExit(){

  if(exitCooldown>0){
    return null;
  }


  const map=
    getCurrentMap();


  const px=
    player.x+
    player.width/2;

  const py=
    player.y+
    player.height/2;


  for(const exit of map.exits){

    if(
      isInsideRect(
        px,
        py,
        exit
      )
    ){
      return exit;
    }

  }


  return null;

}


function checkExitZones(){

  if(
    transitionLock ||
    dialogue.active ||
    exitCooldown>0 ||
    libraryOpen ||
    wordGetActive ||
    completionActive
  ){
    return;
  }


  const exit=
    getActiveExit();


  if(exit){

    changeMap(
      exit.target,
      exit.targetX,
      exit.targetY
    );

  }

}


// ======================================================
// MAP CHANGE
// ======================================================

function changeMap(
  target,
  targetX,
  targetY
){

  if(transitionLock){
    return;
  }


  transitionLock=true;


  fadeLayer.classList.add(
    "active"
  );


  setTimeout(
    ()=>{

      currentMapId=target;

      player.x=
        targetX*TILE;

      player.y=
        targetY*TILE;

      player.moving=false;

      exitCooldown=.9;

      camera.x=
        player.x-
        canvas.width/2;

      camera.y=
        player.y-
        canvas.height/2;

      clampCamera();

      showAreaBanner();


      setTimeout(
        ()=>{

          fadeLayer.classList.remove(
            "active"
          );


          setTimeout(
            ()=>{
              transitionLock=false;
            },
            320
          );

        },
        140
      );

    },
    320
  );

}


// ======================================================
// COLLISION
// ======================================================

function playerCollides(x,y){

  const left=x+4;
  const right=x+player.width-4;

  const top=y+7;
  const bottom=y+player.height-2;


  if(
    isSolidAtPixel(left,top) ||
    isSolidAtPixel(right,top) ||
    isSolidAtPixel(left,bottom) ||
    isSolidAtPixel(right,bottom)
  ){
    return true;
  }


  for(const npc of getCurrentNPCs()){

    if(
      right>npc.x+4 &&
      left<npc.x+27 &&
      bottom>npc.y+5 &&
      top<npc.y+29
    ){
      return true;
    }

  }


  return false;

}


// ======================================================
// PLAYER
// ======================================================

function updatePlayer(dt){

  if(exitCooldown>0){
    exitCooldown-=dt;
  }


  if(
    dialogue.active ||
    transitionLock ||
    libraryOpen ||
    wordGetActive ||
    rankUpActive ||
    completionActive
  ){

    player.moving=false;

    return;

  }


  let dx=0;
  let dy=0;


  if(
    keys["w"] ||
    keys["arrowup"]
  ){

    dy--;
    player.direction="up";

  }


  if(
    keys["s"] ||
    keys["arrowdown"]
  ){

    dy++;
    player.direction="down";

  }


  if(
    keys["a"] ||
    keys["arrowleft"]
  ){

    dx--;
    player.direction="left";

  }


  if(
    keys["d"] ||
    keys["arrowright"]
  ){

    dx++;
    player.direction="right";

  }


  if(dx||dy){

    player.moving=true;


    const len=
      Math.hypot(dx,dy);


    dx/=len;
    dy/=len;


    const mx=
      dx*player.speed*dt;

    const my=
      dy*player.speed*dt;


    if(
      !playerCollides(
        player.x+mx,
        player.y
      )
    ){
      player.x+=mx;
    }


    if(
      !playerCollides(
        player.x,
        player.y+my
      )
    ){
      player.y+=my;
    }

  }

  else{

    player.moving=false;

  }


  checkExitZones();

}


// ======================================================
// CAMERA
// ======================================================

function clampCamera(){

  const map=
    getCurrentMap();


  const width=
    map.grid[0].length*TILE;

  const height=
    map.grid.length*TILE;


  camera.x=
    Math.max(
      0,
      Math.min(
        camera.x,
        Math.max(
          0,
          width-canvas.width
        )
      )
    );


  camera.y=
    Math.max(
      0,
      Math.min(
        camera.y,
        Math.max(
          0,
          height-canvas.height
        )
      )
    );

}


function updateCamera(){

  camera.x+=
    (
      player.x-
      canvas.width/2-
      camera.x
    )*.09;


  camera.y+=
    (
      player.y-
      canvas.height/2-
      camera.y
    )*.09;


  clampCamera();

}


// ======================================================
// DRAW MAP
// ======================================================

function drawMap(time){

  const map=
    getCurrentMap();


  for(
    let y=0;
    y<map.grid.length;
    y++
  ){

    for(
      let x=0;
      x<map.grid[0].length;
      x++
    ){

      const sx=
        Math.floor(
          x*TILE-camera.x
        );

      const sy=
        Math.floor(
          y*TILE-camera.y
        );


      const tile=
        map.grid[y][x];


      if(tile===T.FLOOR){
        ctx.fillStyle="#383239";
      }

      else if(tile===T.ROAD){
        ctx.fillStyle="#302e35";
      }

      else if(tile===T.PLAZA){
        ctx.fillStyle="#49444a";
      }

      else if(tile===T.WATER){
        ctx.fillStyle="#12364b";
      }

      else if(tile===T.GRASS){
        ctx.fillStyle="#294535";
      }

      else if(tile===T.INDOOR){
        ctx.fillStyle="#6c4c37";
      }

      else if(tile===T.WALL){
        ctx.fillStyle="#392822";
      }

      else if(tile===T.COUNTER){
        ctx.fillStyle="#70472e";
      }


      ctx.fillRect(
        sx,sy,
        TILE,TILE
      );


      ctx.fillStyle=
        "rgba(255,255,255,.025)";


      ctx.fillRect(
        sx+2,
        sy+2,
        TILE-4,
        1
      );

    }

  }


  // road markings

  if(
    currentMapId==="food" ||
    currentMapId==="market"
  ){

    ctx.fillStyle=
      "rgba(200,190,170,.10)";


    for(let y=80;y<1200;y+=110){

      ctx.fillRect(
        26*TILE-camera.x,
        y-camera.y,
        3,
        35
      );

    }

  }

}


// ======================================================
// BUILDINGS
// ======================================================

function drawBuildings(){

  const map=
    getCurrentMap();


  if(!map.buildings){
    return;
  }


  for(const b of map.buildings){

    const x=
      b.x*TILE-camera.x;

    const y=
      b.y*TILE-camera.y;

    const w=b.w*TILE;
    const h=b.h*TILE;


    ctx.fillStyle=
      "rgba(0,0,0,.38)";

    ctx.fillRect(
      x+12,
      y+17,
      w,
      h
    );


    ctx.fillStyle=
      b.color;

    ctx.fillRect(
      x+5,
      y+28,
      w-10,
      h-28
    );


    if(
      b.type==="traditional"
    ){

      ctx.fillStyle="#252725";

      ctx.fillRect(
        x-11,
        y+17,
        w+22,
        18
      );

      ctx.fillStyle="#49453c";

      ctx.fillRect(
        x,
        y+9,
        w,
        13
      );

    }

    else if(
      b.type==="hotel"
    ){

      ctx.fillStyle="#202733";

      ctx.fillRect(
        x+9,
        y+7,
        w-18,
        h-7
      );

    }

    else{

      ctx.fillStyle="#352726";

      ctx.fillRect(
        x,
        y+17,
        w,
        22
      );

    }


    // sign

    const signWidth=
      Math.min(
        w-30,
        Math.max(
          100,
          b.name.length*22
        )
      );


    ctx.fillStyle="#261817";

    ctx.fillRect(
      x+w/2-signWidth/2-3,
      y+36,
      signWidth+6,
      30
    );


    ctx.fillStyle="#843b31";

    ctx.fillRect(
      x+w/2-signWidth/2,
      y+39,
      signWidth,
      24
    );


    ctx.fillStyle="#f6d28a";

    ctx.font="bold 14px sans-serif";

    ctx.textAlign="center";

    ctx.fillText(
      b.name,
      x+w/2,
      y+56
    );


    // windows

    for(
      let wx=34;
      wx<w-35;
      wx+=64
    ){

      ctx.fillStyle="#30282b";

      ctx.fillRect(
        x+wx,
        y+81,
        30,
        29
      );


      ctx.fillStyle="#ca9250";

      ctx.fillRect(
        x+wx+4,
        y+85,
        22,
        21
      );

    }


    // door

    const dx=
      b.doorX*TILE-camera.x;


    ctx.fillStyle="#241819";

    ctx.fillRect(
      dx-5,
      y+h-51,
      TILE+10,
      51
    );


    ctx.fillStyle="#72442d";

    ctx.fillRect(
      dx,
      y+h-46,
      TILE,
      46
    );

  }

}


// ======================================================
// LANTERNS
// ======================================================

function drawLanternRows(time){

  const rows=
    getCurrentMap().lanternRows||[];


  for(const row of rows){

    const y=
      row.y*TILE-
      camera.y;


    const start=
      row.start*TILE-
      camera.x;

    const end=
      row.end*TILE-
      camera.x;


    ctx.strokeStyle="#302123";

    ctx.lineWidth=2;

    ctx.beginPath();

    ctx.moveTo(start,y);

    ctx.lineTo(end,y+4);

    ctx.stroke();


    for(
      let x=start+25;
      x<end;
      x+=58
    ){

      const sway=
        Math.sin(
          time*2+x*.02
        )*1.5;


      ctx.fillStyle=
        "rgba(255,128,48,.10)";

      ctx.beginPath();

      ctx.arc(
        x,
        y+15,
        20,
        0,
        Math.PI*2
      );

      ctx.fill();


      ctx.fillStyle="#a83b32";

      ctx.fillRect(
        x-6+sway,
        y+5,
        12,
        15
      );


      ctx.fillStyle="#ed9850";

      ctx.fillRect(
        x-3+sway,
        y+7,
        6,
        10
      );


      ctx.fillStyle="#e7b65d";

      ctx.fillRect(
        x-5+sway,
        y+20,
        10,
        2
      );

    }

  }

}


// ======================================================
// STALLS
// ======================================================

function drawStalls(time){

  const map=
    getCurrentMap();


  for(const stall of map.stalls){

    const x=
      stall.x*TILE-
      camera.x;

    const y=
      stall.y*TILE-
      camera.y;

    const width=
      stall.width*TILE;


    ctx.fillStyle="#533428";

    ctx.fillRect(
      x+4,
      y+11,
      5,
      27
    );

    ctx.fillRect(
      x+width-9,
      y+11,
      5,
      27
    );


    ctx.fillStyle="#aa4036";

    ctx.fillRect(
      x,
      y,
      width,
      14
    );


    for(
      let i=0;
      i<width;
      i+=16
    ){

      ctx.fillStyle=
        i%32===0
        ? "#d65547"
        : "#e0aa58";

      ctx.fillRect(
        x+i,
        y+13,
        16,
        6
      );

    }


    ctx.fillStyle="#321717";

    ctx.fillRect(
      x+8,
      y+2,
      width-16,
      11
    );


    ctx.fillStyle="#ffd477";

    ctx.font="bold 12px sans-serif";

    ctx.textAlign="center";

    ctx.fillText(
      stall.sign,
      x+width/2,
      y+12
    );


    ctx.fillStyle="#74482e";

    ctx.fillRect(
      x+5,
      y+27,
      width-10,
      11
    );


    if(
      stall.type==="shaokao" ||
      stall.type==="food"
    ){

      drawSteam(
        x+width/2,
        y+23,
        time
      );

    }

  }

}


function drawSteam(x,y,time){

  const offset=
    (time*12)%14;


  ctx.fillStyle=
    "rgba(240,230,215,.5)";


  ctx.fillRect(
    x-8,
    y-offset,
    2,5
  );

  ctx.fillRect(
    x,
    y-6-offset*.7,
    2,5
  );

  ctx.fillRect(
    x+8,
    y-2-offset*.9,
    2,4
  );

}


// ======================================================
// PROPS
// ======================================================

function drawProps(){

  const map=
    getCurrentMap();


  for(const prop of map.props){

    const x=
      prop.x*TILE-
      camera.x;

    const y=
      prop.y*TILE-
      camera.y;


    drawProp(
      prop,
      x,
      y
    );

  }

}


function drawProp(prop,x,y){

  const type=prop.type;


  if(type==="plasticStool"){

    ctx.fillStyle="#d55243";

    ctx.fillRect(
      x+7,
      y+13,
      18,
      8
    );

    ctx.fillRect(
      x+9,
      y+21,
      3,
      8
    );

    ctx.fillRect(
      x+20,
      y+21,
      3,
      8
    );

  }


  else if(type==="streetTable"){

    ctx.fillStyle="#70503a";

    ctx.fillRect(
      x,
      y+12,
      32,
      8
    );

    ctx.fillRect(
      x+4,
      y+20,
      4,
      10
    );

    ctx.fillRect(
      x+24,
      y+20,
      4,
      10
    );

  }


  else if(type==="priceBoard"){

    ctx.fillStyle="#2d201c";

    ctx.fillRect(
      x+5,
      y+3,
      22,
      25
    );

    ctx.fillStyle="#e1c57e";

    ctx.fillRect(
      x+9,
      y+8,
      14,
      2
    );

    ctx.fillRect(
      x+9,
      y+14,
      10,
      2
    );

    ctx.fillRect(
      x+9,
      y+20,
      13,
      2
    );

  }


  else if(type==="crate"){

    ctx.fillStyle="#765039";

    ctx.fillRect(
      x+3,
      y+10,
      27,
      19
    );

    ctx.strokeStyle="#a2734b";

    ctx.strokeRect(
      x+6,
      y+13,
      21,
      13
    );

  }


  else if(type==="verticalSign"){

    ctx.fillStyle="#8d332d";

    ctx.fillRect(
      x+8,
      y,
      17,
      32
    );

    ctx.fillStyle="#f1cb78";

    ctx.font="10px sans-serif";

    ctx.textAlign="center";

    ctx.fillText(
      prop.text||"店",
      x+16,
      y+18
    );

  }


  else if(type==="deliveryBox"){

    ctx.fillStyle="#d5a62f";

    ctx.fillRect(
      x+5,
      y+9,
      22,
      19
    );

    ctx.fillStyle="#4a3b24";

    ctx.fillRect(
      x+9,
      y+13,
      14,
      4
    );

  }


  else if(type==="manhole"){

    ctx.fillStyle="#222329";

    ctx.beginPath();

    ctx.arc(
      x+16,
      y+19,
      10,
      0,
      Math.PI*2
    );

    ctx.fill();

    ctx.strokeStyle="#48484b";

    ctx.stroke();

  }


  else if(type==="willow"){

    ctx.fillStyle="#493326";

    ctx.fillRect(
      x+14,
      y+9,
      5,
      23
    );

    ctx.fillStyle="#315b3d";

    ctx.fillRect(
      x+3,
      y,
      26,
      12
    );

    ctx.fillRect(
      x+4,
      y+8,
      5,
      20
    );

    ctx.fillRect(
      x+23,
      y+8,
      5,
      19
    );

  }


  else if(
    type==="teaTable"
  ){

    ctx.fillStyle="#4c3023";

    ctx.fillRect(
      x,
      y+12,
      32,12
    );

    ctx.fillStyle="#8b5d39";

    ctx.fillRect(
      x-3,
      y+8,
      38,8
    );

    ctx.fillStyle="#d6bb79";

    ctx.fillRect(
      x+12,
      y+3,
      8,6
    );

  }


  else if(type==="teaShelf"){

    ctx.fillStyle="#3d291f";

    ctx.fillRect(
      x+3,y,
      26,31
    );

    ctx.fillStyle="#795038";

    ctx.fillRect(
      x+5,y+5,
      22,4
    );

    ctx.fillRect(
      x+5,y+16,
      22,4
    );

    ctx.fillRect(
      x+5,y+27,
      22,3
    );

    ctx.fillStyle="#718254";

    ctx.fillRect(
      x+8,y+9,
      7,6
    );

    ctx.fillStyle="#a88552";

    ctx.fillRect(
      x+18,y+9,
      6,6
    );

  }


  else if(type==="scroll"){

    ctx.fillStyle="#e0d1ad";

    ctx.fillRect(
      x+9,y,
      15,29
    );

    ctx.fillStyle="#34231f";

    ctx.fillRect(
      x+7,y,
      19,3
    );

    ctx.fillRect(
      x+7,y+27,
      19,3
    );

    ctx.fillRect(
      x+15,y+7,
      2,14
    );

  }


  else if(
    type==="noodleTable" ||
    type==="diningTable"
  ){

    ctx.fillStyle="#68432c";

    ctx.fillRect(
      x,
      y+11,
      32,10
    );

    ctx.fillStyle="#98613b";

    ctx.fillRect(
      x-2,
      y+7,
      36,7
    );

    ctx.fillStyle="#e0c99a";

    ctx.fillRect(
      x+11,
      y+2,
      11,6
    );

  }


  else if(type==="steamPot"){

    ctx.fillStyle="#626567";

    ctx.fillRect(
      x+5,
      y+13,
      22,13
    );

    ctx.fillStyle="#aaa8a0";

    ctx.fillRect(
      x+3,
      y+10,
      26,5
    );

    ctx.fillStyle="#ddd0b0";

    ctx.fillRect(
      x+13,
      y+3,
      3,6
    );

  }


  else if(type==="menuBoard"){

    ctx.fillStyle="#2d201d";

    ctx.fillRect(
      x+2,y,
      28,30
    );

    ctx.fillStyle="#e1c985";

    ctx.fillRect(
      x+7,y+6,
      18,2
    );

    ctx.fillRect(
      x+7,y+12,
      14,2
    );

    ctx.fillRect(
      x+7,y+18,
      17,2
    );

  }


  else if(type==="condiments"){

    ctx.fillStyle="#70462d";

    ctx.fillRect(
      x,
      y+18,
      32,8
    );

    ctx.fillStyle="#b54338";

    ctx.fillRect(
      x+5,
      y+8,
      5,10
    );

    ctx.fillStyle="#c39b51";

    ctx.fillRect(
      x+14,
      y+6,
      5,12
    );

  }


  else if(type==="fridge"){

    ctx.fillStyle="#c5d0cf";

    ctx.fillRect(
      x+2,y,
      28,31
    );

    ctx.fillStyle="#355664";

    ctx.fillRect(
      x+5,
      y+4,
      22,23
    );

    ctx.fillStyle="#7fb0b3";

    ctx.fillRect(
      x+8,
      y+7,
      7,17
    );

    ctx.fillRect(
      x+17,
      y+7,
      7,17
    );

  }


  else if(
    type==="shopShelf" ||
    type==="cultureShelf"
  ){

    ctx.fillStyle="#55382c";

    ctx.fillRect(
      x+3,y,
      26,30
    );

    ctx.fillStyle="#93613d";

    ctx.fillRect(
      x+5,y+6,
      22,3
    );

    ctx.fillRect(
      x+5,y+16,
      22,3
    );

    ctx.fillRect(
      x+5,y+26,
      22,3
    );

  }


  else if(type==="cashier"){

    ctx.fillStyle="#456069";

    ctx.fillRect(
      x,
      y+15,
      32,14
    );

    ctx.fillStyle="#1d2c31";

    ctx.fillRect(
      x+8,
      y+5,
      16,12
    );

  }


  else if(type==="clothesRack"){

    ctx.fillStyle="#433630";

    ctx.fillRect(
      x+4,y+3,
      3,28
    );

    ctx.fillRect(
      x+25,y+3,
      3,28
    );

    ctx.fillRect(
      x+4,y+4,
      24,3
    );

    ctx.fillStyle="#a34f5d";

    ctx.fillRect(
      x+8,
      y+10,
      6,13
    );

    ctx.fillStyle="#527291";

    ctx.fillRect(
      x+14,
      y+10,
      6,13
    );

  }


  else if(type==="jadeDisplay"){

    ctx.fillStyle="#55392b";

    ctx.fillRect(
      x,
      y+17,
      32,12
    );

    ctx.fillStyle="#668978";

    ctx.fillRect(
      x+10,
      y+4,
      12,10
    );

    ctx.fillStyle="#293f38";

    ctx.fillRect(
      x+13,
      y+6,
      6,6
    );

  }


  else if(type==="jewelry"){

    ctx.fillStyle="#5c3d45";

    ctx.fillRect(
      x,
      y+16,
      32,13
    );

    ctx.fillStyle="#d0a96c";

    ctx.fillRect(
      x+6,
      y+7,
      5,5
    );

    ctx.fillStyle="#b45d77";

    ctx.fillRect(
      x+16,
      y+5,
      5,7
    );

  }


  else if(type==="drinkCounter"){

    ctx.fillStyle="#38584f";

    ctx.fillRect(
      x,
      y+15,
      32,14
    );

    ctx.fillStyle="#81a37f";

    ctx.fillRect(
      x+5,
      y+6,
      6,9
    );

    ctx.fillStyle="#d4b168";

    ctx.fillRect(
      x+14,
      y+4,
      6,11
    );

  }


  else if(type==="teaCanister"){

    ctx.fillStyle="#6d8158";

    ctx.fillRect(
      x+4,
      y+7,
      7,18
    );

    ctx.fillStyle="#b19453";

    ctx.fillRect(
      x+13,
      y+4,
      7,21
    );

    ctx.fillStyle="#75566d";

    ctx.fillRect(
      x+22,
      y+8,
      7,17
    );

  }


  else if(type==="hotelDesk"){

    ctx.fillStyle="#574132";

    ctx.fillRect(
      x-30,
      y+12,
      92,17
    );

    ctx.fillStyle="#a17b51";

    ctx.fillRect(
      x-33,
      y+8,
      98,7
    );

  }


  else if(type==="hotelSofa"){

    ctx.fillStyle="#51475b";

    ctx.fillRect(
      x-4,
      y+11,
      40,18
    );

    ctx.fillStyle="#766881";

    ctx.fillRect(
      x,
      y+6,
      32,12
    );

  }


  else if(type==="luggage"){

    ctx.fillStyle="#624538";

    ctx.fillRect(
      x+6,
      y+8,
      20,21
    );

  }


  else if(type==="chandelier"){

    ctx.fillStyle="#d8b35f";

    ctx.fillRect(
      x+15,y,
      2,9
    );

    ctx.fillRect(
      x+5,y+9,
      22,3
    );

  }


  else if(type==="windowLake"){

    ctx.fillStyle="#332824";

    ctx.fillRect(
      x,y,
      32,30
    );

    ctx.fillStyle="#193d52";

    ctx.fillRect(
      x+4,
      y+4,
      24,22
    );

    ctx.fillStyle="#37748b";

    ctx.fillRect(
      x+6,
      y+17,
      20,3
    );

  }


  else if(type==="postcard"){

    ctx.fillStyle="#604333";

    ctx.fillRect(
      x,
      y+16,
      32,12
    );

    ctx.fillStyle="#d5c69f";

    ctx.fillRect(
      x+3,
      y+2,
      12,12
    );

    ctx.fillStyle="#6a8793";

    ctx.fillRect(
      x+17,
      y+3,
      12,11
    );

  }


  else if(type==="book"){

    ctx.fillStyle="#7c3f37";

    ctx.fillRect(
      x+4,
      y+10,
      24,15
    );

    ctx.fillStyle="#d3b57a";

    ctx.fillRect(
      x+15,
      y+10,
      2,15
    );

  }


  else if(type==="silk"){

    ctx.fillStyle="#b46d77";

    ctx.fillRect(
      x+3,
      y+5,
      26,6
    );

    ctx.fillStyle="#638095";

    ctx.fillRect(
      x+3,
      y+13,
      26,6
    );

    ctx.fillStyle="#c69b52";

    ctx.fillRect(
      x+3,
      y+21,
      26,6
    );

  }


  else if(type==="bench"){

    ctx.fillStyle="#70452d";

    ctx.fillRect(
      x+3,
      y+10,
      27,5
    );

    ctx.fillRect(
      x+3,
      y+18,
      27,5
    );

  }


  else if(type==="plant"){

    ctx.fillStyle="#805138";

    ctx.fillRect(
      x+10,
      y+20,
      13,10
    );

    ctx.fillStyle="#376044";

    ctx.fillRect(
      x+7,
      y+6,
      19,17
    );

  }


  else if(type==="tree"){

    ctx.fillStyle="#493427";

    ctx.fillRect(
      x+14,
      y+15,
      5,17
    );

    ctx.fillStyle="#315642";

    ctx.fillRect(
      x+4,
      y+2,
      25,19
    );

  }


  else if(type==="streetlight"){

    ctx.fillStyle="#29282c";

    ctx.fillRect(
      x+15,
      y+8,
      3,23
    );

    ctx.fillStyle="#f4c76b";

    ctx.fillRect(
      x+11,
      y+3,
      11,8
    );

  }


  else if(
    type==="taxi" ||
    type==="car"
  ){

    ctx.fillStyle=
      type==="taxi"
      ? "#c99a39"
      : "#3b4b64";

    ctx.fillRect(
      x,
      y+11,
      54,16
    );

    ctx.fillRect(
      x+12,
      y+5,
      29,11
    );

  }


  else if(type==="bike"){

    ctx.strokeStyle="#b8a58c";

    ctx.lineWidth=2;

    ctx.beginPath();

    ctx.arc(
      x+8,y+22,6,
      0,Math.PI*2
    );

    ctx.arc(
      x+24,y+22,6,
      0,Math.PI*2
    );

    ctx.moveTo(
      x+8,y+22
    );

    ctx.lineTo(
      x+15,y+12
    );

    ctx.lineTo(
      x+24,y+22
    );

    ctx.stroke();

  }


  else if(type==="scooter"){

    ctx.fillStyle="#8d3436";

    ctx.fillRect(
      x+9,
      y+9,
      15,16
    );

    ctx.fillStyle="#27272b";

    ctx.fillRect(
      x+7,
      y+24,
      6,5
    );

    ctx.fillRect(
      x+21,
      y+24,
      6,5
    );

  }


  else if(type==="trash"){

    ctx.fillStyle="#45585a";

    ctx.fillRect(
      x+8,
      y+7,
      16,22
    );

  }


  else{

    ctx.fillStyle="#765039";

    ctx.fillRect(
      x+5,
      y+5,
      22,22
    );

  }

}


// ======================================================
// INTERACTABLE MARKER
// ======================================================

function drawInteractables(time){

  const map=
    getCurrentMap();


  if(!map.interactables){
    return;
  }


  for(const obj of map.interactables){

    if(hasVocabulary(obj.word)){
      continue;
    }


    const x=
      (obj.x+.5)*TILE-
      camera.x;

    const y=
      obj.y*TILE-
      camera.y-5;


    const pulse=
      Math.sin(time*4)*2;


    ctx.fillStyle="#f6d37c";

    ctx.fillRect(
      x-1,
      y-6-pulse,
      3,9
    );

    ctx.fillRect(
      x-5,
      y-2-pulse,
      11,2
    );

  }

}


// ======================================================
// EXIT
// ======================================================

function drawExits(time){

  const map=
    getCurrentMap();


  for(const exit of map.exits){

    const x=
      exit.x*TILE-
      camera.x;

    const y=
      exit.y*TILE-
      camera.y;

    const w=
      exit.width*TILE;

    const h=
      exit.height*TILE;


    ctx.fillStyle=
      `rgba(224,174,82,${
        .07+
        Math.sin(time*3)*.02
      })`;


    ctx.fillRect(
      x,y,w,h
    );


    ctx.fillStyle="#704a30";

    ctx.fillRect(
      x+w/2-75,
      y+h/2-10,
      150,
      22
    );


    ctx.fillStyle="#f0ce89";

    ctx.font="bold 11px sans-serif";

    ctx.textAlign="center";

    ctx.fillText(
      exit.label,
      x+w/2,
      y+h/2+5
    );

  }

}


// ======================================================
// PERSON
// ======================================================

function drawPerson(
  x,y,
  data,
  moving,
  time
){

  const step=
    moving &&
    Math.sin(time*11)>0
    ? 1
    : -1;


  ctx.fillStyle=
    "rgba(0,0,0,.35)";

  ctx.fillRect(
    x+3,
    y+24,
    16,4
  );


  ctx.fillStyle="#292630";

  ctx.fillRect(
    x+5,
    y+19+step,
    5,7
  );

  ctx.fillRect(
    x+12,
    y+19-step,
    5,7
  );


  ctx.fillStyle=data.color;

  ctx.fillRect(
    x+3,
    y+9,
    16,12
  );


  ctx.fillStyle=data.skin;

  ctx.fillRect(
    x+5,
    y+2,
    12,9
  );


  ctx.fillStyle=data.hair;

  ctx.fillRect(
    x+4,
    y,
    14,5
  );


  if(data.direction==="down"){

    ctx.fillStyle="#251d1d";

    ctx.fillRect(
      x+8,
      y+6,
      2,2
    );

    ctx.fillRect(
      x+14,
      y+6,
      2,2
    );

  }

}


// ======================================================
// ENTITIES
// ======================================================

function drawEntities(time){

  const entities=[];


  for(const npc of getCurrentNPCs()){

    entities.push({

      y:npc.y,

      draw:()=>{

        drawPerson(

          Math.floor(
            npc.x-camera.x+5
          ),

          Math.floor(
            npc.y-camera.y+3
          ),

          npc,

          npc.wander &&
          (
            npc.moveX!==0 ||
            npc.moveY!==0
          ),

          time

        );

      }

    });

  }


  entities.push({

    y:player.y,

    draw:()=>{

      drawPerson(

        Math.floor(
          player.x-camera.x
        ),

        Math.floor(
          player.y-camera.y
        ),

        {
          color:"#355f7d",
          hair:"#211b20",
          skin:"#e1ae87",
          direction:player.direction
        },

        player.moving,

        time

      );

    }

  });


  entities.sort(
    (a,b)=>a.y-b.y
  );


  for(const entity of entities){
    entity.draw();
  }

}


// ======================================================
// LIGHT
// ======================================================

function drawLighting(){

  const ambient=
    getCurrentMap().ambient;


  if(ambient==="indoor"){

    ctx.fillStyle=
      "rgba(92,46,15,.045)";

  }

  else if(ambient==="lake"){

    ctx.fillStyle=
      "rgba(4,20,43,.18)";

  }

  else{

    ctx.fillStyle=
      "rgba(15,8,31,.14)";

  }


  ctx.fillRect(
    0,0,
    canvas.width,
    canvas.height
  );

}


// ======================================================
// UI
// ======================================================

function updateCollectionUI(){

  const count=
    collectedVocabulary.length;


  collectionHeader.textContent=
    `词语 ${count} / ${getVocabularyCount()}`;


  rankHeader.textContent=
    getRank(count);

}


function showAreaBanner(){

  const map=
    getCurrentMap();


  areaHeader.textContent=
    map.name;


  areaBannerName.textContent=
    map.name;


  areaBannerSub.textContent=
    map.subtitle;


  areaBanner.classList.remove(
    "hidden"
  );


  bannerTimer=2.5;

}


function updateBanner(dt){

  if(bannerTimer<=0){
    return;
  }


  bannerTimer-=dt;


  if(bannerTimer<=0){

    areaBanner.classList.add(
      "hidden"
    );

  }

}


function updateInteractionHint(){

  if(
    dialogue.active ||
    transitionLock ||
    wordGetActive ||
    rankUpActive ||
    completionActive ||
    libraryOpen
  ){

    interactionHint.classList.add(
      "hidden"
    );

    return;

  }


  const npc=
    getNearbyNPC();


  if(npc){

    interactionText.textContent=
      "話す";

    interactionHint.classList.remove(
      "hidden"
    );

    return;

  }


  const obj=
    getNearbyInteractable();


  if(obj){

    interactionText.textContent=
      obj.label;

    interactionHint.classList.remove(
      "hidden"
    );

    return;

  }


  const building=
    getNearbyBuilding();


  if(building){

    interactionText.textContent=
      `${building.name}に入る`;

    interactionHint.classList.remove(
      "hidden"
    );

    return;

  }


  interactionHint.classList.add(
    "hidden"
  );

}


// ======================================================
// CLOCK
// ======================================================

let fakeMinutes=
  19*60+42;


function updateClock(dt){

  fakeMinutes+=dt*.15;


  const total=
    Math.floor(fakeMinutes);


  const hour=
    Math.floor(
      total/60
    )%24;


  const minute=
    total%60;


  clockElement.textContent=
    `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;

}


// ======================================================
// DRAW
// ======================================================

function draw(time){

  ctx.fillStyle="#100d14";

  ctx.fillRect(
    0,0,
    canvas.width,
    canvas.height
  );


  drawMap(time);

  drawBuildings();

  drawLanternRows(time);

  drawStalls(time);

  drawProps();

  drawInteractables(time);

  drawExits(time);

  drawEntities(time);

  drawLighting();

}


// ======================================================
// LOOP
// ======================================================

let previousTime=
  performance.now();


function gameLoop(now){

  let dt=
    (now-previousTime)/1000;


  previousTime=now;


  dt=
    Math.min(
      dt,
      .05
    );


  const time=
    now/1000;


  updatePlayer(dt);

  updateNPCs(dt);

  updateCamera();

  updateBanner(dt);

  updateInteractionHint();

  updateClock(dt);

  draw(time);


  requestAnimationFrame(
    gameLoop
  );

}


// ======================================================
// START
// ======================================================

console.log(
  "Vocabulary:",
  getVocabularyCount()
);

updateCollectionUI();

showAreaBanner();

updateCamera();

requestAnimationFrame(
  gameLoop
);
