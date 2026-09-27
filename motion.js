"use strict";

/*
============================================================
 杭州探索録 / 武林夜市
 MOTION SYSTEM Ver.5.1 "LIVING NIGHT MARKET"

 ・建物上NPC問題を修正
 ・屋台内部への侵入を防止
 ・安全な歩行可能地点からのみNPC生成
 ・歩行者
 ・屋台店員
 ・屋台客
 ・立ち話
 ・スマホを見る人
 ・写真を撮る観光客
 ・西湖を眺める人
 ・ベンチ利用者
 ・スクーター
 ・自転車
 ・ホテル前タクシー
 ・西湖遊覧船
 ・遊覧船の乗客
 ・水面反射
 ・波紋
 ・柳の揺れ
 ・落ち葉
 ・屋台の炎
 ・調理湯気
 ・店の明かり
 ・看板の微妙な明滅

 ※ゲーム本体のNPC・会話・100語収集・衝突には干渉しない
============================================================
*/


// ============================================================
// CONFIG
// ============================================================

const MOTION51_CONFIG={

  pedestrians:true,
  stallWorkers:true,
  stallCustomers:true,
  socialGroups:true,

  vehicles:true,
  taxi:true,

  boats:true,
  lakeVisitors:true,

  willow:true,
  particles:true,
  lighting:true,

  maxPedestrians:12,

  pedestrianSpeedMin:8,
  pedestrianSpeedMax:17,

  buildingMargin:18,
  stallMargin:14

};


// ============================================================
// STATE
// ============================================================

const MOTION51={

  mapId:null,

  pedestrians:[],
  socialGroups:[],
  stallCustomers:[],
  vehicles:[],
  boats:[],
  particles:[],
  ripples:[],

  initialized:false

};


// ============================================================
// BASIC UTILITY
// ============================================================

function m51Map(){
  return getCurrentMap();
}


function m51Indoor(){

  return m51Map().ambient==="indoor";

}


function m51SX(x){
  return x-camera.x;
}


function m51SY(y){
  return y-camera.y;
}


function m51Visible(x,y,margin=100){

  return (
    x>-margin &&
    y>-margin &&
    x<canvas.width+margin &&
    y<canvas.height+margin
  );

}


function m51Hash(n){

  const value=
    Math.sin(n*91.731+17.13)*
    43758.5453;

  return value-
    Math.floor(value);

}


function m51Pick(array,n){

  return array[
    Math.abs(n)%array.length
  ];

}


function m51RectContains(
  px,
  py,
  x,
  y,
  w,
  h,
  margin=0
){

  return (
    px>=x-margin &&
    px<=x+w+margin &&
    py>=y-margin &&
    py<=y+h+margin
  );

}


// ============================================================
// COLORS
// ============================================================

const M51_CLOTHES=[

  "#80504d",
  "#476276",
  "#74644f",
  "#526a59",
  "#77536d",
  "#8a653f",
  "#505c78",
  "#855d52",
  "#4f6c68",
  "#765f7d"

];


const M51_SKIN=[

  "#e2ae84",
  "#d89d76",
  "#e7b68d",
  "#ca906b"

];


const M51_HAIR=[

  "#1d1819",
  "#28201e",
  "#34251f",
  "#17191d",
  "#3b2c24"

];


// ============================================================
// WORLD GEOMETRY
// ============================================================

/*
  前回の最大の問題だった部分。

  タイルが ROAD / PLAZA でも、
  その上に建物が描かれていることがあります。

  そのため、

  1. タイル
  2. 建物矩形
  3. 屋台矩形
  4. 水・壁・カウンター
  5. 出口周辺

  を全部確認します。
*/


function m51InsideBuilding(
  worldX,
  worldY,
  margin=MOTION51_CONFIG.buildingMargin
){

  const buildings=
    m51Map().buildings||[];


  for(const b of buildings){

    const x=b.x*TILE;
    const y=b.y*TILE;
    const w=b.w*TILE;
    const h=b.h*TILE;


    if(
      m51RectContains(
        worldX,
        worldY,
        x,
        y,
        w,
        h,
        margin
      )
    ){
      return true;
    }

  }


  return false;

}


function m51InsideStall(
  worldX,
  worldY,
  margin=MOTION51_CONFIG.stallMargin
){

  const stalls=
    m51Map().stalls||[];


  for(const stall of stalls){

    const x=stall.x*TILE;

    const y=
      stall.y*TILE;

    const w=
      stall.width*TILE;

    /*
      屋台は描画上、タイル1個より
      少し前まで張り出して見える。
    */

    const h=58;


    if(
      m51RectContains(
        worldX,
        worldY,
        x,
        y,
        w,
        h,
        margin
      )
    ){
      return true;
    }

  }


  return false;

}


function m51InsideExit(
  worldX,
  worldY,
  margin=20
){

  const exits=
    m51Map().exits||[];


  for(const exit of exits){

    const x=exit.x*TILE;
    const y=exit.y*TILE;

    const w=
      exit.width*TILE;

    const h=
      exit.height*TILE;


    if(
      m51RectContains(
        worldX,
        worldY,
        x,
        y,
        w,
        h,
        margin
      )
    ){
      return true;
    }

  }


  return false;

}


// ============================================================
// SAFE POINT
// ============================================================

function m51SafePoint(
  worldX,
  worldY,
  options={}
){

  const map=m51Map();


  const tx=
    Math.floor(
      worldX/TILE
    );

  const ty=
    Math.floor(
      worldY/TILE
    );


  if(
    ty<0 ||
    tx<0 ||
    ty>=map.grid.length ||
    tx>=map.grid[0].length
  ){
    return false;
  }


  const tile=
    map.grid[ty][tx];


  /*
    背景歩行者は道路か広場だけ。
  */

  if(
    !options.ignoreWalkTile &&
    tile!==T.ROAD &&
    tile!==T.PLAZA
  ){
    return false;
  }


  if(
    tile===T.WATER ||
    tile===T.WALL ||
    tile===T.COUNTER
  ){
    return false;
  }


  if(
    m51InsideBuilding(
      worldX,
      worldY
    )
  ){
    return false;
  }


  if(
    m51InsideStall(
      worldX,
      worldY
    )
  ){
    return false;
  }


  if(
    !options.allowExit &&
    m51InsideExit(
      worldX,
      worldY
    )
  ){
    return false;
  }


  /*
    本体側の衝突判定も最後に利用。
  */

  if(
    typeof isSolidAtPixel==="function" &&
    isSolidAtPixel(
      worldX,
      worldY
    )
  ){
    return false;
  }


  return true;

}


