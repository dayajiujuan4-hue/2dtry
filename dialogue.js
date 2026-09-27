"use strict";

const NPCS=[

  // ====================================================
  // 小吃街
  // ====================================================

  {
    map:"food",
    name:"烧烤屋の老板",
    label:"串",
    x:18*TILE,
    y:12*TILE,
    color:"#a54134",
    hair:"#241b1b",
    skin:"#dda67d",
    direction:"down",
    wander:false,
    rewards:[
      "yangrouchuan",
      "kaochuan",
      "yahe"
    ],
    dialogue:[
      "来来来！刚烤好的羊肉串！",
      "焼きたてだよ。夜市ではこういう烤串が人気なんだ。",
      "声を出してお客さんを呼ぶことを吆喝とも言うよ。"
    ]
  },

  {
    map:"food",
    name:"浙江大学の学生",
    label:"学",
    x:25*TILE,
    y:18*TILE,
    color:"#566ba0",
    hair:"#20222c",
    skin:"#e2b28b",
    direction:"left",
    wander:true,
    range:70,
    rewards:[
      "jiangnan",
      "hangcheng"
    ],
    dialogue:[
      "杭州を旅行してるの？",
      "杭州は江南を代表する都市の一つだね。",
      "文章なんかでは杭城という呼び方を見ることもあるよ。"
    ]
  },

  {
    map:"food",
    name:"夜市に来た子ども",
    label:"童",
    x:29*TILE,
    y:20*TILE,
    color:"#d38b42",
    hair:"#30211d",
    skin:"#e5b18b",
    direction:"left",
    wander:true,
    range:60,
    rewards:[
      "xiaolongbao",
      "shengjian"
    ],
    dialogue:[
      "小笼包だ！",
      "あっちには生煎もある！",
      "まだ帰りたくない！"
    ]
  },

  {
    map:"food",
    name:"仕事帰りの男性",
    label:"客",
    x:24*TILE,
    y:28*TILE,
    color:"#4d6275",
    hair:"#272126",
    skin:"#d8a57f",
    direction:"up",
    wander:true,
    range:70,
    rewards:[
      "yexiao",
      "renao"
    ],
    dialogue:[
      "仕事帰りに寄ったんだ。",
      "この時間になると夜宵が食べたくなる。",
      "この賑やかさ、中国語なら热闹って感じだね。"
    ]
  },

  {
    map:"food",
    name:"小吃を選ぶ女性",
    label:"食",
    x:31*TILE,
    y:16*TILE,
    color:"#96586b",
    hair:"#32232a",
    skin:"#dfab84",
    direction:"right",
    wander:true,
    range:55,
    rewards:[
      "xiaochi",
      "kouwei"
    ],
    dialogue:[
      "何を食べようかな……。",
      "小吃が多すぎて迷っちゃう。",
      "辛いのが好き？どんな口味が好き？"
    ]
  },

  {
    map:"food",
    name:"屋台を眺めるおじさん",
    label:"街",
    x:21*TILE,
    y:22*TILE,
    color:"#655f51",
    hair:"#4b4540",
    skin:"#d2a17b",
    direction:"right",
    wander:false,
    rewards:[
      "yandihuo",
      "shijing"
    ],
    dialogue:[
      "こういう場所はいいな。",
      "高級な店とは違う、生活の匂いがある。",
      "中国では烟火气とか市井の雰囲気なんて言ったりするな。"
    ]
  },


  // ====================================================
  // 雑貨街
  // ====================================================

  {
    map:"market",
    name:"奶茶を持った女性",
    label:"茶",
    x:22*TILE,
    y:20*TILE,
    color:"#a55b77",
    hair:"#382527",
    skin:"#e4b18b",
    direction:"down",
    wander:true,
    range:70,
    rewards:[
      "guangjie",
      "renlaorenwang"
    ],
    dialogue:[
      "夜市で逛街するのって楽しいよね。",
      "この時間は本当に人来人往。",
      "見ているだけでも飽きないよ。"
    ]
  },

  {
    map:"market",
    name:"買い物中の青年",
    label:"客",
    x:29*TILE,
    y:19*TILE,
    color:"#5c6c8d",
    hair:"#25222b",
    skin:"#dda983",
    direction:"left",
    wander:true,
    range:70,
    rewards:[
      "saoma",
      "fukuan",
      "erweima"
    ],
    dialogue:[
      "スマホケースを買ったところ。",
      "二维码を扫码して、そのまま付款。",
      "本当に便利だよ。"
    ]
  },

  {
    map:"market",
    name:"文創グッズを見る青年",
    label:"文",
    x:26*TILE,
    y:25*TILE,
    color:"#65547e",
    hair:"#28212b",
    skin:"#dba77f",
    direction:"left",
    wander:false,
    rewards:[
      "wenchuang"
    ],
    dialogue:[
      "最近は博物館系の文创グッズも人気だよ。",
      "文化を現代のデザインに落とし込んでいるのが面白いね。"
    ]
  },


  // ====================================================
  // ホテル街
  // ====================================================

  {
    map:"hotel",
    name:"ホテルの宿泊客",
    label:"旅",
    x:23*TILE,
    y:18*TILE,
    color:"#76628e",
    hair:"#31242c",
    skin:"#dbaa83",
    direction:"right",
    wander:true,
    range:65,
    rewards:[
      "luxian",
      "jiequ"
    ],
    dialogue:[
      "この路线で西湖まで歩けるみたい。",
      "武林の街区を歩いていくのも楽しそうだね。"
    ]
  },

  {
    map:"hotel",
    name:"外卖の配達員",
    label:"送",
    x:30*TILE,
    y:25*TILE,
    color:"#d3a738",
    hair:"#29252b",
    skin:"#d9a57d",
    direction:"left",
    wander:true,
    range:70,
    rewards:[
      "waimai",
      "diandongche"
    ],
    dialogue:[
      "外卖の受け取り？",
      "ごめん、今配達中なんだ。",
      "この辺は电动车で走ると便利なんだよ。"
    ]
  },


  // ====================================================
  // 西湖
  // ====================================================

  {
    map:"lake",
    name:"湖畔のおじいさん",
    label:"湖",
    x:27*TILE,
    y:17*TILE,
    color:"#63705b",
    hair:"#b9b5aa",
    skin:"#d5a47d",
    direction:"left",
    wander:false,
    rewards:[
      "shiyi",
      "wenren",
      "yese"
    ],
    dialogue:[
      "夜の西湖には独特の诗意がある。",
      "昔から多くの文人がこの湖を書いてきた。",
      "この夜色を見れば、その気持ちも少し分かるだろう。"
    ]
  },

  {
    map:"lake",
    name:"散歩中の女性",
    label:"歩",
    x:30*TILE,
    y:10*TILE,
    color:"#865e71",
    hair:"#33242b",
    skin:"#dfaa83",
    direction:"down",
    wander:true,
    range:90,
    rewards:[
      "fengjing",
      "daoying"
    ],
    dialogue:[
      "湖面を見てください。",
      "街の灯りの倒影がきれいでしょう？",
      "西湖は夜の风景も素敵なんです。"
    ]
  },

  {
    map:"lake",
    name:"文学好きの学生",
    label:"诗",
    x:25*TILE,
    y:27*TILE,
    color:"#53677c",
    hair:"#28242a",
    skin:"#dda983",
    direction:"left",
    wander:false,
    rewards:[
      "yongjing",
      "shuqing",
      "miaoxie"
    ],
    dialogue:[
      "西湖を題材にした作品は本当に多いですね。",
      "景色を咏景しながら、自分の感情を抒情する。",
      "同じ風景でも描写の仕方で印象が変わります。"
    ]
  },


  // ====================================================
  // 茶館
  // ====================================================

  {
    map:"tea",
    name:"茶館の老板",
    label:"茶",
    x:8*TILE,
    y:8*TILE,
    color:"#72503c",
    hair:"#2c221f",
    skin:"#d9a77f",
    direction:"down",
    wander:false,
    rewards:[
      "longjingcha",
      "xihulongjing",
      "paocha"
    ],
    dialogue:[
      "欢迎光临。座っていきなさい。",
      "杭州といえば龙井茶。",
      "中でも西湖龙井という名前はよく知られている。",
      "茶叶を見ながら、ゆっくり泡茶するんだ。"
    ]
  },

  {
    map:"tea",
    name:"茶館の常連客",
    label:"客",
    x:18*TILE,
    y:11*TILE,
    color:"#58684c",
    hair:"#34302a",
    skin:"#d3a27b",
    direction:"left",
    wander:false,
    rewards:[
      "fengya",
      "pingcha"
    ],
    dialogue:[
      "外は賑やかだけど、ここは静かだろう？",
      "ゆっくり品茶する時間もいい。",
      "昔なら、こういう楽しみを风雅と呼んだのかもしれないな。"
    ]
  },


  // ====================================================
  // 面館
  // ====================================================

  {
    map:"noodle",
    name:"面館の老板",
    label:"麺",
    x:8*TILE,
    y:8*TILE,
    color:"#8b4c37",
    hair:"#2d2421",
    skin:"#dca77e",
    direction:"down",
    wander:false,
    rewards:[
      "pianerchuan",
      "tang",
      "xian"
    ],
    dialogue:[
      "杭州に来たなら片儿川を食べてみるといい。",
      "汤まで飲んでいきな。",
      "こういう旨味を鲜と言うこともあるよ。"
    ]
  },

  {
    map:"noodle",
    name:"麺を食べる客",
    label:"客",
    x:17*TILE,
    y:12*TILE,
    color:"#526985",
    hair:"#28232a",
    skin:"#dda983",
    direction:"left",
    wander:false,
    rewards:[
      "xiang",
      "caidan"
    ],
    dialogue:[
      "真香！",
      "何を注文するか迷ったら菜单を見てみるといいよ。",
      "でも俺はいつも同じものを頼んじゃうけどね。"
    ]
  },


  // ====================================================
  // 食堂
  // ====================================================

  {
    map:"restaurant",
    name:"食堂のおばさん",
    label:"食",
    x:9*TILE,
    y:8*TILE,
    color:"#8d4d43",
    hair:"#3b2927",
    skin:"#daa47d",
    direction:"down",
    wander:false,
    rewards:[
      "shitang",
      "zhaopaicai",
      "zhanliao"
    ],
    dialogue:[
      "座って座って！ここは普通の食堂だよ。",
      "うちの招牌菜も食べてみな。",
      "蘸料はそっちに置いてあるよ。"
    ]
  },


  // ====================================================
  // 文創
  // ====================================================

  {
    map:"culture",
    name:"文創店の店員",
    label:"文",
    x:14*TILE,
    y:5*TILE,
    color:"#65547e",
    hair:"#302630",
    skin:"#dfab85",
    direction:"down",
    wander:false,
    rewards:[
      "liangzhu",
      "yucong",
      "yuqi"
    ],
    dialogue:[
      "こちらは良渚文化を題材にした商品です。",
      "この形は玉琮。",
      "良渚文化では多くの玉器が知られています。"
    ]
  },


  // ====================================================
  // 百貨店
  // ====================================================

  {
    map:"department",
    name:"百貨店の店員",
    label:"店",
    x:14*TILE,
    y:5*TILE,
    color:"#6a5577",
    hair:"#322831",
    skin:"#dfaa84",
    direction:"down",
    wander:false,
    rewards:[
      "sichou"
    ],
    dialogue:[
      "杭州のお土産をお探しですか？",
      "杭州は丝绸でも知られています。",
      "夜市とは違った買い物も楽しめますよ。"
    ]
  },


  // ====================================================
  // 湖滨茶室
  // ====================================================

  {
    map:"lakeTea",
    name:"湖滨茶室の主人",
    label:"茶",
    x:14*TILE,
    y:7*TILE,
    color:"#5d6045",
    hair:"#342a26",
    skin:"#d7a37c",
    direction:"down",
    wander:false,
    rewards:[
      "yijing",
      "shici",
      "diangu"
    ],
    dialogue:[
      "窓から西湖を見てごらん。",
      "中国の诗词では意境を大切にする。",
      "古い作品には典故が使われることも多いんだ。"
    ]
  },


  // ====================================================
  // 西湖礼物
  // ====================================================

  {
    map:"lakeGift",
    name:"土産店の店員",
    label:"礼",
    x:14*TILE,
    y:6*TILE,
    color:"#536b78",
    hair:"#30282c",
    skin:"#dda983",
    direction:"down",
    wander:false,
    rewards:[
      "duanqiao",
      "sudi",
      "baiDi"
    ],
    dialogue:[
      "こちらは断桥の絵葉書。",
      "こちらは苏堤、こちらは白堤です。",
      "場所を知ってから見ると、お土産も面白くなりますよ。"
    ]
  }

];
