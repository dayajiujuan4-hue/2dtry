"use strict";

/*
==========================================================
 杭州探索録 - 武林夜市
 VISUAL ENHANCEMENT Ver.4
 "LIVING HANGZHOU"

 安定版の基本描画を維持しながら、

 ・建物ごとの専用外観
 ・夜市の生活感
 ・石畳への光の反射
 ・提灯アニメーション
 ・店舗ごとの光
 ・現代杭州らしい街路小物
 ・西湖の夜景
 ・店舗別内装演出

 を追加する。

 IMPORTANT:
 game.js のゲームロジックには触れない。
 map.js の当たり判定にも触れない。
==========================================================
*/


// ======================================================
// ORIGINAL FUNCTIONS
// ======================================================

const V4_originalDraw = draw;
const V4_originalDrawMap = drawMap;
const V4_originalDrawProps = drawProps;


// ======================================================
// UTILITY
// ======================================================

function v4rect(x,y,w,h,color){

  ctx.fillStyle=color;

  ctx.fillRect(
    Math.floor(x),
    Math.floor(y),
    Math.ceil(w),
    Math.ceil(h)
  );

}


function v4line(
  x1,y1,
  x2,y2,
  color,
  width=1
){

  ctx.save();

  ctx.strokeStyle=color;
  ctx.lineWidth=width;

  ctx.beginPath();

  ctx.moveTo(
    Math.floor(x1)+.5,
    Math.floor(y1)+.5
  );

  ctx.lineTo(
    Math.floor(x2)+.5,
    Math.floor(y2)+.5
  );

  ctx.stroke();

  ctx.restore();

}


function v4glow(
  x,y,
  radius,
  color,
  alpha=.1
){

  const g=
    ctx.createRadialGradient(
      x,y,0,
      x,y,radius
    );

  g.addColorStop(
    0,
    color
  );

  g.addColorStop(
    .35,
    color
  );

  g.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  ctx.save();

  ctx.globalAlpha=alpha;
  ctx.fillStyle=g;

  ctx.fillRect(
    x-radius,
    y-radius,
    radius*2,
    radius*2
  );

  ctx.restore();

}


function v4hash(
  x,y,
  salt=0
){

  let n=
    Math.imul(
      x+salt*31,
      374761393
    )+
    Math.imul(
      y+salt*17,
      668265263
    );

  n=
    (n^(n>>>13))>>>0;

  return(
    n%1000/1000
  );

}


function v4map(){

  return getCurrentMap();

}


// ======================================================
// MAP
// ======================================================

drawMap=function(time){

  /*
  game.js の基本描画を必ず先に実行。
  */

  V4_originalDrawMap(time);


  /*
  その上に質感を重ねる。
  */

  v4DrawGroundDetails(time);

};


// ======================================================
// GROUND DETAILS
// ======================================================

function v4DrawGroundDetails(time){

  const map=
    v4map();

  const rows=
    map.grid.length;

  const cols=
    map.grid[0].length;


  const sx0=
    Math.max(
      0,
      Math.floor(camera.x/TILE)-1
    );


  const sx1=
    Math.min(
      cols,
      Math.ceil(
        (camera.x+canvas.width)/TILE
      )+1
    );


  const sy0=
    Math.max(
      0,
      Math.floor(camera.y/TILE)-1
    );


  const sy1=
    Math.min(
      rows,
      Math.ceil(
        (camera.y+canvas.height)/TILE
      )+1
    );


  for(
    let ty=sy0;
    ty<sy1;
    ty++
  ){

    for(
      let tx=sx0;
      tx<sx1;
      tx++
    ){

      const tile=
        map.grid[ty][tx];

      const x=
        tx*TILE-camera.x;

      const y=
        ty*TILE-camera.y;


      if(
        tile===T.FLOOR ||
        tile===T.ROAD
      ){

        v4StreetTile(
          x,y,
          tx,ty,
          tile===T.ROAD
        );

      }


      else if(
        tile===T.PLAZA
      ){

        v4PlazaTile(
          x,y,
          tx,ty
        );

      }


      else if(
        tile===T.WATER
      ){

        v4WaterTile(
          x,y,
          tx,ty,
          time
        );

      }


      else if(
        tile===T.GRASS
      ){

        v4GrassTile(
          x,y,
          tx,ty
        );

      }


      else if(
        tile===T.INDOOR
      ){

        v4InteriorFloor(
          x,y,
          tx,ty,
          map
        );

      }


      else if(
        tile===T.WALL
      ){

        v4InteriorWall(
          x,y
        );

      }


      else if(
        tile===T.COUNTER
      ){

        v4Counter(
          x,y
        );

      }

    }

  }

}


// ======================================================
// STREET
// ======================================================

function v4StreetTile(
  x,y,
  tx,ty,
  road
){

  ctx.strokeStyle=
    road
      ? "rgba(148,145,160,.10)"
      : "rgba(154,138,143,.10)";

  ctx.strokeRect(
    x+.5,
    y+.5,
    TILE-1,
    TILE-1
  );


  /*
  石の上端
  */

  v4rect(
    x+2,
    y+2,
    TILE-4,
    1,
    "rgba(255,229,213,.025)"
  );


  /*
  不規則な石材
  */

  const seed=
    v4hash(
      tx,
      ty,
      1
    );


  if(seed>.78){

    v4line(
      x+7,
      y+20,
      x+17,
      y+18,
      "rgba(11,10,17,.18)"
    );

  }


  if(seed<.18){

    v4rect(
      x+22,
      y+8,
      5,
      1,
      "rgba(204,178,165,.06)"
    );

  }

}


// ======================================================
// PLAZA
// ======================================================

function v4PlazaTile(
  x,y,
  tx,ty
){

  ctx.strokeStyle=
    "rgba(205,183,176,.13)";

  ctx.strokeRect(
    x+.5,
    y+.5,
    TILE-1,
    TILE-1
  );


  if(
    (tx+ty)%2===0
  ){

    v4rect(
      x+1,
      y+1,
      TILE-2,
      TILE-2,
      "rgba(125,92,101,.025)"
    );

  }


  v4rect(
    x+3,
    y+3,
    TILE-6,
    1,
    "rgba(255,231,212,.025)"
  );

}


// ======================================================
// WEST LAKE
// ======================================================

function v4WaterTile(
  x,y,
  tx,ty,
  time
){

  const wave=
    Math.sin(
      time*1.5+
      tx*.7+
      ty*.43
    );


  /*
  基本水面は game.js に任せる。
  */

  v4rect(
    x,
    y,
    TILE,
    TILE,
    (tx+ty)%2===0
      ? "rgba(27,103,133,.08)"
      : "rgba(12,66,94,.06)"
  );


  v4rect(
    x+4+wave*2,
    y+9,
    14,
    1,
    "rgba(135,205,214,.22)"
  );


  v4rect(
    x+15-wave,
    y+22,
    12,
    1,
    "rgba(88,165,185,.18)"
  );


  if(
    v4hash(tx,ty,9)>.78
  ){

    v4rect(
      x+7,
      y+28,
      8,
      1,
      "rgba(191,219,215,.10)"
    );

  }

}


// ======================================================
// GRASS
// ======================================================

function v4GrassTile(
  x,y,
  tx,ty
){

  if(
    (tx*3+ty)%4===0
  ){

    v4rect(
      x+7,
      y+13,
      2,
      6,
      "rgba(92,137,87,.20)"
    );


    v4rect(
      x+11,
      y+17,
      2,
      5,
      "rgba(71,116,74,.18)"
    );

  }

}


// ======================================================
// INTERIOR FLOOR
// ======================================================