// ============================================================
// ACTOR FOOTPRINT CHECK
// ============================================================

function m51SafeActorPosition(x,y){

  /*
    足元1点だけではなく、
    左右＋前方も確認する。
  */

  const points=[

    [x+5,y+22],
    [x+17,y+22],

    [x+5,y+27],
    [x+17,y+27],

    [x+11,y+25]

  ];


  for(const point of points){

    if(
      !m51SafePoint(
        point[0],
        point[1]
      )
    ){
      return false;
    }

  }


  return true;

}


// ============================================================
// INITIALIZE
// ============================================================

function m51Initialize(){

  MOTION51.mapId=
    currentMapId;


  MOTION51.pedestrians=[];
  MOTION51.socialGroups=[];
  MOTION51.stallCustomers=[];
  MOTION51.vehicles=[];
  MOTION51.boats=[];
  MOTION51.particles=[];
  MOTION51.ripples=[];


  if(!m51Indoor()){

    m51CreatePedestrians();

    m51CreateSocialGroups();

    m51CreateStallCustomers();

    m51CreateVehicles();

  }


  if(currentMapId==="lake"){

    m51CreateBoats();

  }


  MOTION51.initialized=true;

}


// ============================================================
// PEDESTRIAN CANDIDATES
// ============================================================

function m51GetPedestrianCandidates(){

  const map=m51Map();

  const result=[];


  for(
    let y=2;
    y<map.grid.length-2;
    y++
  ){

    for(
      let x=2;
      x<map.grid[0].length-2;
      x++
    ){

      const tile=
        map.grid[y][x];


      if(
        tile!==T.ROAD &&
        tile!==T.PLAZA
      ){
        continue;
      }


      const wx=
        x*TILE+6;

      const wy=
        y*TILE+3;


      if(
        !m51SafeActorPosition(
          wx,
          wy
        )
      ){
        continue;
      }


      /*
        建物・屋台ギリギリは避ける。
      */

      if(
        m51InsideBuilding(
          wx+10,
          wy+20,
          32
        )
      ){
        continue;
      }


      if(
        m51InsideStall(
          wx+10,
          wy+20,
          25
        )
      ){
        continue;
      }


      result.push({
        x:wx,
        y:wy
      });

    }

  }


  return result;

}


// ============================================================
// PEDESTRIANS
// ============================================================

function m51CreatePedestrians(){

  if(
    !MOTION51_CONFIG.pedestrians
  ){
    return;
  }


  const candidates=
    m51GetPedestrianCandidates();


  if(!candidates.length){
    return;
  }


  const count=
    Math.min(
      MOTION51_CONFIG.maxPedestrians,
      Math.max(
        4,
        Math.floor(
          candidates.length/16
        )
      )
    );


  const used=[];


  for(
    let i=0;
    i<count;
    i++
  ){

    const index=
      Math.floor(
        m51Hash(
          i*37+
          currentMapId.length*101
        )*
        candidates.length
      );


    const spot=
      candidates[index];


    if(!spot){
      continue;
    }


    /*
      人同士が同じ場所に
      生まれないようにする。
    */

    let tooClose=false;


    for(const p of used){

      if(
        Math.hypot(
          p.x-spot.x,
          p.y-spot.y
        )<48
      ){

        tooClose=true;
        break;

      }

    }


    if(tooClose){
      continue;
    }


    used.push(spot);


    MOTION51.pedestrians.push({

      x:spot.x,
      y:spot.y,

      homeX:spot.x,
      homeY:spot.y,

      color:
        m51Pick(
          M51_CLOTHES,
          i
        ),

      skin:
        m51Pick(
          M51_SKIN,
          i*3
        ),

      hair:
        m51Pick(
          M51_HAIR,
          i*5
        ),

      direction:
        m51Pick(
          [
            "down",
            "left",
            "right",
            "up"
          ],
          i
        ),

      vx:0,
      vy:0,

      speed:
        MOTION51_CONFIG.pedestrianSpeedMin+
        m51Hash(i*13)*
        (
          MOTION51_CONFIG.pedestrianSpeedMax-
          MOTION51_CONFIG.pedestrianSpeedMin
        ),

      timer:
        .5+
        m51Hash(i*19)*3,

      range:
        55+
        m51Hash(i*31)*80,

      seed:
        i*1.27,

      activity:
        m51Hash(i*47)<.17
        ? "phone"
        : "walk"

    });

  }

}


// ============================================================
// PEDESTRIAN UPDATE
// ============================================================

