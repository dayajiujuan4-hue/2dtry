"use strict";

/*
==========================================================
 武林夜市 Ver.5 - MOTION SYSTEM
 motion.js

 ・屋台店員
 ・食事客
 ・立ち話する客
 ・通行人
 ・走行スクーター
 ・自転車
 ・西湖の遊覧船
 ・柳の揺れ
 ・提灯の追加揺れ
 ・屋台の調理アニメーション
 ・店の暖色光
 ・西湖の水面反射

 gameplay / collision / vocabulary には干渉しません。
==========================================================
*/


// ======================================================
// CONFIG
// ======================================================

const MOTION_CONFIG={

  crowd:true,
  stallWorkers:true,
  vehicles:true,
  boats:true,
  willow:true,
  lighting:true,

  maxCrowd:18,

  crowdSpeedMin:9,
  crowdSpeedMax:19

};


// ======================================================
// STATE
// ======================================================

const MOTION_STATE={

  initialized:false,

  currentMap:null,

  crowd:[],

  vehicles:[],

  boats:[],

  particles:[]

};


// ======================================================
// UTILITY
// ======================================================

function motionHash(n){

  const x=
    Math.sin(n*91.731)*43758.5453;

  return x-Math.floor(x);

}


function motionPick(array,index){

  return array[
    Math.abs(index)%array.length
  ];

}


function motionMap(){

  return getCurrentMap();

}


function motionIsIndoor(){

  return motionMap().ambient==="indoor";

}


function motionScreenX(worldX){

  return worldX-camera.x;

}


function motionScreenY(worldY){

  return worldY-camera.y;

}


function motionVisible(
  x,
  y,
  margin=80
){

  return !(
    x<-margin ||
    y<-margin ||
    x>canvas.width+margin ||
    y>canvas.height+margin
  );

}


// ======================================================
// COLORS
// ======================================================

const CROWD_COLORS=[

  "#8d4a46",
  "#3f6174",
  "#70604d",
  "#56664e",
  "#74506a",
  "#8a633f",
  "#4c566e",
  "#805c51"

];


const CROWD_HAIR=[

  "#1d1718",
  "#2b201c",
  "#34251f",
  "#17191d"

];


const CROWD_SKIN=[

  "#e0ad85",
  "#d59b74",
  "#e8b891",
  "#c98f69"

];


// ======================================================
// INITIALIZE MAP MOTION
// ======================================================

function initializeMotionMap(){

  MOTION_STATE.currentMap=
    currentMapId;

  MOTION_STATE.crowd=[];

  MOTION_STATE.vehicles=[];

  MOTION_STATE.boats=[];

  MOTION_STATE.particles=[];


  if(!motionIsIndoor()){

    createAmbientCrowd();

    createVehicles();

  }


  if(currentMapId==="lake"){

    createBoats();

  }


  MOTION_STATE.initialized=true;

}


// ======================================================
// CROWD CREATION
// ======================================================

function createAmbientCrowd(){

  if(!MOTION_CONFIG.crowd){
    return;
  }


  const map=
    motionMap();


  const candidates=[];


  /*
    道路・広場タイルから
    通行人を配置できそうな場所を探す
  */

  for(
    let y=2;
    y<map.grid.length-2;
    y+=2
  ){

    for(
      let x=2;
      x<map.grid[0].length-2;
      x+=2
    ){

      const tile=
        map.grid[y][x];


      if(
        tile===T.ROAD ||
        tile===T.PLAZA
      ){

        candidates.push({
          x:x*TILE+6,
          y:y*TILE+4
        });

      }

    }

  }


  const amount=
    Math.min(
      MOTION_CONFIG.maxCrowd,
      Math.floor(
        candidates.length/8
      )
    );


  for(
    let i=0;
    i<amount;
    i++
  ){

    const index=
      Math.floor(
        motionHash(
          i*17+
          currentMapId.length*31
        )*
        candidates.length
      );


    const spot=
      candidates[index];


    if(!spot){
      continue;
    }


    const actor={

      x:spot.x,
      y:spot.y,

      homeX:spot.x,
      homeY:spot.y,

      width:20,
      height:26,

      color:
        motionPick(
          CROWD_COLORS,
          i
        ),

      hair:
        motionPick(
          CROWD_HAIR,
          i*3
        ),

      skin:
        motionPick(
          CROWD_SKIN,
          i*5
        ),

      direction:
        motionPick(
          [
            "down",
            "left",
            "right",
            "up"
          ],
          i
        ),

      speed:
        MOTION_CONFIG.crowdSpeedMin+
        motionHash(i*8)*
        (
          MOTION_CONFIG.crowdSpeedMax-
          MOTION_CONFIG.crowdSpeedMin
        ),

      vx:0,
      vy:0,

      timer:
        .5+
        motionHash(i*13)*3,

      idle:
        motionHash(i*21)>.68,

      range:
        65+
        motionHash(i*37)*100,

      seed:i*1.37

    };


    MOTION_STATE.crowd.push(
      actor
    );

  }

}