function v4InteriorFloor(
  x,y,
  tx,ty,
  map
){

  const theme=
    map.theme||
    map.interiorType||
    "";


  /*
  HOTEL
  */

  if(
    theme==="hotel" ||
    currentMapId==="wulinHotel" ||
    currentMapId==="hangzhouHotel"
  ){

    v4rect(
      x+1,
      y+1,
      TILE-2,
      TILE-2,
      (tx+ty)%2===0
        ? "rgba(214,193,166,.14)"
        : "rgba(103,85,80,.07)"
    );


    ctx.strokeStyle=
      "rgba(242,220,192,.10)";

    ctx.strokeRect(
      x+.5,
      y+.5,
      TILE-1,
      TILE-1
    );

    return;

  }


  /*
  CONVENIENCE STORE
  */

  if(
    theme==="convenience" ||
    currentMapId==="convenience" ||
    currentMapId==="cityStore"
  ){

    v4rect(
      x+1,
      y+1,
      TILE-2,
      TILE-2,
      (tx+ty)%2===0
        ? "rgba(191,205,198,.12)"
        : "rgba(99,120,117,.07)"
    );

    return;

  }


  /*
  TEA HOUSE
  */

  if(
    theme==="tea" ||
    currentMapId==="tea" ||
    currentMapId==="lakeTea"
  ){

    v4rect(
      x,
      y,
      TILE,
      TILE,
      "rgba(94,56,34,.11)"
    );


    v4line(
      x,
      y+16,
      x+TILE,
      y+16,
      "rgba(42,24,17,.23)"
    );


    v4rect(
      x+2,
      y+3,
      TILE-4,
      1,
      "rgba(232,179,105,.08)"
    );

    return;

  }


  /*
  CULTURE / GIFT
  */

  if(
    theme==="culture" ||
    currentMapId==="culture" ||
    currentMapId==="lakeGift"
  ){

    v4rect(
      x,
      y,
      TILE,
      TILE,
      "rgba(102,60,39,.10)"
    );


    v4line(
      x,
      y+16,
      x+TILE,
      y+16,
      "rgba(45,27,20,.22)"
    );

    return;

  }


  /*
  RESTAURANT
  */

  if(
    theme==="restaurant" ||
    theme==="noodle" ||
    currentMapId==="restaurant" ||
    currentMapId==="noodle"
  ){

    ctx.strokeStyle=
      "rgba(115,73,53,.18)";

    ctx.strokeRect(
      x+.5,
      y+.5,
      TILE-1,
      TILE-1
    );

    return;

  }


  ctx.strokeStyle=
    "rgba(90,57,43,.16)";

  ctx.strokeRect(
    x+.5,
    y+.5,
    TILE-1,
    TILE-1
  );

}


// ======================================================
// INTERIOR WALL
// ======================================================

function v4InteriorWall(
  x,y
){

  v4rect(
    x+2,
    y+5,
    TILE-4,
    2,
    "rgba(184,119,74,.12)"
  );


  v4rect(
    x+2,
    y+24,
    TILE-4,
    2,
    "rgba(184,119,74,.08)"
  );


  v4rect(
    x+14,
    y,
    3,
    TILE,
    "rgba(25,15,14,.17)"
  );

}


// ======================================================
// COUNTER
// ======================================================

function v4Counter(
  x,y
){

  v4rect(
    x+2,
    y+3,
    TILE-4,
    2,
    "rgba(235,177,102,.11)"
  );


  v4rect(
    x+2,
    y+17,
    TILE-4,
    2,
    "rgba(43,25,18,.18)"
  );

}


// ======================================================
// BUILDINGS
// ======================================================

drawBuildings=function(){

  const map=
    v4map();


  if(
    !map.buildings
  ){
    return;
  }


  for(
    const b of
    map.buildings
  ){

    const x=
      b.x*TILE-camera.x;

    const y=
      b.y*TILE-camera.y;

    const w=
      b.w*TILE;

    const h=
      b.h*TILE;


    if(
      x>canvas.width+100 ||
      y>canvas.height+100 ||
      x+w<-100 ||
      y+h<-100
    ){
      continue;
    }


    const name=
      b.name||"";


    /*
    HOTEL
    */

    if(
      b.type==="hotel" ||
      name.includes("酒店") ||
      name.includes("宾馆")
    ){

      v4DrawHotel(
        b,x,y,w,h
      );

    }


    /*
    CONVENIENCE
    */

    else if(
      b.type==="convenience" ||
      name.includes("便利")
    ){

      v4DrawConvenience(
        b,x,y,w,h
      );

    }


    /*
    CULTURE
    */

    else if(
      b.type==="culture" ||
      name.includes("文创") ||
      name.includes("礼物")
    ){

      v4DrawCultureShop(
        b,x,y,w,h
      );

    }


    /*
    TEA
    */

    else if(
      b.type==="traditional" ||
      name.includes("茶馆") ||
      name.includes("茶室")
    ){

      v4DrawTeaHouse(
        b,x,y,w,h
      );

    }


    /*
    RESTAURANT
    */

    else if(
      b.type==="restaurant" ||
      name.includes("食堂")
    ){

      v4DrawRestaurant(
        b,x,y,w,h
      );

    }


    /*
    NOODLE
    */

    else if(
      b.type==="noodle" ||
      name.includes("面馆")
    ){

      v4DrawNoodleShop(
        b,x,y,w,h
      );

    }


    /*
    DEFAULT
    */

    else{

      v4DrawChineseShop(
        b,x,y,w,h
      );

    }

  }

};


// ======================================================
// COMMON CHINESE BUILDING BASE
// ======================================================

function v4BuildingBase(
  b,x,y,w,h,
  bodyColor="#49312d"
){

  /*
  SHADOW
  */

  v4rect(
    x+12,
    y+15,
    w,
    h+5,
    "rgba(3,4,10,.40)"
  );


  /*
  BODY
  */

  v4rect(
    x+5,
    y+27,
    w-10,
    h-27,
    "#24191d"
  );


  v4rect(
    x+10,
    y+34,
    w-20,
    h-41,
    bodyColor
  );


  /*
  WOOD POSTS
  */

  for(
    let px=x+17;
    px<x+w-12;
    px+=64
  ){

    v4rect(
      px,
      y+34,
      6,
      h-34,
      "#211518"
    );


    v4rect(
      px+3,
      y+35,
      2,
      h-37,
      "rgba(131,73,50,.55)"
    );

  }


  v4ChineseRoof(
    x-12,
    y+4,
    w+24,
    36
  );

}


// ======================================================
// ROOF
// ======================================================

function v4ChineseRoof(
  x,y,w,h
){

  /*
  MAIN SILHOUETTE
  */

  ctx.fillStyle=
    "#0b101c";

  ctx.beginPath();

  ctx.moveTo(
    x+13,
    y+3
  );

  ctx.lineTo(
    x+w-13,
    y+3
  );

  ctx.lineTo(
    x+w+4,
    y+h-8
  );

  ctx.lineTo(
    x-4,
    y+h-8
  );

  ctx.closePath();

  ctx.fill();


  /*
  TILE FACE
  */

  v4rect(
    x+7,
    y+9,
    w-14,
    h-18,
    "#192238"
  );


  /*
  TILE ROWS
  */

  for(
    let px=x+10;
    px<x+w-8;
    px+=13
  ){

    v4line(
      px,
      y+9,
      px-2,
      y+h-10,
      "#090e19"
    );


    v4line(
      px+2,
      y+9,
      px,
      y+h-10,
      "rgba(91,106,153,.20)"
    );

  }


  /*
  RIDGE
  */

  v4rect(
    x+13,
    y+2,
    w-26,
    6,
    "#101727"
  );


  v4rect(
    x+17,
    y+2,
    w-34,
    1,
    "#46516d"
  );


  /*
  EAVE
  */

  v4rect(
    x-5,
    y+h-11,
    w+10,
    8,
    "#080d18"
  );


  v4rect(
    x,
    y+h-11,
    w,
    2,
    "#35405b"
  );


  /*
  UP-TURNED ENDS
  */

  v4rect(
    x-12,
    y+h-16,
    18,
    5,
    "#090f1b"
  );


  v4rect(
    x+w-6,
    y+h-16,
    18,
    5,
    "#090f1b"
  );


  /*
  RED RAFTERS
  */

  for(
    let px=x+10;
    px<x+w-8;
    px+=24
  ){

    v4rect(
      px,
      y+h-8,
      14,
      3,
      "#642b29"
    );

  }

}