function m51UpdatePedestrians(dt){

  if(
    dialogue.active ||
    transitionLock ||
    libraryOpen ||
    wordGetActive ||
    rankUpActive ||
    completionActive
  ){
    return;
  }


  for(
    const actor of
    MOTION51.pedestrians
  ){

    actor.timer-=dt;


    if(actor.timer<=0){

      actor.timer=
        .7+
        Math.random()*3;


      const r=Math.random();


      /*
        スマホを見る。
      */

      if(
        actor.activity==="phone" &&
        r<.42
      ){

        actor.vx=0;
        actor.vy=0;

        actor.timer=
          1.4+
          Math.random()*2;

        continue;

      }


      /*
        立ち止まる。
      */

      if(r<.25){

        actor.vx=0;
        actor.vy=0;

        continue;

      }


      const dir=
        Math.floor(
          Math.random()*4
        );


      actor.vx=0;
      actor.vy=0;


      if(dir===0){

        actor.vx=1;
        actor.direction="right";

      }

      else if(dir===1){

        actor.vx=-1;
        actor.direction="left";

      }

      else if(dir===2){

        actor.vy=1;
        actor.direction="down";

      }

      else{

        actor.vy=-1;
        actor.direction="up";

      }

    }


    let nx=
      actor.x+
      actor.vx*
      actor.speed*
      dt;


    let ny=
      actor.y+
      actor.vy*
      actor.speed*
      dt;


    /*
      行動範囲を越えたら
      ホームへ戻ろうとする。
    */

    if(
      Math.hypot(
        nx-actor.homeX,
        ny-actor.homeY
      )>
      actor.range
    ){

      const dx=
        actor.homeX-
        actor.x;

      const dy=
        actor.homeY-
        actor.y;


      actor.vx=0;
      actor.vy=0;


      if(
        Math.abs(dx)>
        Math.abs(dy)
      ){

        actor.vx=
          Math.sign(dx);

        actor.direction=
          actor.vx>0
          ? "right"
          : "left";

      }

      else{

        actor.vy=
          Math.sign(dy);

        actor.direction=
          actor.vy>0
          ? "down"
          : "up";

      }


      nx=
        actor.x+
        actor.vx*
        actor.speed*
        dt;

      ny=
        actor.y+
        actor.vy*
        actor.speed*
        dt;

    }


    /*
      新しい位置全体が安全か確認。
    */

    if(
      m51SafeActorPosition(
        nx,
        ny
      )
    ){

      actor.x=nx;
      actor.y=ny;

    }

    else{

      actor.vx=0;
      actor.vy=0;

      actor.timer=.15;

    }

  }

}


// ============================================================
// SOCIAL GROUPS
// ============================================================

function m51CreateSocialGroups(){

  if(
    !MOTION51_CONFIG.socialGroups ||
    m51Indoor()
  ){
    return;
  }


  const candidates=
    m51GetPedestrianCandidates();


  if(candidates.length<3){
    return;
  }


  const wanted=
    currentMapId==="food"
    ? 3
    : currentMapId==="market"
    ? 2
    : currentMapId==="lake"
    ? 2
    : 1;


  for(
    let i=0;
    i<wanted;
    i++
  ){

    const spot=
      candidates[
        Math.floor(
          m51Hash(
            900+i*53+
            currentMapId.length
          )*
          candidates.length
        )
      ];


    if(!spot){
      continue;
    }


    /*
      2人並べても安全か確認。
    */

    if(
      !m51SafeActorPosition(
        spot.x-12,
        spot.y
      ) ||
      !m51SafeActorPosition(
        spot.x+15,
        spot.y
      )
    ){
      continue;
    }


    MOTION51.socialGroups.push({

      x:spot.x,
      y:spot.y,

      seed:i*2.4,

      type:
        currentMapId==="lake" &&
        i===0
        ? "photo"
        : "talk"

    });

  }

}


// ============================================================
// STALL CUSTOMERS
// ============================================================

function m51CreateStallCustomers(){

  if(
    !MOTION51_CONFIG.stallCustomers
  ){
    return;
  }


  const stalls=
    m51Map().stalls||[];


  stalls.forEach(
    (stall,index)=>{

      if(index%2!==0){
        return;
      }


      const centerX=
        (
          stall.x+
          stall.width/2
        )*TILE;


      /*
        屋台の下側＝客側。
        前回より大きく距離を取る。
      */

      const y=
        stall.y*TILE+
        74;


      const x=
        centerX+
        (
          index%3-1
        )*21-
        10;


      /*
        客の足元が安全な場合のみ配置。
      */

      if(
        !m51SafeActorPosition(
          x,
          y
        )
      ){
        return;
      }


      MOTION51.stallCustomers.push({

        x,
        y,

        seed:index*1.4,

        color:
          m51Pick(
            M51_CLOTHES,
            index+4
          ),

        skin:
          m51Pick(
            M51_SKIN,
            index+2
          ),

        hair:
          m51Pick(
            M51_HAIR,
            index+1
          ),

        mode:
          index%4===0
          ? "eat"
          : "wait"

      });

    }

  );

}


// ============================================================
// VEHICLES
// ============================================================

function m51CreateVehicles(){

  if(
    !MOTION51_CONFIG.vehicles
  ){
    return;
  }


  const map=m51Map();

  const mapWidth=
    map.grid[0].length*TILE;


  if(currentMapId==="food"){

    MOTION51.vehicles.push({

      x:-90,
      y:12*TILE+5,

      vx:1,

      speed:45,

      type:"scooter",

      mapWidth,

      seed:1

    });


    MOTION51.vehicles.push({

      x:mapWidth+80,
      y:27*TILE+3,

      vx:-1,

      speed:28,

      type:"bike",

      mapWidth,

      seed:4

    });

  }


  else if(
    currentMapId==="market"
  ){

    MOTION51.vehicles.push({

      x:-100,
      y:13*TILE+2,

      vx:1,

      speed:30,

      type:"bike",

      mapWidth,

      seed:7

    });

  }


  else if(
    currentMapId==="hotel"
  ){

    MOTION51.vehicles.push({

      x:-100,
      y:16*TILE+5,

      vx:1,

      speed:42,

      type:"scooter",

      mapWidth,

      seed:9

    });


    if(MOTION51_CONFIG.taxi){

      MOTION51.vehicles.push({

        x:-150,
        y:25*TILE+2,

        vx:1,

        speed:31,

        type:"taxi",

        mapWidth,

        seed:12,

        taxiTimer:0

      });

    }

  }

}


// ============================================================
// VEHICLE UPDATE
// ============================================================