// ======================================================
// CROWD UPDATE
// ======================================================

function updateAmbientCrowd(dt){

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
    MOTION_STATE.crowd
  ){

    actor.timer-=dt;


    if(actor.timer<=0){

      actor.timer=
        .8+
        Math.random()*3.5;


      /*
        一部はその場で立ち止まる
      */

      if(Math.random()<.28){

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


    const nx=
      actor.x+
      actor.vx*
      actor.speed*
      dt;


    const ny=
      actor.y+
      actor.vy*
      actor.speed*
      dt;


    const distance=
      Math.hypot(
        nx-actor.homeX,
        ny-actor.homeY
      );


    if(distance>actor.range){

      actor.vx=
        Math.sign(
          actor.homeX-
          actor.x
        );

      actor.vy=
        Math.sign(
          actor.homeY-
          actor.y
        );


      if(
        Math.abs(
          actor.homeX-
          actor.x
        )>
        Math.abs(
          actor.homeY-
          actor.y
        )
      ){

        actor.vy=0;

      }

      else{

        actor.vx=0;

      }

    }


    /*
      建物・水・屋台などへ
      入らないようにする
    */

    if(
      !isSolidAtPixel(
        nx+10,
        ny+15
      )
    ){

      actor.x=nx;
      actor.y=ny;

    }

    else{

      actor.vx=0;
      actor.vy=0;

      actor.timer=.2;

    }

  }

}


// ======================================================
// VEHICLES
// ======================================================

function createVehicles(){

  if(!MOTION_CONFIG.vehicles){
    return;
  }


  if(
    currentMapId!=="food" &&
    currentMapId!=="market" &&
    currentMapId!=="hotel"
  ){
    return;
  }


  const map=
    motionMap();


  const mapWidth=
    map.grid[0].length*TILE;


  if(currentMapId==="food"){

    MOTION_STATE.vehicles.push(

      createVehicle(
        -80,
        12*TILE+3,
        1,
        0,
        "scooter",
        mapWidth
      ),

      createVehicle(
        mapWidth+90,
        27*TILE+2,
        -1,
        0,
        "bike",
        mapWidth
      )

    );

  }


  if(currentMapId==="market"){

    MOTION_STATE.vehicles.push(

      createVehicle(
        -120,
        13*TILE,
        1,
        0,
        "bike",
        mapWidth
      )

    );

  }


  if(currentMapId==="hotel"){

    MOTION_STATE.vehicles.push(

      createVehicle(
        -150,
        17*TILE,
        1,
        0,
        "scooter",
        mapWidth
      )

    );

  }

}


function createVehicle(
  x,
  y,
  vx,
  vy,
  type,
  mapWidth
){

  return{

    x,
    y,

    vx,
    vy,

    type,

    speed:
      type==="scooter"
      ? 48
      : 30,

    mapWidth,

    seed:
      Math.random()*10

  };

}


// ======================================================
// VEHICLE UPDATE
// ======================================================

function updateVehicles(dt){

  for(
    const vehicle of
    MOTION_STATE.vehicles
  ){

    vehicle.x+=
      vehicle.vx*
      vehicle.speed*
      dt;


    vehicle.y+=
      vehicle.vy*
      vehicle.speed*
      dt;


    if(vehicle.vx>0){

      if(
        vehicle.x>
        vehicle.mapWidth+100
      ){

        vehicle.x=-100;

      }

    }

    else{

      if(vehicle.x<-120){

        vehicle.x=
          vehicle.mapWidth+100;

      }

    }

  }

}


// ======================================================
// BOATS
// ======================================================

function createBoats(){

  if(!MOTION_CONFIG.boats){
    return;
  }


  MOTION_STATE.boats=[

    {
      x:-100,
      y:8*TILE,
      speed:14,
      direction:1,
      seed:0
    },

    {
      x:13*TILE,
      y:23*TILE,
      speed:9,
      direction:-1,
      seed:4.7
    }

  ];

}


// ======================================================
// BOAT UPDATE
// ======================================================

function updateBoats(dt){

  if(currentMapId!=="lake"){
    return;
  }


  const waterWidth=
    16*TILE;


  for(
    const boat of
    MOTION_STATE.boats
  ){

    boat.x+=
      boat.speed*
      boat.direction*
      dt;


    if(boat.direction>0){

      if(
        boat.x>
        waterWidth+100
      ){

        boat.x=-120;

      }

    }

    else{

      if(boat.x<-130){

        boat.x=
          waterWidth+90;

      }

    }

  }

}


// ======================================================
// UPDATE
// ======================================================

function updateMotion(dt){

  if(
    !MOTION_STATE.initialized ||
    MOTION_STATE.currentMap!==
    currentMapId
  ){

    initializeMotionMap();

  }


  updateAmbientCrowd(dt);

  updateVehicles(dt);

  updateBoats(dt);

}


// ======================================================
// STALL WORKERS
// ======================================================

function drawStallWorkers(time){

  if(
    !MOTION_CONFIG.stallWorkers
  ){
    return;
  }


  const map=
    motionMap();


  if(!map.stalls){
    return;
  }


  map.stalls.forEach(
    (stall,index)=>{

      const worldX=
        (
          stall.x+
          stall.width/2
        )*TILE;


      const worldY=
        stall.y*TILE+23;


      const x=
        motionScreenX(worldX);

      const y=
        motionScreenY(worldY);


      if(
        !motionVisible(x,y)
      ){
        return;
      }


      const cooking=
        Math.sin(
          time*5+
          index*1.8
        );


      /*
        店員
      */

      drawMotionPerson(
        x-10,
        y+5,
        {
          color:
            index%2
            ? "#684a3d"
            : "#485d66",

          skin:"#dfaa80",

          hair:"#21191a",

          direction:"down",

          apron:true,

          arm:
            cooking>0
            ? 1
            : -1
        },
        true,
        time+
        index
      );


      /*
        調理台上の料理
      */

      if(
        stall.type==="food" ||
        stall.type==="shaokao"
      ){

        ctx.fillStyle="#d08343";

        ctx.fillRect(
          x-15,
          y+29,
          30,
          3
        );


        ctx.fillStyle="#d8b365";

        for(let n=0;n<3;n++){

          ctx.fillRect(
            x-10+n*9,
            y+25+
            Math.sin(
              time*4+n
            ),
            5,
            4
          );

        }

      }

    }
  );

}


// ======================================================
// PEOPLE AROUND STALLS
// ======================================================

function drawStallCustomers(time){

  const map=
    motionMap();


  if(
    motionIsIndoor() ||
    !map.stalls
  ){
    return;
  }


  map.stalls.forEach(
    (stall,index)=>{

      /*
        全屋台に客を置くと
        混みすぎるので間引く
      */

      if(index%2!==0){
        return;
      }


      const worldX=
        (
          stall.x+
          stall.width/2
        )*TILE+
        (
          index%3-1
        )*19;


      const worldY=
        stall.y*TILE+
        58;


      const x=
        motionScreenX(worldX);

      const y=
        motionScreenY(worldY);


      if(
        !motionVisible(x,y)
      ){
        return;
      }


      const bob=
        Math.sin(
          time*2+
          index
        )*.7;


      drawMotionPerson(

        x-10,
        y+bob,

        {
          color:
            motionPick(
              CROWD_COLORS,
              index+3
            ),

          skin:
            motionPick(
              CROWD_SKIN,
              index+1
            ),

          hair:
            motionPick(
              CROWD_HAIR,
              index
            ),

          direction:"up"

        },

        false,

        time

      );


      /*
        食べる動き
      */

      if(index%4===0){

        const hand=
          Math.sin(
            time*4+
            index
          )>0;


        if(hand){

          ctx.fillStyle="#e0ad85";

          ctx.fillRect(
            x+5,
            y+9,
            3,
            3
          );

        }

      }

    }
  );

}


// ======================================================
// AMBIENT CROWD DRAW
// ======================================================

function drawAmbientCrowd(time){

  const sorted=
    [...MOTION_STATE.crowd]
    .sort(
      (a,b)=>a.y-b.y
    );


  for(
    const actor of sorted
  ){

    const x=
      motionScreenX(
        actor.x
      );

    const y=
      motionScreenY(
        actor.y
      );


    if(
      !motionVisible(x,y)
    ){
      continue;
    }


    drawMotionPerson(

      x,
      y,

      actor,

      actor.vx!==0 ||
      actor.vy!==0,

      time+
      actor.seed

    );

  }

}


// ======================================================
// PERSON DRAW
// ======================================================

function drawMotionPerson(
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
    ? Math.sin(time*10)*1.5
    : 0;


  /*
    影
  */

  ctx.fillStyle=
    "rgba(0,0,0,.28)";

  ctx.fillRect(
    x+3,
    y+25,
    17,
    4
  );


  /*
    脚
  */

  ctx.fillStyle="#24242b";

  ctx.fillRect(
    x+5,
    y+20+
    Math.round(step),
    5,
    7
  );

  ctx.fillRect(
    x+13,
    y+20-
    Math.round(step),
    5,
    7
  );


  /*
    胴体
  */

  ctx.fillStyle=
    data.color||
    "#596070";

  ctx.fillRect(
    x+3,
    y+9,
    17,
    13
  );


  /*
    エプロン
  */

  if(data.apron){

    ctx.fillStyle="#d5c7aa";

    ctx.fillRect(
      x+7,
      y+12,
      9,
      9
    );

  }


  /*
    腕
  */

  ctx.fillStyle=
    data.skin||
    "#dfaa80";


  const armOffset=
    data.arm||0;


  ctx.fillRect(
    x+1,
    y+11+
    armOffset,
    3,
    8
  );

  ctx.fillRect(
    x+20,
    y+11-
    armOffset,
    3,
    8
  );


  /*
    顔
  */

  ctx.fillRect(
    x+6,
    y+2,
    11,
    9
  );


  /*
    髪
  */

  ctx.fillStyle=
    data.hair||
    "#20191b";

  ctx.fillRect(
    x+5,
    y,
    13,
    5
  );


  /*
    横向きなら髪の位置を変える
  */

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


  /*
    顔
  */

  if(data.direction==="down"){

    ctx.fillStyle="#322421";

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


// ======================================================
// VEHICLE DRAW
// ======================================================

function drawVehicles(time){

  for(
    const vehicle of
    MOTION_STATE.vehicles
  ){

    const x=
      motionScreenX(
        vehicle.x
      );

    const y=
      motionScreenY(
        vehicle.y
      );


    if(
      !motionVisible(x,y,120)
    ){
      continue;
    }


    if(vehicle.type==="scooter"){

      drawMovingScooter(
        x,
        y,
        vehicle.vx,
        time+
        vehicle.seed
      );

    }

    else{

      drawMovingBike(
        x,
        y,
        vehicle.vx,
        time+
        vehicle.seed
      );

    }

  }

}


// ======================================================
// SCOOTER
// ======================================================

function drawMovingScooter(
  x,
  y,
  direction,
  time
){

  const bounce=
    Math.sin(
      time*10
    );


  ctx.save();


  if(direction<0){

    ctx.translate(
      x+34,
      0
    );

    ctx.scale(
      -1,
      1
    );

    x=0;

  }


  ctx.fillStyle=
    "rgba(0,0,0,.28)";

  ctx.fillRect(
    x+3,
    y+26,
    31,
    4
  );


  /*
    wheels
  */

  ctx.fillStyle="#18191e";

  ctx.fillRect(
    x+5,
    y+23,
    8,
    7
  );

  ctx.fillRect(
    x+25,
    y+23,
    8,
    7
  );


  ctx.fillStyle="#76757b";

  ctx.fillRect(
    x+7,
    y+25,
    4,
    3
  );

  ctx.fillRect(
    x+27,
    y+25,
    4,
    3
  );


  /*
    body
  */

  ctx.fillStyle="#963f3f";

  ctx.fillRect(
    x+9,
    y+15,
    19,
    10
  );

  ctx.fillRect(
    x+19,
    y+10,
    9,
    9
  );


  ctx.fillStyle="#c55c4b";

  ctx.fillRect(
    x+12,
    y+14,
    10,
    4
  );


  /*
    rider
  */

  ctx.fillStyle="#3e5665";

  ctx.fillRect(
    x+13,
    y+4+bounce,
    10,
    12
  );


  ctx.fillStyle="#dda67f";

  ctx.fillRect(
    x+15,
    y-2+bounce,
    8,
    7
  );


  ctx.fillStyle="#262127";

  ctx.fillRect(
    x+14,
    y-4+bounce,
    10,
    4
  );


  /*
    head light
  */

  ctx.fillStyle="#ffd47b";

  ctx.fillRect(
    x+28,
    y+13,
    4,
    4
  );


  ctx.restore();

}


// ======================================================
// BIKE
// ======================================================

function drawMovingBike(
  x,
  y,
  direction,
  time
){

  ctx.save();


  if(direction<0){

    ctx.translate(
      x+38,
      0
    );

    ctx.scale(
      -1,
      1
    );

    x=0;

  }


  ctx.strokeStyle="#a9a095";

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
    x+30,
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
    x+30,
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


  /*
    rider
  */

  const bob=
    Math.sin(
      time*8
    );


  ctx.fillStyle="#6c526b";

  ctx.fillRect(
    x+14,
    y+4+bob,
    10,
    12
  );


  ctx.fillStyle="#dda67f";

  ctx.fillRect(
    x+16,
    y-2+bob,
    8,
    7
  );


  ctx.fillStyle="#231e20";

  ctx.fillRect(
    x+15,
    y-4+bob,
    10,
    4
  );


  ctx.restore();

}


// ======================================================
// BOAT DRAW
// ======================================================

function drawBoats(time){

  if(currentMapId!=="lake"){
    return;
  }


  for(
    const boat of
    MOTION_STATE.boats
  ){

    let x=
      motionScreenX(
        boat.x
      );

    const y=
      motionScreenY(
        boat.y
      );


    if(
      !motionVisible(
        x,y,150
      )
    ){
      continue;
    }


    ctx.save();


    if(
      boat.direction<0
    ){

      ctx.translate(
        x+82,
        0
      );

      ctx.scale(
        -1,
        1
      );

      x=0;

    }


    const bob=
      Math.sin(
        time*1.7+
        boat.seed
      )*2;


    /*
      水面の影
    */

    ctx.fillStyle=
      "rgba(3,18,26,.35)";

    ctx.fillRect(
      x+8,
      y+30+bob,
      67,
      5
    );


    /*
      hull
    */

    ctx.fillStyle="#452d25";

    ctx.fillRect(
      x+6,
      y+22+bob,
      69,
      8
    );


    ctx.fillStyle="#825136";

    ctx.fillRect(
      x+14,
      y+17+bob,
      52,
      7
    );


    /*
      roof
    */

    ctx.fillStyle="#202a34";

    ctx.fillRect(
      x+17,
      y+7+bob,
      45,
      5
    );


    ctx.fillStyle="#34414a";

    ctx.fillRect(
      x+22,
      y+3+bob,
      35,
      5
    );


    /*
      pillars
    */

    ctx.fillStyle="#59382b";

    ctx.fillRect(
      x+21,
      y+11+bob,
      3,
      8
    );

    ctx.fillRect(
      x+55,
      y+11+bob,
      3,
      8
    );


    /*
      lanterns
    */

    ctx.fillStyle="#bd4939";

    ctx.fillRect(
      x+18,
      y+13+bob,
      5,
      7
    );

    ctx.fillRect(
      x+57,
      y+13+bob,
      5,
      7
    );


    ctx.fillStyle="#f2a54d";

    ctx.fillRect(
      x+19,
      y+14+bob,
      3,
      4
    );

    ctx.fillRect(
      x+58,
      y+14+bob,
      3,
      4
    );


    /*
      wake
    */

    ctx.fillStyle=
      "rgba(124,191,205,.20)";

    ctx.fillRect(
      x-12,
      y+31+bob,
      17,
      2
    );

    ctx.fillRect(
      x-22,
      y+35+bob,
      25,
      1
    );


    ctx.restore();

  }

}


// ======================================================
// WILLOW ANIMATION
// ======================================================

function drawWillowMotion(time){

  if(
    !MOTION_CONFIG.willow ||
    currentMapId!=="lake"
  ){
    return;
  }


  const props=
    motionMap().props||[];


  props.forEach(
    (prop,index)=>{

      if(prop.type!=="willow"){
        return;
      }


      const x=
        motionScreenX(
          prop.x*TILE
        );

      const y=
        motionScreenY(
          prop.y*TILE
        );


      if(
        !motionVisible(x,y)
      ){
        return;
      }


      const sway=
        Math.sin(
          time*.9+
          index*1.7
        )*3;


      ctx.fillStyle=
        "rgba(39,91,62,.62)";


      /*
        垂れた柳の枝
      */

      for(let n=0;n<5;n++){

        const branchX=
          x+4+n*6;


        const branchSway=
          sway*
          (
            .5+n*.1
          );


        ctx.fillRect(
          branchX+
          branchSway,
          y+8,
          2,
          19+
          (n%3)*4
        );


        ctx.fillStyle=
          "rgba(62,111,70,.55)";

        ctx.fillRect(
          branchX+
          branchSway-2,
          y+16+
          n*2,
          5,
          3
        );


        ctx.fillStyle=
          "rgba(39,91,62,.62)";

      }

    }
  );

}


// ======================================================
// STALL LIGHT
// ======================================================

function drawStallLights(time){

  if(
    !MOTION_CONFIG.lighting ||
    motionIsIndoor()
  ){
    return;
  }


  const stalls=
    motionMap().stalls||[];


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
        23;


      if(
        !motionVisible(x,y,120)
      ){
        return;
      }


      const flicker=
        .92+
        Math.sin(
          time*2.4+
          index
        )*.08;


      const radius=
        55*flicker;


      const gradient=
        ctx.createRadialGradient(
          x,y,
          2,
          x,y,
          radius
        );


      gradient.addColorStop(
        0,
        "rgba(255,178,82,.10)"
      );

      gradient.addColorStop(
        .35,
        "rgba(255,130,55,.045)"
      );

      gradient.addColorStop(
        1,
        "rgba(255,110,40,0)"
      );


      ctx.fillStyle=
        gradient;


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


// ======================================================
// WATER REFLECTION
// ======================================================

function drawWaterMotion(time){

  if(currentMapId!=="lake"){
    return;
  }


  const waterRight=
    16*TILE-
    camera.x;


  ctx.save();


  for(let i=0;i<14;i++){

    const y=
      i*73-
      camera.y+
      (
        Math.sin(
          time*.8+i
        )*8
      );


    const x=
      waterRight-
      35-
      (
        i%4
      )*28;


    ctx.fillStyle=
      i%3===0
      ? "rgba(235,159,76,.09)"
      : "rgba(83,156,180,.10)";


    ctx.fillRect(
      x+
      Math.sin(
        time+
        i
      )*7,
      y,
      24+
      (i%3)*9,
      2
    );

  }


  ctx.restore();

}


// ======================================================
// EXTRA STEAM
// ======================================================

function drawExtraSteam(time){

  const stalls=
    motionMap().stalls||[];


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
        18;


      if(
        !motionVisible(x,y)
      ){
        return;
      }


      for(let n=0;n<3;n++){

        const phase=
          (
            time*13+
            n*9+
            index*5
          )%31;


        const drift=
          Math.sin(
            time*2+
            n+
            index
          )*4;


        const alpha=
          Math.max(
            0,
            .32-
            phase/110
          );


        ctx.fillStyle=
          `rgba(235,226,211,${alpha})`;


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


// ======================================================
// INDOOR AMBIENCE
// ======================================================

function drawIndoorMotion(time){

  if(!motionIsIndoor()){
    return;
  }


  const theme=
    motionMap().theme||"";


  /*
    ホテルのシャンデリア光
  */

  if(theme==="hotel"){

    const pulse=
      .04+
      Math.sin(
        time*1.2
      )*.008;


    const g=
      ctx.createRadialGradient(
        canvas.width/2,
        80,
        20,
        canvas.width/2,
        80,
        250
      );


    g.addColorStop(
      0,
      `rgba(255,207,120,${pulse})`
    );

    g.addColorStop(
      1,
      "rgba(255,190,100,0)"
    );


    ctx.fillStyle=g;

    ctx.fillRect(
      0,0,
      canvas.width,
      330
    );

  }


  /*
    ドリンク店のネオン
  */

  if(theme==="drink"){

    const alpha=
      .018+
      Math.sin(
        time*2.2
      )*.005;


    ctx.fillStyle=
      `rgba(63,180,150,${alpha})`;

    ctx.fillRect(
      0,0,
      canvas.width,
      canvas.height
    );

  }


  /*
    湖畔茶室
  */

  if(theme==="lakeTea"){

    ctx.fillStyle=
      `rgba(52,126,157,${
        .014+
        Math.sin(time)*.004
      })`;

    ctx.fillRect(
      0,0,
      canvas.width,
      canvas.height
    );

  }

}


// ======================================================
// FINAL ATMOSPHERE
// ======================================================

function drawMotionAtmosphere(time){

  drawStallLights(time);

  drawIndoorMotion(time);

}


// ======================================================
// HOOK : UPDATE NPC
// ======================================================

const motionOriginalUpdateNPCs=
  updateNPCs;


updateNPCs=
function(dt){

  motionOriginalUpdateNPCs(dt);

  updateMotion(dt);

};


// ======================================================
// HOOK : DRAW PROPS
//
// 水面反射は物体より後ろに置きたいので
// props描画前に追加
// ======================================================

const motionOriginalDrawProps=
  drawProps;


drawProps=
function(){

  drawWaterMotion(
    performance.now()/1000
  );

  motionOriginalDrawProps();

  drawWillowMotion(
    performance.now()/1000
  );

};


// ======================================================
// HOOK : DRAW ENTITIES
//
// 既存NPC/プレイヤーはそのまま。
// その周囲に生活NPC・車両などを追加。
// ======================================================

const motionOriginalDrawEntities=
  drawEntities;


drawEntities=
function(time){

  /*
    屋台の裏側
  */

  drawStallWorkers(time);


  /*
    街を歩く人
  */

  drawAmbientCrowd(time);


  /*
    走行車両
  */

  drawVehicles(time);


  /*
    西湖
  */

  drawBoats(time);


  /*
    元からいるNPCとプレイヤー
  */

  motionOriginalDrawEntities(
    time
  );


  /*
    屋台前のお客さん
  */

  drawStallCustomers(time);


  /*
    湯気
  */

  drawExtraSteam(time);

};


// ======================================================
// HOOK : LIGHTING
// ======================================================

const motionOriginalDrawLighting=
  drawLighting;


drawLighting=
function(){

  motionOriginalDrawLighting();

  drawMotionAtmosphere(
    performance.now()/1000
  );

};


// ======================================================
// START
// ======================================================

initializeMotionMap();


console.log(
  "武林夜市 Ver.5 Motion System loaded."
);