// ======================================================
// TEA HOUSE
// ======================================================

function v4DrawTeaHouse(
  b,x,y,w,h
){

  v4BuildingBase(
    b,x,y,w,h,
    "#443029"
  );


  /*
  SECOND EAVE
  */

  v4SmallEave(
    x-4,
    y+112,
    w+8
  );


  /*
  WINDOWS
  */

  v4WindowRow(
    x+30,
    y+70,
    w-60,
    62
  );


  /*
  WOODEN LOWER FRONT
  */

  v4rect(
    x+18,
    y+h-75,
    w-36,
    53,
    "#35231f"
  );


  /*
  TEA DISPLAY WINDOWS
  */

  for(
    let px=x+28;
    px<x+w-60;
    px+=72
  ){

    v4ShopWindow(
      px,
      y+h-66,
      43,
      40
    );

  }


  /*
  TEA JARS
  */

  for(
    let px=x+38;
    px<x+w-65;
    px+=72
  ){

    v4TeaJar(
      px,
      y+h-42
    );

  }


  v4BuildingDoor(
    b,
    x,y,w,h
  );


  v4MainSign(
    b,
    x,
    y+42,
    w,
    "#7e2925"
  );


  /*
  SIDE BANNERS
  */

  v4VerticalBanner(
    x+18,
    y+84,
    "茶"
  );


  v4VerticalBanner(
    x+w-38,
    y+84,
    "香"
  );


  /*
  LANTERNS
  */

  v4FacadeLantern(
    x+18,
    y+58
  );


  v4FacadeLantern(
    x+w-31,
    y+58
  );

}


// ======================================================
// NOODLE SHOP
// ======================================================

function v4DrawNoodleShop(
  b,x,y,w,h
){

  v4BuildingBase(
    b,x,y,w,h,
    "#54322a"
  );


  /*
  RED SHOP EAVE
  */

  v4rect(
    x+12,
    y+h-89,
    w-24,
    12,
    "#7e2825"
  );


  for(
    let px=x+15;
    px<x+w-18;
    px+=20
  ){

    v4rect(
      px,
      y+h-77,
      12,
      7,
      "#b84235"
    );

  }


  /*
  OPEN KITCHEN WINDOW
  */

  const kitchenX=
    x+25;

  const kitchenY=
    y+h-65;

  const kitchenW=
    Math.max(
      70,
      w*.42
    );


  v4rect(
    kitchenX-4,
    kitchenY-4,
    kitchenW+8,
    46,
    "#171216"
  );


  v4rect(
    kitchenX,
    kitchenY,
    kitchenW,
    38,
    "#7d492c"
  );


  v4rect(
    kitchenX+5,
    kitchenY+5,
    kitchenW-10,
    28,
    "#d7873d"
  );


  /*
  COUNTER
  */

  v4rect(
    kitchenX,
    kitchenY+29,
    kitchenW,
    9,
    "#533122"
  );


  /*
  BOWLS
  */

  for(
    let px=kitchenX+12;
    px<kitchenX+kitchenW-15;
    px+=27
  ){

    v4rect(
      px,
      kitchenY+24,
      15,
      4,
      "#e1d0ae"
    );

  }


  v4BuildingDoor(
    b,
    x,y,w,h
  );


  v4MainSign(
    b,
    x,
    y+42,
    w,
    "#a0382e"
  );


  v4VerticalBanner(
    x+w-36,
    y+83,
    "面"
  );


  v4FacadeLantern(
    x+18,
    y+60
  );


  v4FacadeLantern(
    x+w-31,
    y+60
  );

}


// ======================================================
// RESTAURANT
// ======================================================

function v4DrawRestaurant(
  b,x,y,w,h
){

  /*
  参考画像の大型食堂を意識。
  */

  v4BuildingBase(
    b,x,y,w,h,
    "#4b2c29"
  );


  /*
  SECOND FLOOR EAVE
  */

  v4SmallEave(
    x-6,
    y+118,
    w+12
  );


  /*
  UPPER WINDOWS
  */

  v4WindowRow(
    x+25,
    y+72,
    w-50,
    64
  );


  /*
  LOWER FACADE
  */

  v4rect(
    x+14,
    y+h-84,
    w-28,
    62,
    "#2c1b1b"
  );


  for(
    let px=x+26;
    px<x+w-55;
    px+=65
  ){

    v4ShopWindow(
      px,
      y+h-69,
      39,
      43
    );

  }


  v4BuildingDoor(
    b,
    x,y,w,h
  );


  v4MainSign(
    b,
    x,
    y+43,
    w,
    "#8e2d28"
  );


  /*
  RESTAURANT PLAQUES
  */

  v4VerticalBanner(
    x+16,
    y+92,
    "食"
  );


  v4VerticalBanner(
    x+w-37,
    y+92,
    "堂"
  );


  v4FacadeLantern(
    x+18,
    y+61
  );


  v4FacadeLantern(
    x+w-31,
    y+61
  );


  /*
  EXTRA LANTERNS
  */

  if(w>300){

    v4FacadeLantern(
      x+w*.33,
      y+123
    );


    v4FacadeLantern(
      x+w*.67,
      y+123
    );

  }

}


// ======================================================
// CULTURE SHOP
// ======================================================

function v4DrawCultureShop(
  b,x,y,w,h
){

  /*
  伝統建築＋現代的ショーウィンドウ
  */

  v4BuildingBase(
    b,x,y,w,h,
    "#3c3230"
  );


  /*
  MODERN FRAME
  */

  v4rect(
    x+17,
    y+h-83,
    w-34,
    61,
    "#202126"
  );


  /*
  DISPLAY WINDOWS
  */

  for(
    let px=x+26;
    px<x+w-55;
    px+=69
  ){

    v4CultureWindow(
      px,
      y+h-71,
      43,
      43
    );

  }


  v4BuildingDoor(
    b,
    x,y,w,h
  );


  v4MainSign(
    b,
    x,
    y+42,
    w,
    "#3c4f4c"
  );


  /*
  GOLD STRIP
  */

  v4rect(
    x+19,
    y+h-86,
    w-38,
    3,
    "#987445"
  );

}


// ======================================================
// CONVENIENCE STORE
// ======================================================

function v4DrawConvenience(
  b,x,y,w,h
){

  /*
  夜市の中にある現代店舗。
  */

  v4rect(
    x+10,
    y+18,
    w-20,
    h-18,
    "#20242b"
  );


  /*
  TOP
  */

  v4rect(
    x+4,
    y+14,
    w-8,
    18,
    "#111720"
  );


  /*
  LIGHT STRIP
  */

  v4rect(
    x+9,
    y+31,
    w-18,
    5,
    "#d7c987"
  );


  v4rect(
    x+9,
    y+36,
    w-18,
    4,
    "#3f8a78"
  );


  /*
  GLASS FRONT
  */

  for(
    let px=x+20;
    px<x+w-50;
    px+=65
  ){

    v4ModernWindow(
      px,
      y+h-71,
      42,
      48
    );

  }


  v4BuildingDoor(
    b,
    x,y,w,h
  );


  /*
  SIGN
  */

  v4MainSign(
    b,
    x,
    y+48,
    w,
    "#315f58"
  );

}