function m51UpdateVehicles(dt){

  for(
    const vehicle of
    MOTION51.vehicles
  ){

    /*
      ホテル前のタクシーは
      中央付近で少し停車する。
    */

    if(vehicle.type==="taxi"){

      const stopX=
        vehicle.mapWidth*.52;


      if(
        vehicle.taxiTimer<=0 &&
        vehicle.x>stopX-4 &&
        vehicle.x<stopX+8
      ){

        vehicle.taxiTimer=3.2;

      }


      if(vehicle.taxiTimer>0){

        vehicle.taxiTimer-=dt;

        continue;

      }

    }


    vehicle.x+=
      vehicle.vx*
      vehicle.speed*
      dt;


    if(
      vehicle.vx>0 &&
      vehicle.x>
      vehicle.mapWidth+120
    ){

      vehicle.x=-140;

      if(vehicle.type==="taxi"){
        vehicle.taxiTimer=0;
      }

    }


    if(
      vehicle.vx<0 &&
      vehicle.x<-130
    ){

      vehicle.x=
        vehicle.mapWidth+100;

    }

  }

}


// ============================================================
// BOATS
// ============================================================

function m51CreateBoats(){

  if(
    !MOTION51_CONFIG.boats
  ){
    return;
  }


  MOTION51.boats=[

    {
      x:-110,
      y:8*TILE,
      speed:13,
      dir:1,
      seed:0
    },

    {
      x:14*TILE,
      y:24*TILE,
      speed:8,
      dir:-1,
      seed:3.5
    }

  ];

}


// ============================================================
// BOAT UPDATE
// ============================================================

function m51UpdateBoats(dt){

  if(currentMapId!=="lake"){
    return;
  }


  const width=
    16*TILE;


  for(
    const boat of
    MOTION51.boats
  ){

    boat.x+=
      boat.speed*
      boat.dir*
      dt;


    if(
      boat.dir>0 &&
      boat.x>width+110
    ){
      boat.x=-130;
    }


    if(
      boat.dir<0 &&
      boat.x<-140
    ){
      boat.x=width+100;
    }

  }

}


// ============================================================
// PARTICLES
// ============================================================

function m51UpdateParticles(dt){

  if(
    !MOTION51_CONFIG.particles
  ){
    return;
  }


  /*
    屋外だけ。
  */

  if(!m51Indoor()){

    /*
      落ち葉・紙片。
      毎フレーム大量生成しない。
    */

    if(
      Math.random()<
      dt*.65
    ){

      const map=m51Map();

      const x=
        camera.x+
        Math.random()*
        canvas.width;


      const y=
        camera.y-
        15;


      if(
        !m51InsideBuilding(
          x,y,0
        )
      ){

        MOTION51.particles.push({

          x,
          y,

          vx:
            4+
            Math.random()*7,

          vy:
            9+
            Math.random()*9,

          life:
            5+
            Math.random()*3,

          type:
            currentMapId==="lake"
            ? "leaf"
            : "paper",

          seed:
            Math.random()*10

        });

      }

    }

  }


  for(
    const p of
    MOTION51.particles
  ){

    p.life-=dt;

    p.x+=p.vx*dt;
    p.y+=p.vy*dt;

  }


  MOTION51.particles=
    MOTION51.particles.filter(
      p=>p.life>0
    );


  if(
    MOTION51.particles.length>30
  ){

    MOTION51.particles=
      MOTION51.particles.slice(-30);

  }


  /*
    西湖の波紋
  */

  if(currentMapId==="lake"){

    if(
      Math.random()<
      dt*.55
    ){

      MOTION51.ripples.push({

        x:
          Math.random()*
          15*TILE,

        y:
          Math.random()*
          (
            m51Map().grid.length*
            TILE
          ),

        radius:2,

        life:2.3

      });

    }


    for(
      const ripple of
      MOTION51.ripples
    ){

      ripple.radius+=
        dt*7;

      ripple.life-=dt;

    }


    MOTION51.ripples=
      MOTION51.ripples.filter(
        r=>r.life>0
      );


    if(
      MOTION51.ripples.length>18
    ){

      MOTION51.ripples=
        MOTION51.ripples.slice(-18);

    }

  }

}


// ============================================================
// UPDATE ALL
// ============================================================

function m51Update(dt){

  if(
    !MOTION51.initialized ||
    MOTION51.mapId!==
    currentMapId
  ){

    m51Initialize();

  }


  m51UpdatePedestrians(dt);

  m51UpdateVehicles(dt);

  m51UpdateBoats(dt);

  m51UpdateParticles(dt);

}


// ============================================================
// PERSON
// ============================================================

function m51DrawPerson(
  x,
  y,
  data,
  moving,
  time
){

  x=Math.floor(x);
  y=Math.floor(y);


  const step=
    moving
    ? Math.round(
        Math.sin(time*9)*1.5
      )
    : 0;


  /*
    shadow
  */

  ctx.fillStyle=
    "rgba(0,0,0,.27)";

  ctx.fillRect(
    x+3,
    y+25,
    17,
    4
  );


  /*
    legs
  */

  ctx.fillStyle="#25252c";

  ctx.fillRect(
    x+5,
    y+20+step,
    5,
    7
  );

  ctx.fillRect(
    x+13,
    y+20-step,
    5,
    7
  );


  /*
    clothes
  */

  ctx.fillStyle=
    data.color||
    "#5a6070";

  ctx.fillRect(
    x+3,
    y+9,
    17,
    13
  );


  /*
    arms
  */

  ctx.fillStyle=
    data.skin||
    "#dfaa80";


  const arm=
    data.arm||0;


  ctx.fillRect(
    x+1,
    y+11+arm,
    3,
    8
  );

  ctx.fillRect(
    x+20,
    y+11-arm,
    3,
    8
  );


  /*
    apron
  */

  if(data.apron){

    ctx.fillStyle="#d4c5a8";

    ctx.fillRect(
      x+7,
      y+12,
      9,
      9
    );

  }


  /*
    face
  */

  ctx.fillStyle=
    data.skin||
    "#dfaa80";

  ctx.fillRect(
    x+6,
    y+2,
    11,
    9
  );


  /*
    hair
  */

  ctx.fillStyle=
    data.hair||
    "#211a1b";

  ctx.fillRect(
    x+5,
    y,
    13,
    5
  );


  if(data.direction==="left"){

    ctx.fillRect(
      x+5,
      y+4,
      4,
      5
    );

  }


  if(data.direction==="right"){

    ctx.fillRect(
      x+14,
      y+4,
      4,
      5
    );

  }


  if(data.direction==="down"){

    ctx.fillStyle="#322522";

    ctx.fillRect(
      x+8,
      y+6,
      2,
      2
    );

    ctx.fillRect(
      x+14,
      y+6,
      2,
      2
    );

  }

}