// ======================================================
// HOTEL
// ======================================================

function v4DrawHotel(
  b,x,y,w,h
){

  /*
  SHADOW
  */

  v4rect(
    x+13,
    y+17,
    w,
    h+3,
    "rgba(2,4,10,.43)"
  );


  /*
  BODY
  */

  v4rect(
    x+6,
    y+15,
    w-12,
    h-15,
    "#252b36"
  );


  v4rect(
    x+12,
    y+22,
    w-24,
    h-30,
    b.color||"#343d4b"
  );


  /*
  CORNICE
  */

  v4rect(
    x,
    y+7,
    w,
    14,
    "#141b28"
  );


  v4rect(
    x-5,
    y+19,
    w+10,
    6,
    "#0e1520"
  );


  v4rect(
    x+8,
    y+9,
    w-16,
    2,
    "#536077"
  );


  /*
  WINDOWS
  */

  for(
    let wy=y+45;
    wy<y+h-88;
    wy+=47
  ){

    for(
      let wx=x+29;
      wx<x+w-40;
      wx+=58
    ){

      v4HotelWindow(
        wx,
        wy
      );

    }

  }


  /*
  ENTRANCE
  */

  const doorCenter=
    b.doorX*TILE-
    camera.x+
    TILE/2;


  const ex=
    Math.max(
      x+30,
      Math.min(
        x+w-106,
        doorCenter-50
      )
    );


  /*
  CANOPY
  */

  v4rect(
    ex-10,
    y+h-86,
    120,
    9,
    "#101722"
  );


  v4rect(
    ex,
    y+h-77,
    100,
    6,
    "#74533b"
  );


  /*
  COLUMNS
  */

  v4rect(
    ex+3,
    y+h-71,
    7,
    71,
    "#4d423c"
  );


  v4rect(
    ex+90,
    y+h-71,
    7,
    71,
    "#4d423c"
  );


  /*
  GLASS DOORS
  */

  v4rect(
    ex+18,
    y+h-67,
    64,
    67,
    "#171a20"
  );


  v4rect(
    ex+23,
    y+h-62,
    26,
    57,
    "#a46a3c"
  );


  v4rect(
    ex+51,
    y+h-62,
    26,
    57,
    "#a46a3c"
  );


  v4glow(
    ex+50,
    y+h-30,
    75,
    "rgba(255,158,70,.95)",
    .07
  );


  /*
  HOTEL NAME
  */

  v4rect(
    x+22,
    y+30,
    Math.min(
      w-44,
      (b.name||"酒店").length*23+30
    ),
    31,
    "#181b22"
  );


  ctx.save();

  ctx.fillStyle=
    "#e8c57f";

  ctx.font=
    "bold 16px serif";

  ctx.fillText(
    b.name||"酒店",
    x+34,
    y+51
  );

  ctx.restore();


  /*
  PLANTS
  */

  v4PotPlant(
    ex-8,
    y+h-28
  );


  v4PotPlant(
    ex+86,
    y+h-28
  );

}


// ======================================================
// GENERIC CHINESE SHOP
// ======================================================

function v4DrawChineseShop(
  b,x,y,w,h
){

  v4BuildingBase(
    b,x,y,w,h,
    b.color||"#49312d"
  );


  v4WindowRow(
    x+28,
    y+73,
    w-56,
    65
  );


  for(
    let px=x+26;
    px<x+w-55;
    px+=70
  ){

    v4ShopWindow(
      px,
      y+h-68,
      41,
      42
    );

  }


  v4BuildingDoor(
    b,
    x,y,w,h
  );


  v4MainSign(
    b,
    x,
    y+42,
    w,
    "#7d2b28"
  );


  v4FacadeLantern(
    x+18,
    y+61
  );


  v4FacadeLantern(
    x+w-31,
    y+61
  );

}


// ======================================================
// SMALL EAVE
// ======================================================

function v4SmallEave(
  x,y,w
){

  v4rect(
    x,
    y,
    w,
    10,
    "#101624"
  );


  v4rect(
    x-5,
    y+8,
    w+10,
    5,
    "#080d18"
  );


  v4rect(
    x+5,
    y+1,
    w-10,
    2,
    "#36415d"
  );

}


// ======================================================
// WINDOW ROW
// ======================================================

function v4WindowRow(
  x,y,w,
  spacing
){

  for(
    let px=x;
    px<x+w-32;
    px+=spacing
  ){

    v4LatticeWindow(
      px,
      y,
      32,
      30
    );

  }

}


// ======================================================
// LATTICE WINDOW
// ======================================================

function v4LatticeWindow(
  x,y,w,h
){

  v4glow(
    x+w/2,
    y+h/2,
    37,
    "rgba(255,154,55,.95)",
    .06
  );


  v4rect(
    x-4,
    y-4,
    w+8,
    h+8,
    "#171216"
  );


  v4rect(
    x,
    y,
    w,
    h,
    "#744225"
  );


  v4rect(
    x+4,
    y+4,
    w-8,
    h-8,
    "#d67c31"
  );


  v4rect(
    x+7,
    y+7,
    w-14,
    h-14,
    "#ffbd55"
  );


  /*
  GRID
  */

  v4rect(
    x+w/2-2,
    y+2,
    4,
    h-4,
    "#48271f"
  );


  v4rect(
    x+2,
    y+h/2-2,
    w-4,
    4,
    "#48271f"
  );


  v4rect(
    x+w*.25-1,
    y+3,
    2,
    h-6,
    "rgba(72,37,31,.70)"
  );


  v4rect(
    x+w*.75-1,
    y+3,
    2,
    h-6,
    "rgba(72,37,31,.70)"
  );

}


// ======================================================
// SHOP WINDOW
// ======================================================

function v4ShopWindow(
  x,y,w,h
){

  v4glow(
    x+w/2,
    y+h/2,
    52,
    "rgba(255,136,44,.95)",
    .055
  );


  v4rect(
    x-3,
    y-3,
    w+6,
    h+6,
    "#171216"
  );


  v4rect(
    x,
    y,
    w,
    h,
    "#68391f"
  );


  v4rect(
    x+5,
    y+5,
    w-10,
    h-10,
    "#d1772e"
  );


  v4rect(
    x+8,
    y+8,
    w-16,
    h-16,
    "#ffb84c"
  );


  v4rect(
    x+w/2-2,
    y+3,
    4,
    h-6,
    "#48261f"
  );


  v4rect(
    x+3,
    y+h/2-2,
    w-6,
    4,
    "#48261f"
  );


  /*
  DISPLAY SHELF
  */

  v4rect(
    x+6,
    y+h-12,
    w-12,
    5,
    "rgba(67,35,25,.45)"
  );

}


// ======================================================
// CULTURE WINDOW
// ======================================================

function v4CultureWindow(
  x,y,w,h
){

  v4rect(
    x-3,
    y-3,
    w+6,
    h+6,
    "#161b1d"
  );


  v4rect(
    x,
    y,
    w,
    h,
    "#30494a"
  );


  v4rect(
    x+4,
    y+4,
    w-8,
    h-8,
    "#d7b475"
  );


  /*
  DISPLAY OBJECT
  */

  v4rect(
    x+12,
    y+22,
    w-24,
    7,
    "#694b31"
  );


  v4rect(
    x+w/2-5,
    y+12,
    10,
    10,
    "#718d79"
  );

}