// ============================================================
// PEDESTRIAN DRAW
// ============================================================

function m51DrawPedestrians(time){

  const sorted=[
    ...MOTION51.pedestrians
  ].sort(
    (a,b)=>a.y-b.y
  );


  for(const actor of sorted){

    const x=
      m51SX(actor.x);

    const y=
      m51SY(actor.y);


    if(
      !m51Visible(x,y)
    ){
      continue;
    }


    const moving=
      actor.vx!==0 ||
      actor.vy!==0;


    m51DrawPerson(
      x,
      y,
      actor,
      moving,
      time+
      actor.seed
    );


    /*
      スマホ
    */

    if(
      actor.activity==="phone" &&
      !moving
    ){

      ctx.fillStyle="#8db3c5";

      ctx.fillRect(
        x+10,
        y+12,
        4,
        6
      );

      ctx.fillStyle="#d7e7ed";

      ctx.fillRect(
        x+11,
        y+13,
        2,
        3
      );

    }

  }

}


// ============================================================
// SOCIAL GROUP DRAW
// ============================================================

function m51DrawSocialGroups(time){

  for(
    const group of
    MOTION51.socialGroups
  ){

    const x=
      m51SX(group.x);

    const y=
      m51SY(group.y);


    if(
      !m51Visible(x,y)
    ){
      continue;
    }


    if(group.type==="photo"){

      /*
        西湖を撮影している観光客。
      */

      m51DrawPerson(

        x-10,
        y,

        {
          color:"#536b7b",
          skin:"#e2ae84",
          hair:"#211b1d",
          direction:"left"
        },

        false,
        time

      );


      ctx.fillStyle="#27292d";

      ctx.fillRect(
        x-2,
        y+9,
        7,
        5
      );


      /*
        カメラ画面
      */

      ctx.fillStyle="#7ea8ba";

      ctx.fillRect(
        x-1,
        y+10,
        4,
        2
      );


      /*
        時々撮影光。
      */

      if(
        Math.sin(
          time*.8+
          group.seed
        )>.985
      ){

        ctx.fillStyle=
          "rgba(255,240,190,.55)";

        ctx.fillRect(
          x-5,
          y+5,
          15,
          12
        );

      }

    }

    else{

      /*
        立ち話する2人。
      */

      m51DrawPerson(

        x-18,
        y,

        {
          color:"#75534c",
          skin:"#dda47d",
          hair:"#21191a",
          direction:"right"
        },

        false,
        time

      );


      m51DrawPerson(

        x+8,
        y+2,

        {
          color:"#4e6875",
          skin:"#e3ae86",
          hair:"#30221e",
          direction:"left"
        },

        false,
        time+.5

      );


      /*
        会話を表す小さなドット。
      */

      const talk=
        Math.floor(
          time*2+
          group.seed
        )%3;


      ctx.fillStyle=
        "rgba(235,220,185,.55)";


      for(
        let i=0;
        i<talk;
        i++
      ){

        ctx.fillRect(
          x-1+i*5,
          y-8-i*2,
          2,
          2
        );

      }

    }

  }

}


// ============================================================
// STALL WORKERS
// ============================================================

function m51DrawStallWorkers(time){

  if(
    !MOTION51_CONFIG.stallWorkers
  ){
    return;
  }


  const stalls=
    m51Map().stalls||[];


  stalls.forEach(
    (stall,index)=>{

      const wx=
        (
          stall.x+
          stall.width/2
        )*TILE-
        10;


      const wy=
        stall.y*TILE+
        20;


      const x=m51SX(wx);
      const y=m51SY(wy);


      if(
        !m51Visible(x,y)
      ){
        return;
      }


      const motion=
        Math.sin(
          time*5+
          index*1.7
        )>0
        ? 1
        : -1;


      m51DrawPerson(

        x,
        y,

        {
          color:
            index%2
            ? "#65483d"
            : "#465e67",

          skin:
            m51Pick(
              M51_SKIN,
              index
            ),

          hair:
            m51Pick(
              M51_HAIR,
              index
            ),

          direction:"down",

          apron:true,

          arm:motion

        },

        false,

        time

      );


      /*
        食材
      */

      ctx.fillStyle="#d69b55";

      ctx.fillRect(
        x+1,
        y+29,
        21,
        3
      );


      /*
        鉄板系屋台の炎。
        常時ではなく一瞬だけ。
      */

      if(
        (
          stall.type==="food" ||
          stall.type==="shaokao"
        ) &&
        Math.sin(
          time*2.8+
          index*2.1
        )>.91
      ){

        m51DrawCookingFlame(
          x+11,
          y+27,
          time,
          index
        );

      }

    }
  );

}


// ============================================================
// COOKING FLAME
// ============================================================

function m51DrawCookingFlame(
  x,
  y,
  time,
  seed
){

  const h=
    5+
    Math.abs(
      Math.sin(
        time*8+
        seed
      )
    )*7;


  ctx.fillStyle=
    "rgba(236,91,38,.75)";

  ctx.fillRect(
    x-4,
    y-h,
    8,
    h
  );


  ctx.fillStyle=
    "rgba(255,183,62,.85)";

  ctx.fillRect(
    x-2,
    y-h+3,
    4,
    Math.max(
      3,
      h-4
    )
  );

}


// ============================================================
// STALL CUSTOMERS DRAW
// ============================================================

function m51DrawStallCustomers(time){

  for(
    const customer of
    MOTION51.stallCustomers
  ){

    const x=
      m51SX(customer.x);

    const y=
      m51SY(customer.y);


    if(
      !m51Visible(x,y)
    ){
      continue;
    }


    m51DrawPerson(

      x,
      y,

      {
        color:customer.color,
        skin:customer.skin,
        hair:customer.hair,
        direction:"up"
      },

      false,

      time+
      customer.seed

    );


    /*
      食べている客。
    */

    if(
      customer.mode==="eat"
    ){

      const hand=
        Math.sin(
          time*4+
          customer.seed
        );


      ctx.fillStyle=
        customer.skin;


      ctx.fillRect(
        x+16,
        y+
        (
          hand>0
          ? 8
          : 13
        ),
        3,
        3
      );


      /*
        小さな器。
      */

      ctx.fillStyle="#e4d0a5";

      ctx.fillRect(
        x+8,
        y+16,
        8,
        3
      );

    }

  }

}


// ============================================================
// VEHICLE DRAW
// ============================================================

function m51DrawVehicles(time){

  for(
    const vehicle of
    MOTION51.vehicles
  ){

    const x=
      m51SX(vehicle.x);

    const y=
      m51SY(vehicle.y);


    if(
      !m51Visible(
        x,y,160
      )
    ){
      continue;
    }


    if(vehicle.type==="scooter"){

      m51DrawScooter(
        x,
        y,
        vehicle.vx,
        time+
        vehicle.seed
      );

    }

    else if(vehicle.type==="bike"){

      m51DrawBike(
        x,
        y,
        vehicle.vx,
        time+
        vehicle.seed
      );

    }

    else{

      m51DrawTaxi(
        x,
        y,
        vehicle.vx,
        time
      );

    }

  }

}


// ============================================================
// SCOOTER
// ============================================================

function m51DrawScooter(
  x,
  y,
  direction,
  time
){

  ctx.save();


  if(direction<0){

    ctx.translate(
      x+36,
      0
    );

    ctx.scale(-1,1);

    x=0;

  }


  const bob=
    Math.round(
      Math.sin(time*9)
    );


  ctx.fillStyle=
    "rgba(0,0,0,.27)";

  ctx.fillRect(
    x+3,
    y+27,
    32,
    4
  );


  ctx.fillStyle="#18191d";

  ctx.fillRect(
    x+5,
    y+23,
    8,
    7
  );

  ctx.fillRect(
    x+26,
    y+23,
    8,
    7
  );


  ctx.fillStyle="#913c3c";

  ctx.fillRect(
    x+9,
    y+15,
    20,
    10
  );

  ctx.fillRect(
    x+20,
    y+10,
    9,
    9
  );


  ctx.fillStyle="#455e6b";

  ctx.fillRect(
    x+13,
    y+4+bob,
    10,
    12
  );


  ctx.fillStyle="#dfa77f";

  ctx.fillRect(
    x+15,
    y-2+bob,
    8,
    7
  );


  ctx.fillStyle="#272126";

  ctx.fillRect(
    x+14,
    y-4+bob,
    10,
    4
  );


  /*
    headlight
  */

  ctx.fillStyle="#ffd47a";

  ctx.fillRect(
    x+29,
    y+13,
    4,
    4
  );


  ctx.fillStyle=
    "rgba(255,213,120,.055)";

  ctx.beginPath();

  ctx.moveTo(
    x+33,
    y+14
  );

  ctx.lineTo(
    x+61,
    y+7
  );

  ctx.lineTo(
    x+61,
    y+24
  );

  ctx.closePath();

  ctx.fill();


  ctx.restore();

}


// ============================================================
// BIKE
// ============================================================

function m51DrawBike(
  x,
  y,
  direction,
  time
){

  ctx.save();


  if(direction<0){

    ctx.translate(
      x+40,
      0
    );

    ctx.scale(-1,1);

    x=0;

  }


  ctx.strokeStyle="#aaa198";

  ctx.lineWidth=2;


  ctx.beginPath();

  ctx.arc(
    x+8,
    y+24,
    7,
    0,
    Math.PI*2
  );

  ctx.arc(
    x+31,
    y+24,
    7,
    0,
    Math.PI*2
  );

  ctx.moveTo(
    x+8,
    y+24
  );

  ctx.lineTo(
    x+17,
    y+13
  );

  ctx.lineTo(
    x+31,
    y+24
  );

  ctx.lineTo(
    x+15,
    y+24
  );

  ctx.lineTo(
    x+8,
    y+24
  );

  ctx.stroke();


  const bob=
    Math.round(
      Math.sin(time*8)
    );


  ctx.fillStyle="#70566e";

  ctx.fillRect(
    x+14,
    y+4+bob,
    10,
    12
  );


  ctx.fillStyle="#dfa77f";

  ctx.fillRect(
    x+16,
    y-2+bob,
    8,
    7
  );


  ctx.fillStyle="#251f21";

  ctx.fillRect(
    x+15,
    y-4+bob,
    10,
    4
  );


  ctx.restore();

}


// ============================================================
// TAXI
// ============================================================

function m51DrawTaxi(
  x,
  y,
  direction,
  time
){

  ctx.save();


  if(direction<0){

    ctx.translate(
      x+64,
      0
    );

    ctx.scale(-1,1);

    x=0;

  }


  ctx.fillStyle=
    "rgba(0,0,0,.30)";

  ctx.fillRect(
    x+4,
    y+28,
    57,
    5
  );


  ctx.fillStyle="#c69b3f";

  ctx.fillRect(
    x+3,
    y+14,
    58,
    15
  );


  ctx.fillRect(
    x+15,
    y+7,
    32,
    10
  );


  ctx.fillStyle="#26343e";

  ctx.fillRect(
    x+19,
    y+9,
    11,
    7
  );

  ctx.fillRect(
    x+32,
    y+9,
    11,
    7
  );


  ctx.fillStyle="#191b20";

  ctx.fillRect(
    x+10,
    y+25,
    9,
    7
  );

  ctx.fillRect(
    x+46,
    y+25,
    9,
    7
  );


  /*
    taxi roof sign
  */

  ctx.fillStyle="#f2d47d";

  ctx.fillRect(
    x+26,
    y+3,
    12,
    5
  );


  /*
    brake / head lights
  */

  ctx.fillStyle="#ffd58a";

  ctx.fillRect(
    x+58,
    y+18,
    4,
    5
  );


  ctx.restore();

}