// ======================================================
// MODERN WINDOW
// ======================================================

function v4ModernWindow(
  x,y,w,h
){

  v4glow(
    x+w/2,
    y+h/2,
    52,
    "rgba(214,240,218,.8)",
    .035
  );


  v4rect(
    x-3,
    y-3,
    w+6,
    h+6,
    "#111820"
  );


  v4rect(
    x,
    y,
    w,
    h,
    "#476066"
  );


  v4rect(
    x+4,
    y+4,
    w-8,
    h-8,
    "#b9c5b4"
  );


  /*
  SHELVES
  */

  v4rect(
    x+5,
    y+18,
    w-10,
    3,
    "#566b61"
  );


  v4rect(
    x+5,
    y+32,
    w-10,
    3,
    "#566b61"
  );


  /*
  PRODUCTS
  */

  for(
    let px=x+8;
    px<x+w-8;
    px+=8
  ){

    v4rect(
      px,
      y+10,
      4,
      7,
      "#d7a84e"
    );


    v4rect(
      px,
      y+24,
      4,
      7,
      "#8c5542"
    );

  }

}


// ======================================================
// HOTEL WINDOW
// ======================================================

function v4HotelWindow(
  x,y
){

  const lit=
    (
      Math.floor(x+y)
      %3
    )!==0;


  v4rect(
    x-3,
    y-3,
    30,
    27,
    "#171c25"
  );


  v4rect(
    x,
    y,
    24,
    21,
    "#70543e"
  );


  v4rect(
    x+4,
    y+4,
    16,
    13,
    lit
      ? "#d89a50"
      : "#35414c"
  );


  v4rect(
    x+11,
    y+2,
    2,
    17,
    "#292525"
  );

}


// ======================================================
// BUILDING DOOR
// ======================================================

function v4BuildingDoor(
  b,x,y,w,h
){

  const center=
    b.doorX*TILE-
    camera.x+
    TILE/2;


  const dx=
    Math.max(
      x+20,
      Math.min(
        x+w-56,
        center-18
      )
    );


  const dy=
    y+h-64;


  v4glow(
    dx+18,
    dy+36,
    48,
    "rgba(255,140,47,.9)",
    .065
  );


  v4rect(
    dx-5,
    dy-5,
    47,
    69,
    "#171116"
  );


  v4rect(
    dx,
    dy,
    37,
    64,
    "#4d2a22"
  );


  v4rect(
    dx+5,
    dy+5,
    27,
    59,
    "#30201d"
  );


  v4rect(
    dx+17,
    dy+5,
    4,
    59,
    "#75462f"
  );


  /*
  PANELS
  */

  for(
    let py=dy+10;
    py<dy+52;
    py+=18
  ){

    v4rect(
      dx+8,
      py,
      7,
      12,
      "#5d3829"
    );


    v4rect(
      dx+23,
      py,
      7,
      12,
      "#5d3829"
    );

  }


  /*
  STEP
  */

  v4rect(
    dx-9,
    y+h,
    55,
    6,
    "#554b4e"
  );


  v4rect(
    dx-14,
    y+h+6,
    65,
    5,
    "#37333b"
  );


  /*
  DOOR LANTERNS
  */

  v4FacadeLantern(
    dx-16,
    dy+7
  );


  v4FacadeLantern(
    dx+42,
    dy+7
  );

}


// ======================================================
// SIGN
// ======================================================

function v4MainSign(
  b,x,y,w,
  color
){

  const text=
    b.name||"店";


  const signW=
    Math.min(
      w-40,
      Math.max(
        88,
        text.length*22+30
      )
    );


  const sx=
    x+w/2-signW/2;


  v4rect(
    sx+4,
    y+5,
    signW,
    33,
    "rgba(7,5,9,.45)"
  );


  v4rect(
    sx,
    y,
    signW,
    33,
    color
  );


  ctx.strokeStyle=
    "rgba(229,169,83,.38)";

  ctx.strokeRect(
    sx+5.5,
    y+5.5,
    signW-11,
    22
  );


  ctx.save();

  ctx.fillStyle=
    "#ffd88a";

  ctx.font=
    "bold 16px serif";

  ctx.textAlign=
    "center";

  ctx.textBaseline=
    "middle";


  ctx.fillText(
    text,
    sx+signW/2,
    y+17
  );

  ctx.restore();

}


// ======================================================
// VERTICAL BANNER
// ======================================================

function v4VerticalBanner(
  x,y,
  text
){

  v4rect(
    x,
    y,
    24,
    46,
    "#762522"
  );


  v4rect(
    x+3,
    y+3,
    18,
    40,
    "#9e332b"
  );


  ctx.save();

  ctx.fillStyle=
    "#f4d083";

  ctx.font=
    "bold 15px serif";

  ctx.textAlign=
    "center";


  [...text].forEach(
    (char,i)=>{

      ctx.fillText(
        char,
        x+12,
        y+20+i*17
      );

    }
  );

  ctx.restore();

}


// ======================================================
// TEA JAR
// ======================================================

function v4TeaJar(
  x,y
){

  v4rect(
    x+2,
    y,
    12,
    3,
    "#3d2720"
  );


  v4rect(
    x,
    y+3,
    16,
    14,
    "#76513a"
  );


  v4rect(
    x+3,
    y+6,
    10,
    7,
    "#9b744d"
  );

}


// ======================================================
// FACADE LANTERN
// ======================================================

function v4FacadeLantern(
  x,y
){

  v4glow(
    x+6,
    y+9,
    30,
    "rgba(255,79,36,.95)",
    .12
  );


  v4rect(
    x+2,
    y,
    8,
    2,
    "#60221d"
  );


  v4rect(
    x,
    y+2,
    12,
    15,
    "#a03129"
  );


  v4rect(
    x+2,
    y+4,
    8,
    11,
    "#ef5b3a"
  );


  v4rect(
    x+4,
    y+5,
    4,
    9,
    "#ff984c"
  );


  v4rect(
    x+2,
    y+17,
    8,
    2,
    "#61221d"
  );


  v4rect(
    x+5,
    y+19,
    2,
    5,
    "#a23a2d"
  );

}


// ======================================================
// PLANT
// ======================================================

function v4PotPlant(
  x,y
){

  v4rect(
    x+6,
    y+15,
    13,
    11,
    "#75412d"
  );


  v4rect(
    x+8,
    y+12,
    9,
    4,
    "#985737"
  );


  v4rect(
    x+11,
    y+1,
    3,
    13,
    "#24442f"
  );


  v4rect(
    x+4,
    y+3,
    8,
    6,
    "#315a3c"
  );


  v4rect(
    x+13,
    y,
    8,
    7,
    "#3b6846"
  );

}


// ======================================================
// LANTERN ROW
// ======================================================

drawLanternRows=function(time){

  const rows=
    v4map().lanternRows||[];


  for(
    const row of
    rows
  ){

    const y=
      row.y*TILE-camera.y;


    const start=
      row.start*TILE-camera.x;


    const end=
      row.end*TILE-camera.x;


    /*
    WIRE
    */

    v4line(
      start,
      y,
      end,
      y+4,
      "rgba(31,18,24,.82)",
      2
    );


    /*
    LANTERNS
    */

    for(
      let x=start+25;
      x<end;
      x+=52
    ){

      const sway=
        Math.sin(
          time*2+x*.02
        )*1.2;


      v4glow(
        x,
        y+14,
        32,
        "rgba(255,83,36,.95)",
        .11
      );


      v4rect(
        x-5+sway,
        y+4,
        10,
        2,
        "#63221d"
      );


      v4rect(
        x-7+sway,
        y+6,
        14,
        16,
        "#9f3129"
      );


      v4rect(
        x-4+sway,
        y+8,
        8,
        12,
        "#ed5b39"
      );


      v4rect(
        x-2+sway,
        y+9,
        4,
        10,
        "#ff9b50"
      );


      v4rect(
        x-5+sway,
        y+22,
        10,
        2,
        "#68231e"
      );


      v4rect(
        x-1+sway,
        y+24,
        2,
        5,
        "#9f3328"
      );

    }

  }

};


// ======================================================
// STALLS
// ======================================================

drawStalls=function(time){

  const map=
    v4map();


  for(
    const stall of
    map.stalls||[]
  ){

    const x=
      stall.x*TILE-camera.x;


    const y=
      stall.y*TILE-camera.y;


    const width=
      stall.width*TILE;


    v4DrawStall(
      stall,
      x,y,
      width,
      time
    );

  }

};


// ======================================================
// STALL
// ======================================================

function v4DrawStall(
  stall,
  x,y,
  width,
  time
){

  /*
  SHADOW
  */

  v4rect(
    x+7,
    y+9,
    width,
    40,
    "rgba(3,4,10,.35)"
  );


  /*
  POLES
  */

  v4rect(
    x+5,
    y+12,
    5,
    35,
    "#40261f"
  );


  v4rect(
    x+width-10,
    y+12,
    5,
    35,
    "#40261f"
  );


  /*
  ROOF
  */

  v4rect(
    x,
    y,
    width,
    15,
    "#9c362f"
  );


  /*
  AWNING
  */

  for(
    let px=0;
    px<width;
    px+=16
  ){

    v4rect(
      x+px,
      y+14,
      16,
      7,
      px%32===0
        ? "#cf4b3c"
        : "#d7a34f"
    );

  }


  /*
  SIGN
  */

  v4rect(
    x+8,
    y+2,
    width-16,
    12,
    "#321717"
  );


  ctx.save();

  ctx.fillStyle=
    "#ffd779";

  ctx.font=
    "bold 12px sans-serif";

  ctx.textAlign=
    "center";


  ctx.fillText(
    stall.sign||"夜市",
    x+width/2,
    y+12
  );

  ctx.restore();


  /*
  LIGHT
  */

  v4glow(
    x+width/2,
    y+31,
    58,
    "rgba(255,136,50,.95)",
    .05
  );


  /*
  COUNTER
  */

  v4rect(
    x+5,
    y+30,
    width-10,
    13,
    "#74482e"
  );


  v4rect(
    x+7,
    y+31,
    width-14,
    2,
    "#ae7544"
  );


  /*
  GOODS
  */

  v4StallGoods(
    stall,
    x,
    y,
    width
  );


  /*
  LANTERNS
  */

  v4FacadeLantern(
    x+10,
    y+21
  );


  v4FacadeLantern(
    x+width-22,
    y+21
  );


  /*
  STEAM
  */

  if(
    stall.type==="shaokao" ||
    stall.type==="food" ||
    stall.sign==="小笼包" ||
    stall.sign==="生煎"
  ){

    v4Steam(
      x+width/2,
      y+26,
      time
    );

  }

}


// ======================================================
// STALL GOODS
// ======================================================

function v4StallGoods(
  stall,
  x,y,
  width
){

  const type=
    stall.type||"food";


  if(
    type==="drink"
  ){

    for(
      let i=0;
      i<5;
      i++
    ){

      v4rect(
        x+14+i*15,
        y+24,
        8,
        8,
        i%2===0
          ? "#d58c4a"
          : "#7c6849"
      );

    }

  }


  else if(
    type==="fruit"
  ){

    for(
      let i=0;
      i<5;
      i++
    ){

      v4rect(
        x+13+i*15,
        y+25+(i%2)*2,
        9,
        7,
        i%2===0
          ? "#b95835"
          : "#c58d3d"
      );

    }

  }


  else if(
    type==="souvenir"
  ){

    for(
      let i=0;
      i<5;
      i++
    ){

      v4rect(
        x+13+i*15,
        y+24,
        9,
        8,
        i%2===0
          ? "#53746a"
          : "#8e6947"
      );

    }

  }


  else{

    for(
      let i=0;
      i<5;
      i++
    ){

      v4rect(
        x+13+i*15,
        y+26,
        10,
        5,
        i%2===0
          ? "#c26936"
          : "#e19b45"
      );

    }

  }

}


// ======================================================
// STEAM
// ======================================================

function v4Steam(
  x,y,time
){

  const offset=
    (time*12)%18;


  ctx.save();

  ctx.globalAlpha=.52;


  v4rect(
    x-10,
    y-offset,
    2,
    5,
    "rgba(245,235,220,.70)"
  );


  v4rect(
    x,
    y-6-offset*.7,
    2,
    6,
    "rgba(245,235,220,.65)"
  );


  v4rect(
    x+9,
    y-2-offset*.9,
    2,
    5,
    "rgba(245,235,220,.55)"
  );


  ctx.restore();

}


// ======================================================
// PROPS
// ======================================================

drawProps=function(){

  /*
  湖岸を先に描画。
  */

  v4LakeEdge();


  /*
  元々の小物を残す。
  */

  V4_originalDrawProps();


  /*
  追加装飾。
  */

  v4ExtraEnvironment();

};


// ======================================================
// LAKE EDGE
// ======================================================

function v4LakeEdge(){

  const map=
    v4map();


  if(
    map.ambient!=="lake"
  ){
    return;
  }


  const rows=
    map.grid.length;

  const cols=
    map.grid[0].length;


  for(
    let y=0;
    y<rows;
    y++
  ){

    for(
      let x=0;
      x<cols;
      x++
    ){

      if(
        map.grid[y][x]!==T.WATER
      ){
        continue;
      }


      if(
        x+1<cols &&
        map.grid[y][x+1]!==T.WATER
      ){

        const sx=
          (x+1)*TILE-camera.x;


        const sy=
          y*TILE-camera.y;


        v4rect(
          sx-4,
          sy,
          4,
          TILE,
          "#57555a"
        );


        v4rect(
          sx-2,
          sy,
          2,
          TILE,
          "rgba(186,174,139,.32)"
        );

      }

    }

  }

}


// ======================================================
// EXTRA ENVIRONMENT
// ======================================================

function v4ExtraEnvironment(){

  const map=
    v4map();


  if(
    map.ambient==="indoor"
  ){

    v4InteriorDecor();

  }

  else{

    v4OutdoorDecor();

  }

}


// ======================================================
// OUTDOOR DECOR
// ======================================================

function v4OutdoorDecor(){

  if(
    currentMapId==="food"
  ){

    /*
    PLANTERS
    */

    v4StreetPlanter(
      18*TILE,
      17*TILE
    );


    v4StreetPlanter(
      34*TILE,
      17*TILE
    );


    /*
    BICYCLE
    */

    v4Bicycle(
      36*TILE,
      23*TILE
    );


    /*
    MENU BOARD
    */

    v4MenuBoard(
      17*TILE,
      23*TILE,
      "今日\n推荐"
    );

  }


  else if(
    currentMapId==="market"
  ){

    v4Bicycle(
      36*TILE,
      22*TILE
    );


    v4MenuBoard(
      17*TILE,
      23*TILE,
      "杭州\n文创"
    );


    v4StreetPlanter(
      34*TILE,
      18*TILE
    );

  }


  else if(
    currentMapId==="hotel"
  ){

    /*
    HOTEL DISTRICT
    */

    v4StreetPlanter(
      18*TILE,
      10*TILE
    );


    v4StreetPlanter(
      33*TILE,
      10*TILE
    );


    v4Taxi(
      25*TILE,
      21*TILE
    );

  }


  else if(
    currentMapId==="lake"
  ){

    /*
    湖面に遠景の灯りを少しだけ。
    */

    v4LakeLights();

  }

}