// ============================================================
// BOATS
// ============================================================

function m51DrawBoats(time){

  if(currentMapId!=="lake"){
    return;
  }


  for(
    const boat of
    MOTION51.boats
  ){

    let x=
      m51SX(boat.x);

    const y=
      m51SY(boat.y);


    if(
      !m51Visible(
        x,y,160
      )
    ){
      continue;
    }


    ctx.save();


    if(boat.dir<0){

      ctx.translate(
        x+88,
        0
      );

      ctx.scale(-1,1);

      x=0;

    }


    const bob=
      Math.sin(
        time*1.6+
        boat.seed
      )*1.5;


    /*
      reflection
  */

    ctx.fillStyle=
      "rgba(226,142,63,.075)";

    ctx.fillRect(
      x+20,
      y+35+bob,
      43,
      3
    );

    ctx.fillRect(
      x+29,
      y+41+bob,
      25,
      2
    );


    /*
      shadow
    */

    ctx.fillStyle=
      "rgba(2,15,22,.38)";

    ctx.fillRect(
      x+8,
      y+30+bob,
      69,
      5
    );


    /*
      hull
    */

    ctx.fillStyle="#452d25";

    ctx.fillRect(
      x+5,
      y+22+bob,
      73,
      8
    );


    ctx.fillStyle="#855238";

    ctx.fillRect(
      x+13,
      y+17+bob,
      55,
      7
    );


    /*
      cabin
    */

    ctx.fillStyle="#57362a";

    ctx.fillRect(
      x+20,
      y+10+bob,
      41,
      9
    );


    /*
      warm windows
    */

    ctx.fillStyle="#eaa14c";

    for(let n=0;n<4;n++){

      ctx.fillRect(
        x+24+n*9,
        y+12+bob,
        6,
        5
      );

    }


    /*
      passenger silhouettes
    */

    ctx.fillStyle="#29232a";

    ctx.fillRect(
      x+26,
      y+10+bob,
      3,
      5
    );

    ctx.fillRect(
      x+43,
      y+10+bob,
      3,
      5
    );


    /*
      roof
    */

    ctx.fillStyle="#202a34";

    ctx.fillRect(
      x+17,
      y+6+bob,
      48,
      5
    );


    ctx.fillStyle="#35424b";

    ctx.fillRect(
      x+23,
      y+2+bob,
      36,
      5
    );


    /*
      lanterns
    */

    ctx.fillStyle="#bd4939";

    ctx.fillRect(
      x+17,
      y+12+bob,
      5,
      7
    );

    ctx.fillRect(
      x+62,
      y+12+bob,
      5,
      7
    );


    ctx.fillStyle="#f4ad55";

    ctx.fillRect(
      x+18,
      y+13+bob,
      3,
      4
    );

    ctx.fillRect(
      x+63,
      y+13+bob,
      3,
      4
    );


    /*
      wake
    */

    ctx.fillStyle=
      "rgba(119,187,203,.20)";

    ctx.fillRect(
      x-15,
      y+31+bob,
      20,
      2
    );

    ctx.fillRect(
      x-28,
      y+35+bob,
      30,
      1
    );


    ctx.restore();

  }

}


// ============================================================
// WILLOW
// ============================================================

function m51DrawWillows(time){

  if(
    !MOTION51_CONFIG.willow ||
    currentMapId!=="lake"
  ){
    return;
  }


  const props=
    m51Map().props||[];


  props.forEach(
    (prop,index)=>{

      if(prop.type!=="willow"){
        return;
      }


      const x=
        m51SX(
          prop.x*TILE
        );

      const y=
        m51SY(
          prop.y*TILE
        );


      if(
        !m51Visible(x,y)
      ){
        return;
      }


      const sway=
        Math.sin(
          time*.85+
          index*1.4
        )*3;


      for(
        let n=0;
        n<6;
        n++
      ){

        const bx=
          x+
          2+
          n*5;


        const offset=
          sway*
          (
            .55+
            n*.06
          );


        ctx.fillStyle=
          "rgba(42,92,62,.72)";

        ctx.fillRect(
          bx+offset,
          y+6,
          2,
          20+
          (n%3)*5
        );


        ctx.fillStyle=
          "rgba(66,116,72,.65)";

        ctx.fillRect(
          bx-2+offset,
          y+14+n,
          5,
          3
        );

      }

    }
  );

}


// ============================================================
// RIPPLES
// ============================================================

function m51DrawRipples(){

  if(currentMapId!=="lake"){
    return;
  }


  for(
    const ripple of
    MOTION51.ripples
  ){

    const x=
      m51SX(ripple.x);

    const y=
      m51SY(ripple.y);


    if(
      !m51Visible(x,y)
    ){
      continue;
    }


    ctx.strokeStyle=
      `rgba(112,178,196,${
        Math.max(
          0,
          ripple.life*.055
        )
      })`;


    ctx.lineWidth=1;


    ctx.beginPath();

    ctx.ellipse(
      x,
      y,
      ripple.radius*1.8,
      ripple.radius*.55,
      0,
      0,
      Math.PI*2
    );

    ctx.stroke();

  }

}


// ============================================================
// WATER REFLECTIONS
// ============================================================

function m51DrawWaterReflections(time){

  if(currentMapId!=="lake"){
    return;
  }


  for(let i=0;i<17;i++){

    const worldX=
      40+
      (
        i%5
      )*82;


    const worldY=
      35+
      i*67;


    const x=
      m51SX(
        worldX+
        Math.sin(
          time*.8+i
        )*7
      );


    const y=
      m51SY(worldY);


    ctx.fillStyle=
      i%4===0
      ? "rgba(239,165,75,.08)"
      : "rgba(89,159,181,.09)";


    ctx.fillRect(
      x,
      y,
      20+
      (i%3)*10,
      2
    );

  }

}


// ============================================================
// PARTICLES
// ============================================================