// ======================================================
// STREET PLANTER
// ======================================================

function v4StreetPlanter(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  v4rect(
    x+5,
    y+18,
    20,
    10,
    "#50423d"
  );


  v4rect(
    x+7,
    y+15,
    16,
    4,
    "#72594a"
  );


  v4rect(
    x+14,
    y+3,
    3,
    13,
    "#1e3d2d"
  );


  v4rect(
    x+6,
    y+6,
    10,
    7,
    "#2b563e"
  );


  v4rect(
    x+16,
    y+2,
    10,
    8,
    "#376849"
  );

}


// ======================================================
// BICYCLE
// ======================================================

function v4Bicycle(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  ctx.save();

  ctx.strokeStyle=
    "#15171b";

  ctx.lineWidth=2;


  /*
  WHEELS
  */

  ctx.beginPath();

  ctx.arc(
    x+8,
    y+19,
    7,
    0,
    Math.PI*2
  );


  ctx.arc(
    x+29,
    y+19,
    7,
    0,
    Math.PI*2
  );

  ctx.stroke();


  /*
  FRAME
  */

  v4line(
    x+8,y+19,
    x+17,y+9,
    "#6d4540",
    2
  );


  v4line(
    x+17,y+9,
    x+23,y+19,
    "#6d4540",
    2
  );


  v4line(
    x+23,y+19,
    x+8,y+19,
    "#6d4540",
    2
  );


  v4line(
    x+17,y+9,
    x+29,y+19,
    "#6d4540",
    2
  );


  /*
  HANDLE
  */

  v4line(
    x+27,y+7,
    x+29,y+19,
    "#39383c"
  );


  v4line(
    x+25,y+7,
    x+31,y+7,
    "#39383c"
  );


  ctx.restore();

}


// ======================================================
// MENU BOARD
// ======================================================

function v4MenuBoard(
  wx,wy,text
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  v4rect(
    x,
    y,
    25,
    31,
    "#4b3025"
  );


  v4rect(
    x+3,
    y+3,
    19,
    23,
    "#251d1b"
  );


  ctx.save();

  ctx.fillStyle=
    "#e7d6ae";

  ctx.font=
    "8px sans-serif";

  ctx.textAlign=
    "center";


  text.split("\n")
  .forEach(
    (line,i)=>{

      ctx.fillText(
        line,
        x+12,
        y+12+i*10
      );

    }
  );


  ctx.restore();


  v4line(
    x+5,
    y+31,
    x+2,
    y+38,
    "#4b3025",
    2
  );


  v4line(
    x+20,
    y+31,
    x+23,
    y+38,
    "#4b3025",
    2
  );

}


// ======================================================
// TAXI
// ======================================================

function v4Taxi(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  /*
  SHADOW
  */

  v4rect(
    x+5,
    y+19,
    57,
    11,
    "rgba(0,0,0,.25)"
  );


  /*
  BODY
  */

  v4rect(
    x,
    y+10,
    64,
    16,
    "#416f67"
  );


  v4rect(
    x+13,
    y+3,
    35,
    12,
    "#35515a"
  );


  /*
  WINDOWS
  */

  v4rect(
    x+17,
    y+5,
    12,
    8,
    "#182c39"
  );


  v4rect(
    x+32,
    y+5,
    12,
    8,
    "#182c39"
  );


  /*
  LIGHTS
  */

  v4rect(
    x+59,
    y+15,
    5,
    5,
    "#f0d186"
  );


  /*
  WHEELS
  */

  v4rect(
    x+10,
    y+23,
    10,
    6,
    "#111317"
  );


  v4rect(
    x+46,
    y+23,
    10,
    6,
    "#111317"
  );


  /*
  TAXI TOP
  */

  v4rect(
    x+26,
    y,
    11,
    4,
    "#d4c48a"
  );

}


// ======================================================
// LAKE LIGHTS
// ======================================================

function v4LakeLights(){

  const points=[
    [5,8],
    [9,13],
    [4,20],
    [11,27]
  ];


  for(
    const p of
    points
  ){

    const x=
      p[0]*TILE-
      camera.x;


    const y=
      p[1]*TILE-
      camera.y;


    /*
    遠くの灯り
    */

    v4rect(
      x,
      y,
      3,
      2,
      "rgba(244,183,92,.45)"
    );


    /*
    水面への縦反射
    */

    v4rect(
      x+1,
      y+4,
      1,
      12,
      "rgba(237,174,82,.14)"
    );

  }

}


// ======================================================
// INTERIOR DECOR
// ======================================================

function v4InteriorDecor(){

  /*
  TEA HOUSE
  */

  if(
    currentMapId==="tea" ||
    currentMapId==="lakeTea"
  ){

    v4InteriorBeam(
      5*TILE,
      3*TILE,
      18*TILE
    );


    v4InteriorLamp(
      9*TILE,
      5*TILE
    );


    v4InteriorLamp(
      19*TILE,
      5*TILE
    );


    v4TeaShelf(
      4*TILE,
      5*TILE
    );


    v4TeaShelf(
      22*TILE,
      5*TILE
    );

  }


  /*
  NOODLE
  */

  else if(
    currentMapId==="noodle"
  ){

    v4InteriorLamp(
      8*TILE,
      6*TILE
    );


    v4InteriorLamp(
      18*TILE,
      6*TILE
    );


    v4KitchenSteam(
      14*TILE,
      5*TILE
    );

  }


  /*
  RESTAURANT
  */

  else if(
    currentMapId==="restaurant"
  ){

    v4InteriorLamp(
      8*TILE,
      6*TILE
    );


    v4InteriorLamp(
      14*TILE,
      6*TILE
    );


    v4InteriorLamp(
      20*TILE,
      6*TILE
    );


    v4RoundTable(
      9*TILE,
      11*TILE
    );


    v4RoundTable(
      19*TILE,
      11*TILE
    );

  }


  /*
  HOTEL
  */

  else if(
    currentMapId==="wulinHotel" ||
    currentMapId==="hangzhouHotel"
  ){

    v4HotelRug();


    v4InteriorLamp(
      9*TILE,
      8*TILE
    );


    v4InteriorLamp(
      19*TILE,
      8*TILE
    );


    v4HotelSofa(
      6*TILE,
      12*TILE
    );


    v4HotelSofa(
      20*TILE,
      12*TILE
    );

  }


  /*
  CULTURE
  */

  else if(
    currentMapId==="culture" ||
    currentMapId==="lakeGift"
  ){

    v4GalleryLight(
      9*TILE,
      5*TILE
    );


    v4GalleryLight(
      18*TILE,
      5*TILE
    );


    v4DisplayPedestal(
      10*TILE,
      10*TILE
    );


    v4DisplayPedestal(
      18*TILE,
      10*TILE
    );

  }


  /*
  CONVENIENCE
  */

  else if(
    currentMapId==="convenience" ||
    currentMapId==="cityStore"
  ){

    v4ConvenienceCeiling();

  }


  /*
  DRINK SHOP
  */

  else if(
    currentMapId==="drink"
  ){

    v4DrinkNeon();

  }

}


// ======================================================
// INTERIOR BEAM
// ======================================================

function v4InteriorBeam(
  wx,wy,width
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  v4rect(
    x,
    y,
    width,
    6,
    "#38231d"
  );


  v4rect(
    x,
    y+6,
    width,
    2,
    "#704531"
  );

}