function m51DrawParticles(time){

  for(
    const p of
    MOTION51.particles
  ){

    const x=
      m51SX(p.x);

    const y=
      m51SY(p.y);


    if(
      !m51Visible(x,y)
    ){
      continue;
    }


    const sway=
      Math.sin(
        time*2+
        p.seed
      )*4;


    if(p.type==="leaf"){

      ctx.fillStyle=
        "rgba(100,119,63,.65)";

      ctx.fillRect(
        x+sway,
        y,
        3,
        2
      );

    }

    else{

      ctx.fillStyle=
        "rgba(188,171,143,.40)";

      ctx.fillRect(
        x+sway,
        y,
        3,
        2
      );

    }

  }

}


// ============================================================
// EXTRA STEAM
// ============================================================

function m51DrawSteam(time){

  const stalls=
    m51Map().stalls||[];


  stalls.forEach(
    (stall,index)=>{

      if(
        stall.type!=="food" &&
        stall.type!=="shaokao"
      ){
        return;
      }


      const x=
        (
          stall.x+
          stall.width/2
        )*TILE-
        camera.x;


      const y=
        stall.y*TILE-
        camera.y+
        15;


      if(
        !m51Visible(x,y)
      ){
        return;
      }


      for(let n=0;n<3;n++){

        const phase=
          (
            time*12+
            n*11+
            index*4
          )%34;


        const drift=
          Math.sin(
            time*1.8+
            n+
            index
          )*4;


        const alpha=
          Math.max(
            0,
            .28-
            phase/145
          );


        ctx.fillStyle=
          `rgba(236,229,215,${alpha})`;


        ctx.fillRect(
          Math.floor(
            x+
            drift+
            n*6-
            7
          ),

          Math.floor(
            y-phase
          ),

          2,
          5
        );

      }

    }
  );

}


// ============================================================
// LIGHTING
// ============================================================

function m51DrawLights(time){

  if(
    !MOTION51_CONFIG.lighting
  ){
    return;
  }


  /*
    屋台の暖色光
  */

  if(!m51Indoor()){

    const stalls=
      m51Map().stalls||[];


    ctx.save();

    ctx.globalCompositeOperation=
      "lighter";


    stalls.forEach(
      (stall,index)=>{

        const x=
          (
            stall.x+
            stall.width/2
          )*TILE-
          camera.x;


        const y=
          stall.y*TILE-
          camera.y+
          20;


        if(
          !m51Visible(
            x,y,100
          )
        ){
          return;
        }


        /*
          わずかな明滅。
          強くチカチカさせない。
        */

        const flicker=
          1+
          Math.sin(
            time*1.7+
            index*2
          )*.04;


        const radius=
          52*flicker;


        const g=
          ctx.createRadialGradient(
            x,y,
            2,
            x,y,
            radius
          );


        g.addColorStop(
          0,
          "rgba(255,176,79,.085)"
        );

        g.addColorStop(
          .45,
          "rgba(255,127,52,.035)"
        );

        g.addColorStop(
          1,
          "rgba(255,100,30,0)"
        );


        ctx.fillStyle=g;


        ctx.fillRect(
          x-radius,
          y-radius,
          radius*2,
          radius*2
        );

      }
    );


    ctx.restore();

  }


  /*
    屋内のごく薄い光。
  */

  else{

    const theme=
      m51Map().theme||"";


    if(theme==="hotel"){

      const g=
        ctx.createRadialGradient(
          canvas.width/2,
          90,
          20,
          canvas.width/2,
          90,
          270
        );


      g.addColorStop(
        0,
        "rgba(255,205,119,.04)"
      );

      g.addColorStop(
        1,
        "rgba(255,190,100,0)"
      );


      ctx.fillStyle=g;

      ctx.fillRect(
        0,0,
        canvas.width,
        350
      );

    }


    if(theme==="drink"){

      ctx.fillStyle=
        `rgba(65,178,151,${
          .012+
          Math.sin(time*2)*.003
        })`;

      ctx.fillRect(
        0,0,
        canvas.width,
        canvas.height
      );

    }

  }

}


// ============================================================
// UPDATE HOOK
// ============================================================

const M51_originalUpdateNPCs=
  updateNPCs;


updateNPCs=
function(dt){

  M51_originalUpdateNPCs(dt);

  m51Update(dt);

};


// ============================================================
// PROPS HOOK
//
// 水面系は人物より後ろに置く。
// ============================================================

const M51_originalDrawProps=
  drawProps;


drawProps=
function(){

  const time=
    performance.now()/1000;


  m51DrawWaterReflections(time);

  m51DrawRipples();


  M51_originalDrawProps();


  /*
    元の柳の上から
    揺れる細枝を追加。
  */

  m51DrawWillows(time);


  /*
    落ち葉・紙片
  */

  m51DrawParticles(time);

};


// ============================================================
// ENTITY HOOK
// ============================================================

const M51_originalDrawEntities=
  drawEntities;


drawEntities=
function(time){

  /*
    屋台内部。
    通常NPCより後ろ。
  */

  m51DrawStallWorkers(time);


  /*
    背景歩行者。
  */

  m51DrawPedestrians(time);


  /*
    意味のある固定人物。
  */

  m51DrawSocialGroups(time);


  /*
    道路車両。
  */

  m51DrawVehicles(time);


  /*
    西湖。
  */

  m51DrawBoats(time);


  /*
    本来のNPCとプレイヤー。
    会話できる人物はこちら。
  */

  M51_originalDrawEntities(time);


  /*
    屋台の客。
  */

  m51DrawStallCustomers(time);


  /*
    湯気は人物の少し前。
  */

  m51DrawSteam(time);

};


// ============================================================
// LIGHTING HOOK
// ============================================================

const M51_originalDrawLighting=
  drawLighting;


drawLighting=
function(){

  M51_originalDrawLighting();


  m51DrawLights(
    performance.now()/1000
  );

};


// ============================================================
// INITIALIZE
// ============================================================

m51Initialize();


console.log(
  "杭州探索録 Motion System Ver.5.1 loaded"
);