// ======================================================
// INTERIOR LAMP
// ======================================================

function v4InteriorLamp(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  v4line(
    x,
    y-10,
    x,
    y,
    "#39251f"
  );


  v4glow(
    x,
    y+8,
    52,
    "rgba(255,163,75,.95)",
    .06
  );


  v4rect(
    x-7,
    y,
    14,
    14,
    "#9b432d"
  );


  v4rect(
    x-4,
    y+3,
    8,
    8,
    "#f0a34e"
  );

}


// ======================================================
// TEA SHELF
// ======================================================

function v4TeaShelf(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  v4rect(
    x,
    y,
    55,
    70,
    "#3b271f"
  );


  v4rect(
    x+4,
    y+5,
    47,
    60,
    "#553727"
  );


  for(
    let py=y+20;
    py<y+60;
    py+=20
  ){

    v4rect(
      x+4,
      py,
      47,
      3,
      "#2c1b17"
    );


    for(
      let px=x+9;
      px<x+46;
      px+=13
    ){

      v4rect(
        px,
        py-9,
        8,
        8,
        "#8b6848"
      );

    }

  }

}


// ======================================================
// KITCHEN STEAM
// ======================================================

function v4KitchenSteam(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  v4rect(
    x-30,
    y,
    60,
    8,
    "#493229"
  );


  v4rect(
    x-22,
    y-7,
    16,
    7,
    "#b8b1a0"
  );


  v4rect(
    x+5,
    y-7,
    16,
    7,
    "#b8b1a0"
  );

}


// ======================================================
// ROUND TABLE
// ======================================================

function v4RoundTable(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  ctx.save();

  ctx.fillStyle=
    "#74452e";

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    24,
    0,
    Math.PI*2
  );

  ctx.fill();


  ctx.fillStyle=
    "#a36a40";

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    18,
    0,
    Math.PI*2
  );

  ctx.fill();


  /*
  DISHES
  */

  ctx.fillStyle=
    "#d8c9a8";

  ctx.beginPath();

  ctx.arc(
    x-7,
    y-3,
    4,
    0,
    Math.PI*2
  );

  ctx.fill();


  ctx.beginPath();

  ctx.arc(
    x+8,
    y+5,
    4,
    0,
    Math.PI*2
  );

  ctx.fill();


  ctx.restore();

}


// ======================================================
// HOTEL RUG
// ======================================================

function v4HotelRug(){

  const x=
    10*TILE-
    camera.x;

  const y=
    12*TILE-
    camera.y;


  v4rect(
    x,
    y,
    8*TILE,
    3*TILE,
    "rgba(88,35,37,.30)"
  );


  ctx.strokeStyle=
    "rgba(211,164,96,.25)";

  ctx.lineWidth=2;


  ctx.strokeRect(
    x+6,
    y+6,
    8*TILE-12,
    3*TILE-12
  );

}


// ======================================================
// HOTEL SOFA
// ======================================================

function v4HotelSofa(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  v4rect(
    x,
    y,
    58,
    25,
    "#463c3a"
  );


  v4rect(
    x+4,
    y+4,
    50,
    13,
    "#69574f"
  );


  v4rect(
    x+4,
    y+18,
    50,
    9,
    "#51433e"
  );


  v4rect(
    x+6,
    y+27,
    4,
    5,
    "#292526"
  );


  v4rect(
    x+48,
    y+27,
    4,
    5,
    "#292526"
  );

}


// ======================================================
// GALLERY LIGHT
// ======================================================

function v4GalleryLight(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  v4rect(
    x-7,
    y,
    14,
    4,
    "#302b29"
  );


  v4glow(
    x,
    y+24,
    55,
    "rgba(255,211,153,.85)",
    .04
  );

}


// ======================================================
// DISPLAY PEDESTAL
// ======================================================

function v4DisplayPedestal(
  wx,wy
){

  const x=
    wx-camera.x;

  const y=
    wy-camera.y;


  v4rect(
    x-12,
    y,
    24,
    23,
    "#62594e"
  );


  v4rect(
    x-9,
    y-4,
    18,
    6,
    "#8a7c6a"
  );


  /*
  JADE OBJECT
  */

  v4rect(
    x-5,
    y-14,
    10,
    10,
    "#789a80"
  );


  v4rect(
    x-2,
    y-17,
    4,
    4,
    "#9cb69b"
  );

}


// ======================================================
// CONVENIENCE CEILING
// ======================================================

function v4ConvenienceCeiling(){

  for(
    let x=5*TILE;
    x<23*TILE;
    x+=4*TILE
  ){

    const sx=
      x-camera.x;


    const sy=
      4*TILE-camera.y;


    v4rect(
      sx,
      sy,
      70,
      4,
      "rgba(225,237,228,.48)"
    );


    v4glow(
      sx+35,
      sy+5,
      55,
      "rgba(220,242,230,.85)",
      .025
    );

  }

}


// ======================================================
// DRINK NEON
// ======================================================

function v4DrinkNeon(){

  const x=
    7*TILE-camera.x;

  const y=
    3*TILE-camera.y;


  v4rect(
    x,
    y,
    14*TILE,
    3,
    "rgba(93,211,190,.40)"
  );


  v4glow(
    x+7*TILE,
    y+10,
    150,
    "rgba(76,193,174,.8)",
    .025
  );

}


// ======================================================
// NIGHT REFLECTIONS
// ======================================================

function v4DrawReflections(time){

  const map=
    v4map();


  if(
    map.ambient==="indoor"
  ){
    return;
  }


  /*
  店舗・提灯の光が石畳に少しだけ映る。

  強くすると床がベタ塗りになるので
  非常に薄くしている。
  */


  for(
    const b of
    map.buildings||[]
  ){

    const centerX=
      (
        b.x+
        b.w/2
      )*TILE-
      camera.x;


    const bottomY=
      (
        b.y+
        b.h
      )*TILE-
      camera.y;


    if(
      centerX<-100 ||
      centerX>canvas.width+100 ||
      bottomY<-50 ||
      bottomY>canvas.height+100
    ){
      continue;
    }


    const g=
      ctx.createLinearGradient(
        centerX,
        bottomY,
        centerX,
        bottomY+80
      );


    g.addColorStop(
      0,
      "rgba(229,103,45,.075)"
    );


    g.addColorStop(
      1,
      "rgba(229,103,45,0)"
    );


    ctx.fillStyle=g;


    ctx.fillRect(
      centerX-38,
      bottomY,
      76,
      80
    );


    /*
    石畳らしく縦反射を分断。
    */

    v4rect(
      centerX-24,
      bottomY+12,
      12,
      2,
      "rgba(255,169,78,.06)"
    );


    v4rect(
      centerX+5,
      bottomY+30,
      17,
      2,
      "rgba(255,169,78,.045)"
    );

  }

}


// ======================================================
// FINAL DRAW
// ======================================================

draw=function(time){

  /*
  game.js 本体。
  */

  V4_originalDraw(time);


  /*
  地面への弱い光反射。
  */

  v4DrawReflections(time);


  /*
  ごく薄い色調補正。

  黒いオーバーレイは使用しない。
  */

  const map=
    v4map();


  if(
    map.ambient==="indoor"
  ){

    ctx.fillStyle=
      "rgba(255,158,82,.010)";

  }


  else if(
    map.ambient==="lake"
  ){

    ctx.fillStyle=
      "rgba(45,98,126,.010)";

  }


  else{

    ctx.fillStyle=
      "rgba(255,111,55,.008)";

  }


  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

};


console.log(
  "杭州探索録 Visual Enhancement Ver.4 loaded"
);
