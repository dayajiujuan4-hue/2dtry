"use strict";

const VOCABULARY = {

  // ====================================================
  // 01-20 夜市・街歩き
  // ====================================================

  tanwei:{
    word:"摊位",
    pinyin:"tānwèi",
    meaning:"露店・屋台の売り場",
    category:"夜市・街歩き",
    example:"夜市里有很多摊位。",
    exampleJa:"夜市にはたくさんの露店がある。",
    location:"武林夜市"
  },

  tanzhu:{
    word:"摊主",
    pinyin:"tānzhǔ",
    meaning:"露店・屋台の店主",
    category:"夜市・街歩き",
    example:"摊主正在招呼客人。",
    exampleJa:"屋台の店主がお客さんを呼び込んでいる。",
    location:"武林夜市"
  },

  yahe:{
    word:"吆喝",
    pinyin:"yāohe",
    meaning:"大声で呼び込みをする",
    category:"夜市・街歩き",
    example:"摊主在街边吆喝。",
    exampleJa:"店主が通りで呼び込みをしている。",
    location:"武林夜市"
  },

  lanke:{
    word:"揽客",
    pinyin:"lǎnkè",
    meaning:"客を呼び込む",
    category:"夜市・街歩き",
    example:"店员站在门口揽客。",
    exampleJa:"店員が入口で客を呼び込んでいる。",
    location:"武林夜市"
  },

  paidui:{
    word:"排队",
    pinyin:"páiduì",
    meaning:"列に並ぶ",
    category:"夜市・街歩き",
    example:"大家排队买小吃。",
    exampleJa:"みんな軽食を買うために並んでいる。",
    location:"武林夜市"
  },

  saoma:{
    word:"扫码",
    pinyin:"sǎomǎ",
    meaning:"QRコードを読み取る",
    category:"夜市・街歩き",
    example:"这里可以扫码付款。",
    exampleJa:"ここではQRコード決済ができる。",
    location:"武林夜市"
  },

  fukuan:{
    word:"付款",
    pinyin:"fùkuǎn",
    meaning:"支払いをする",
    category:"夜市・街歩き",
    example:"买完东西以后付款。",
    exampleJa:"商品を買ったあと支払いをする。",
    location:"武林夜市"
  },

  dabao:{
    word:"打包",
    pinyin:"dǎbāo",
    meaning:"持ち帰り用に包む",
    category:"夜市・街歩き",
    example:"吃不完可以打包。",
    exampleJa:"食べきれなければ持ち帰りにできる。",
    location:"武林夜市"
  },

  zhaopai:{
    word:"招牌",
    pinyin:"zhāopái",
    meaning:"看板／店の名物",
    category:"夜市・街歩き",
    example:"这是他们家的招牌菜。",
    exampleJa:"これはこの店の看板料理だ。",
    location:"武林夜市"
  },

  jiamubiao:{
    word:"价目表",
    pinyin:"jiàmùbiǎo",
    meaning:"料金表・価格表",
    category:"夜市・街歩き",
    example:"价目表挂在摊位旁边。",
    exampleJa:"価格表が屋台の横に掛かっている。",
    location:"武林夜市"
  },

  renao:{
    word:"热闹",
    pinyin:"rènao",
    meaning:"賑やかで活気がある",
    category:"夜市・街歩き",
    example:"晚上的夜市很热闹。",
    exampleJa:"夜の夜市はとても賑やかだ。",
    location:"武林夜市"
  },

  renlaorenwang:{
    word:"人来人往",
    pinyin:"rén lái rén wǎng",
    meaning:"人々が絶えず行き交う",
    category:"夜市・街歩き",
    example:"街上人来人往。",
    exampleJa:"通りを人々が絶えず行き交っている。",
    location:"武林夜市"
  },

  renqun:{
    word:"人群",
    pinyin:"rénqún",
    meaning:"人混み・群衆",
    category:"夜市・街歩き",
    example:"他消失在人群里。",
    exampleJa:"彼は人混みの中に消えた。",
    location:"武林夜市"
  },

  guangjie:{
    word:"逛街",
    pinyin:"guàngjiē",
    meaning:"街をぶらぶら歩いて買い物する",
    category:"夜市・街歩き",
    example:"晚上一起去逛街吧。",
    exampleJa:"夜、一緒に街をぶらつこう。",
    location:"武林夜市"
  },

  luxiantan:{
    word:"路边摊",
    pinyin:"lùbiāntān",
    meaning:"道端の屋台",
    category:"夜市・街歩き",
    example:"路边摊很有烟火气。",
    exampleJa:"道端の屋台には生活感がある。",
    location:"武林夜市"
  },

  shouTan:{
    word:"收摊",
    pinyin:"shōutān",
    meaning:"露店を片付けて営業を終える",
    category:"夜市・街歩き",
    example:"已经很晚了，摊主开始收摊。",
    exampleJa:"もう遅いので店主が店じまいを始めた。",
    location:"武林夜市"
  },

  baitan:{
    word:"摆摊",
    pinyin:"bǎitān",
    meaning:"露店を出す",
    category:"夜市・街歩き",
    example:"他每天晚上都来这里摆摊。",
    exampleJa:"彼は毎晩ここに露店を出す。",
    location:"武林夜市"
  },

  denglong:{
    word:"灯笼",
    pinyin:"dēnglong",
    meaning:"提灯",
    category:"夜市・街歩き",
    example:"街上挂着红灯笼。",
    exampleJa:"通りには赤い提灯が掛かっている。",
    location:"武林夜市"
  },

  xiaoxiang:{
    word:"小巷",
    pinyin:"xiǎoxiàng",
    meaning:"細い路地",
    category:"夜市・街歩き",
    example:"小巷里藏着很多小店。",
    exampleJa:"路地にはたくさんの小さな店が隠れている。",
    location:"武林夜市"
  },

  yandihuo:{
    word:"烟火气",
    pinyin:"yānhuǒqì",
    meaning:"庶民の暮らしを感じさせる活気・生活感",
    category:"夜市・街歩き",
    example:"夜市最吸引人的就是烟火气。",
    exampleJa:"夜市の魅力は何といっても生活感だ。",
    location:"武林夜市"
  },


  // ====================================================
  // 21-40 食文化
  // ====================================================

  kaochuan:{
    word:"烤串",
    pinyin:"kǎochuàn",
    meaning:"串焼き",
    category:"食文化",
    example:"老板正在烤串。",
    exampleJa:"店主が串焼きを焼いている。",
    location:"小吃街"
  },

  yangrouchuan:{
    word:"羊肉串",
    pinyin:"yángròuchuàn",
    meaning:"羊肉の串焼き",
    category:"食文化",
    example:"我要两串羊肉串。",
    exampleJa:"羊肉串を2本ください。",
    location:"小吃街"
  },

  xiaolongbao:{
    word:"小笼包",
    pinyin:"xiǎolóngbāo",
    meaning:"小籠包",
    category:"食文化",
    example:"小笼包刚蒸好。",
    exampleJa:"小籠包がちょうど蒸し上がった。",
    location:"小吃街"
  },

  shengjian:{
    word:"生煎",
    pinyin:"shēngjiān",
    meaning:"焼き小籠包",
    category:"食文化",
    example:"生煎的底很脆。",
    exampleJa:"生煎の底はカリッとしている。",
    location:"小吃街"
  },

  choudoufu:{
    word:"臭豆腐",
    pinyin:"chòudòufu",
    meaning:"発酵豆腐を使った軽食",
    category:"食文化",
    example:"臭豆腐闻起来很特别。",
    exampleJa:"臭豆腐は独特な匂いがする。",
    location:"小吃街"
  },

  congbaohui:{
    word:"葱包桧",
    pinyin:"cōngbāohuì",
    meaning:"杭州の伝統的な軽食",
    category:"食文化",
    example:"葱包桧是杭州传统小吃。",
    exampleJa:"葱包桧は杭州の伝統的な軽食だ。",
    location:"小吃街"
  },

  pianerchuan:{
    word:"片儿川",
    pinyin:"piànrchuān",
    meaning:"杭州の代表的な麺料理",
    category:"食文化",
    example:"片儿川是杭州传统面食。",
    exampleJa:"片儿川は杭州の伝統的な麺料理だ。",
    location:"杭州面馆"
  },

  xiaochi:{
    word:"小吃",
    pinyin:"xiǎochī",
    meaning:"軽食・ローカルスナック",
    category:"食文化",
    example:"杭州有很多特色小吃。",
    exampleJa:"杭州には特色ある軽食が多い。",
    location:"武林夜市"
  },

  yexiao:{
    word:"夜宵",
    pinyin:"yèxiāo",
    meaning:"夜食",
    category:"食文化",
    example:"我们去吃夜宵吧。",
    exampleJa:"夜食を食べに行こう。",
    location:"武林夜市"
  },

  chuguo:{
    word:"出锅",
    pinyin:"chūguō",
    meaning:"鍋から料理を取り出す・出来上がる",
    category:"食文化",
    example:"生煎马上出锅。",
    exampleJa:"生煎がもうすぐ出来上がる。",
    location:"小吃街"
  },

  zhanliao:{
    word:"蘸料",
    pinyin:"zhànliào",
    meaning:"料理につけるタレ・調味料",
    category:"食文化",
    example:"这个蘸料有点辣。",
    exampleJa:"このつけダレは少し辛い。",
    location:"夜市食堂"
  },

  tang:{
    word:"汤",
    pinyin:"tāng",
    meaning:"スープ・汁物",
    category:"食文化",
    example:"这碗面的汤很鲜。",
    exampleJa:"この麺のスープは旨味がある。",
    location:"杭州面馆"
  },

  xiang:{
    word:"香",
    pinyin:"xiāng",
    meaning:"香りがよい・おいしそう",
    category:"食文化",
    example:"烤串闻起来真香。",
    exampleJa:"串焼きが本当にいい匂いだ。",
    location:"小吃街"
  },

  xian:{
    word:"鲜",
    pinyin:"xiān",
    meaning:"新鮮である／旨味がある",
    category:"食文化",
    example:"这个汤味道很鲜。",
    exampleJa:"このスープはとても旨味がある。",
    location:"杭州面馆"
  },

  cui:{
    word:"脆",
    pinyin:"cuì",
    meaning:"パリパリ・サクサクしている",
    category:"食文化",
    example:"生煎的底特别脆。",
    exampleJa:"生煎の底は特にカリッとしている。",
    location:"小吃街"
  },

  xiangla:{
    word:"香辣",
    pinyin:"xiānglà",
    meaning:"香り高く辛い",
    category:"食文化",
    example:"我喜欢香辣口味。",
    exampleJa:"私は香り高く辛い味が好きだ。",
    location:"小吃街"
  },

  shitang:{
    word:"食堂",
    pinyin:"shítáng",
    meaning:"食堂",
    category:"食文化",
    example:"附近有一家小食堂。",
    exampleJa:"近くに小さな食堂がある。",
    location:"夜市食堂"
  },

  caidan:{
    word:"菜单",
    pinyin:"càidān",
    meaning:"メニュー",
    category:"食文化",
    example:"先看看菜单吧。",
    exampleJa:"まずメニューを見よう。",
    location:"杭州面馆"
  },

  zhaopaicai:{
    word:"招牌菜",
    pinyin:"zhāopáicài",
    meaning:"看板料理",
    category:"食文化",
    example:"这是本店的招牌菜。",
    exampleJa:"これは当店の看板料理だ。",
    location:"夜市食堂"
  },

  kouwei:{
    word:"口味",
    pinyin:"kǒuwèi",
    meaning:"味・味の好み",
    category:"食文化",
    example:"你喜欢什么口味？",
    exampleJa:"どんな味が好きですか。",
    location:"武林夜市"
  },


  // ====================================================
  // 41-60 杭州・西湖
  // ====================================================

  xihu:{
    word:"西湖",
    pinyin:"Xī Hú",
    meaning:"杭州市を代表する湖、西湖",
    category:"杭州・西湖",
    example:"晚上去西湖散步。",
    exampleJa:"夜、西湖へ散歩に行く。",
    location:"西湖"
  },

  hubin:{
    word:"湖滨",
    pinyin:"húbīn",
    meaning:"湖畔・湖のほとり",
    category:"杭州・西湖",
    example:"湖滨一带晚上很漂亮。",
    exampleJa:"湖畔一帯は夜になると美しい。",
    location:"西湖"
  },

  duanqiao:{
    word:"断桥",
    pinyin:"Duànqiáo",
    meaning:"西湖の名所・断橋",
    category:"杭州・西湖",
    example:"断桥是西湖著名景点。",
    exampleJa:"断橋は西湖の有名な名所だ。",
    location:"西湖"
  },

  sudi:{
    word:"苏堤",
    pinyin:"Sūdī",
    meaning:"西湖を南北に延びる堤",
    category:"杭州・西湖",
    example:"游客沿着苏堤散步。",
    exampleJa:"観光客が蘇堤を歩いている。",
    location:"西湖"
  },

  baiDi:{
    word:"白堤",
    pinyin:"Báidī",
    meaning:"西湖にある堤の一つ",
    category:"杭州・西湖",
    example:"白堤连接着湖边景点。",
    exampleJa:"白堤は湖畔の名所を結んでいる。",
    location:"西湖"
  },

  santanyinyue:{
    word:"三潭印月",
    pinyin:"Sāntán Yìnyuè",
    meaning:"西湖十景の一つ",
    category:"杭州・西湖",
    example:"三潭印月是西湖十景之一。",
    exampleJa:"三潭印月は西湖十景の一つだ。",
    location:"西湖"
  },

  quyuanfenghe:{
    word:"曲院风荷",
    pinyin:"Qūyuàn Fēnghé",
    meaning:"西湖十景の一つ",
    category:"杭州・西湖",
    example:"夏天适合看曲院风荷。",
    exampleJa:"夏は曲院風荷を見るのに適している。",
    location:"西湖"
  },

  leifengta:{
    word:"雷峰塔",
    pinyin:"Léifēng Tǎ",
    meaning:"西湖の南岸にある塔",
    category:"杭州・西湖",
    example:"雷峰塔在西湖南岸。",
    exampleJa:"雷峰塔は西湖の南岸にある。",
    location:"西湖"
  },

  huafang:{
    word:"画舫",
    pinyin:"huàfǎng",
    meaning:"装飾された遊覧船",
    category:"杭州・西湖",
    example:"湖面上有一艘画舫。",
    exampleJa:"湖面に装飾船が浮かんでいる。",
    location:"西湖"
  },

  youchuan:{
    word:"游船",
    pinyin:"yóuchuán",
    meaning:"遊覧船",
    category:"杭州・西湖",
    example:"我们坐游船看西湖。",
    exampleJa:"遊覧船に乗って西湖を見る。",
    location:"西湖"
  },

  daoying:{
    word:"倒影",
    pinyin:"dàoyǐng",
    meaning:"水面などに映る姿・反射",
    category:"杭州・西湖",
    example:"灯光在湖面上留下倒影。",
    exampleJa:"灯りが湖面に映っている。",
    location:"西湖"
  },

  chuiliu:{
    word:"垂柳",
    pinyin:"chuíliǔ",
    meaning:"枝が垂れ下がる柳",
    category:"杭州・西湖",
    example:"湖边种着很多垂柳。",
    exampleJa:"湖畔には多くの柳が植えられている。",
    location:"西湖"
  },

  longjingcha:{
    word:"龙井茶",
    pinyin:"Lóngjǐngchá",
    meaning:"杭州を代表する緑茶、龍井茶",
    category:"杭州・西湖",
    example:"杭州的龙井茶很有名。",
    exampleJa:"杭州の龍井茶は有名だ。",
    location:"老杭州茶馆"
  },

  xihulongjing:{
    word:"西湖龙井",
    pinyin:"Xīhú Lóngjǐng",
    meaning:"西湖周辺の産地で作られる龍井茶",
    category:"杭州・西湖",
    example:"西湖龙井是杭州名茶。",
    exampleJa:"西湖龍井は杭州を代表する茶だ。",
    location:"老杭州茶馆"
  },

  chayuan:{
    word:"茶园",
    pinyin:"cháyuán",
    meaning:"茶畑・茶園",
    category:"杭州・西湖",
    example:"山坡上有大片茶园。",
    exampleJa:"山の斜面に広い茶畑がある。",
    location:"杭州文化"
  },

  yunhe:{
    word:"运河",
    pinyin:"yùnhé",
    meaning:"運河",
    category:"杭州・西湖",
    example:"京杭大运河经过杭州。",
    exampleJa:"京杭大運河は杭州を通っている。",
    location:"杭州"
  },

  jinghangdayunhe:{
    word:"京杭大运河",
    pinyin:"Jīng-Háng Dàyùnhé",
    meaning:"北京と杭州を結ぶ大運河",
    category:"杭州・西湖",
    example:"京杭大运河连接北京和杭州。",
    exampleJa:"京杭大運河は北京と杭州を結ぶ。",
    location:"杭州"
  },

  wulin:{
    word:"武林",
    pinyin:"Wǔlín",
    meaning:"杭州中心部に残る歴史的地名",
    category:"杭州・西湖",
    example:"武林是杭州的重要地名。",
    exampleJa:"武林は杭州の重要な地名だ。",
    location:"武林"
  },

  hangcheng:{
    word:"杭城",
    pinyin:"Hángchéng",
    meaning:"杭州を指す雅称・呼称",
    category:"杭州・西湖",
    example:"夜色中的杭城很美。",
    exampleJa:"夜の杭州の街は美しい。",
    location:"杭州"
  },

  jiangnan:{
    word:"江南",
    pinyin:"Jiāngnán",
    meaning:"長江下流南岸を中心とする地域概念",
    category:"杭州・西湖",
    example:"杭州是江南名城。",
    exampleJa:"杭州は江南を代表する都市だ。",
    location:"杭州"
  },


  // ====================================================
  // 61-75 歴史・文化
  // ====================================================

  liangzhu:{
    word:"良渚",
    pinyin:"Liángzhǔ",
    meaning:"杭州周辺の古代文化・遺跡で知られる地名",
    category:"歴史・文化",
    example:"良渚文化以玉器闻名。",
    exampleJa:"良渚文化は玉器で知られている。",
    location:"杭州文创"
  },

  yucong:{
    word:"玉琮",
    pinyin:"yùcóng",
    meaning:"良渚文化を代表する玉器の一種",
    category:"歴史・文化",
    example:"玉琮是重要的良渚玉器。",
    exampleJa:"玉琮は重要な良渚の玉器だ。",
    location:"杭州文创"
  },

  yuqi:{
    word:"玉器",
    pinyin:"yùqì",
    meaning:"玉で作られた器物",
    category:"歴史・文化",
    example:"博物馆里展示着玉器。",
    exampleJa:"博物館に玉器が展示されている。",
    location:"杭州文创"
  },

  nansong:{
    word:"南宋",
    pinyin:"Nán Sòng",
    meaning:"宋王朝後半期の王朝",
    category:"歴史・文化",
    example:"杭州曾是南宋都城。",
    exampleJa:"杭州は南宋の都だった。",
    location:"杭州文化"
  },

  linan:{
    word:"临安",
    pinyin:"Lín'ān",
    meaning:"南宋期の都としての杭州の名称",
    category:"歴史・文化",
    example:"南宋时期杭州称临安。",
    exampleJa:"南宋時代、杭州は臨安と呼ばれた。",
    location:"杭州文化"
  },

  ducheng:{
    word:"都城",
    pinyin:"dūchéng",
    meaning:"王朝の首都",
    category:"歴史・文化",
    example:"临安曾是南宋都城。",
    exampleJa:"臨安は南宋の都だった。",
    location:"杭州文化"
  },

  wenchuang:{
    word:"文创",
    pinyin:"wénchuàng",
    meaning:"文化を題材にした創意・文化クリエイティブ",
    category:"歴史・文化",
    example:"这里卖杭州文创产品。",
    exampleJa:"ここでは杭州の文化グッズを売っている。",
    location:"杭州文创"
  },

  sichou:{
    word:"丝绸",
    pinyin:"sīchóu",
    meaning:"絹・シルク",
    category:"歴史・文化",
    example:"杭州丝绸很有名。",
    exampleJa:"杭州の絹は有名だ。",
    location:"武林百货"
  },

  chaguan:{
    word:"茶馆",
    pinyin:"cháguǎn",
    meaning:"茶館",
    category:"歴史・文化",
    example:"老街上有一家茶馆。",
    exampleJa:"古い通りに茶館がある。",
    location:"老杭州茶馆"
  },

  chaju:{
    word:"茶具",
    pinyin:"chájù",
    meaning:"茶器",
    category:"歴史・文化",
    example:"桌上摆着一套茶具。",
    exampleJa:"机に一式の茶器が置いてある。",
    location:"老杭州茶馆"
  },

  chaye:{
    word:"茶叶",
    pinyin:"cháyè",
    meaning:"茶葉",
    category:"歴史・文化",
    example:"这些茶叶很香。",
    exampleJa:"この茶葉は香りがよい。",
    location:"老杭州茶馆"
  },

  paocha:{
    word:"泡茶",
    pinyin:"pàochá",
    meaning:"茶を淹れる",
    category:"歴史・文化",
    example:"老板正在泡茶。",
    exampleJa:"店主がお茶を淹れている。",
    location:"老杭州茶馆"
  },

  pingcha:{
    word:"品茶",
    pinyin:"pǐnchá",
    meaning:"茶を味わい鑑賞する",
    category:"歴史・文化",
    example:"坐下来慢慢品茶。",
    exampleJa:"座ってゆっくり茶を味わう。",
    location:"老杭州茶馆"
  },

  chuantong:{
    word:"传统",
    pinyin:"chuántǒng",
    meaning:"伝統",
    category:"歴史・文化",
    example:"这是杭州的传统文化。",
    exampleJa:"これは杭州の伝統文化だ。",
    location:"杭州"
  },

  fengsu:{
    word:"风俗",
    pinyin:"fēngsú",
    meaning:"風俗・土地の習慣",
    category:"歴史・文化",
    example:"每个地方都有自己的风俗。",
    exampleJa:"土地ごとに独自の風俗がある。",
    location:"杭州"
  },


  // ====================================================
  // 76-90 文学・表現
  // ====================================================

  shiyi:{
    word:"诗意",
    pinyin:"shīyì",
    meaning:"詩情・詩的な趣",
    category:"文学・表現",
    example:"夜晚的西湖很有诗意。",
    exampleJa:"夜の西湖には詩的な趣がある。",
    location:"西湖"
  },

  yijing:{
    word:"意境",
    pinyin:"yìjìng",
    meaning:"作品や風景が生み出す情趣・境地",
    category:"文学・表現",
    example:"这首诗的意境很美。",
    exampleJa:"この詩の醸し出す世界は美しい。",
    location:"湖滨茶室"
  },

  wenren:{
    word:"文人",
    pinyin:"wénrén",
    meaning:"文学・芸術をたしなむ知識人",
    category:"文学・表現",
    example:"很多文人写过西湖。",
    exampleJa:"多くの文人が西湖を書いてきた。",
    location:"西湖"
  },

  shici:{
    word:"诗词",
    pinyin:"shīcí",
    meaning:"中国古典の詩と詞",
    category:"文学・表現",
    example:"西湖出现在很多诗词中。",
    exampleJa:"西湖は多くの詩詞に登場する。",
    location:"湖滨茶室"
  },

  fengya:{
    word:"风雅",
    pinyin:"fēngyǎ",
    meaning:"風流で上品な趣",
    category:"文学・表現",
    example:"喝茶也是一件风雅的事。",
    exampleJa:"茶を飲むことも風雅な営みだ。",
    location:"老杭州茶馆"
  },

  tishi:{
    word:"题诗",
    pinyin:"tíshī",
    meaning:"詩を書き記す・詩を題する",
    category:"文学・表現",
    example:"古人在墙上题诗。",
    exampleJa:"昔の人が壁に詩を書き記した。",
    location:"湖滨茶室"
  },

  diangu:{
    word:"典故",
    pinyin:"diǎngù",
    meaning:"故事・古典に由来する典拠",
    category:"文学・表現",
    example:"这个故事来自一个典故。",
    exampleJa:"この物語はある故事に由来する。",
    location:"湖滨茶室"
  },

  yongjing:{
    word:"咏景",
    pinyin:"yǒngjǐng",
    meaning:"風景を詩に詠むこと",
    category:"文学・表現",
    example:"古人常常咏景抒情。",
    exampleJa:"昔の人は風景を詠んで感情を表した。",
    location:"西湖"
  },

  shuqing:{
    word:"抒情",
    pinyin:"shūqíng",
    meaning:"感情を表現する",
    category:"文学・表現",
    example:"这是一首抒情诗。",
    exampleJa:"これは叙情詩だ。",
    location:"湖滨茶室"
  },

  miaoxie:{
    word:"描写",
    pinyin:"miáoxiě",
    meaning:"描写する",
    category:"文学・表現",
    example:"诗人描写了西湖夜景。",
    exampleJa:"詩人は西湖の夜景を描写した。",
    location:"西湖"
  },

  fengjing:{
    word:"风景",
    pinyin:"fēngjǐng",
    meaning:"風景・景色",
    category:"文学・表現",
    example:"西湖的风景很美。",
    exampleJa:"西湖の景色は美しい。",
    location:"西湖"
  },

  yese:{
    word:"夜色",
    pinyin:"yèsè",
    meaning:"夜の景色・夜色",
    category:"文学・表現",
    example:"西湖的夜色很迷人。",
    exampleJa:"西湖の夜景は魅力的だ。",
    location:"西湖"
  },

  yunyun:{
    word:"韵味",
    pinyin:"yùnwèi",
    meaning:"余韻・趣・味わい",
    category:"文学・表現",
    example:"老街很有韵味。",
    exampleJa:"古い街には独特の趣がある。",
    location:"武林夜市"
  },

  gudian:{
    word:"古典",
    pinyin:"gǔdiǎn",
    meaning:"古典",
    category:"文学・表現",
    example:"他喜欢读中国古典文学。",
    exampleJa:"彼は中国古典文学を読むのが好きだ。",
    location:"湖滨茶室"
  },

  chuanshuo:{
    word:"传说",
    pinyin:"chuánshuō",
    meaning:"伝説",
    category:"文学・表現",
    example:"西湖有很多美丽的传说。",
    exampleJa:"西湖には多くの美しい伝説がある。",
    location:"西湖"
  },


  // ====================================================
  // 91-100 街の生活
  // ====================================================

  diandongche:{
    word:"电动车",
    pinyin:"diàndòngchē",
    meaning:"電動スクーター・電動二輪車",
    category:"街の生活",
    example:"路边停着很多电动车。",
    exampleJa:"道端に多くの電動スクーターが停まっている。",
    location:"武林夜市"
  },

  suliaodeng:{
    word:"塑料凳",
    pinyin:"sùliàodèng",
    meaning:"プラスチック製の小さな椅子",
    category:"街の生活",
    example:"摊位旁边放着塑料凳。",
    exampleJa:"屋台の横にプラスチック椅子がある。",
    location:"小吃街"
  },

  gongxiangdanche:{
    word:"共享单车",
    pinyin:"gòngxiǎng dānchē",
    meaning:"シェアサイクル",
    category:"街の生活",
    example:"地铁站旁有共享单车。",
    exampleJa:"地下鉄駅の横にシェアサイクルがある。",
    location:"武林"
  },

  waimai:{
    word:"外卖",
    pinyin:"wàimài",
    meaning:"フードデリバリー",
    category:"街の生活",
    example:"外卖员来取餐了。",
    exampleJa:"配達員が料理を受け取りに来た。",
    location:"武林夜市"
  },

  kuaidi:{
    word:"快递",
    pinyin:"kuàidì",
    meaning:"宅配便",
    category:"街の生活",
    example:"你的快递到了。",
    exampleJa:"宅配便が届いた。",
    location:"便利店"
  },

  bianlidian:{
    word:"便利店",
    pinyin:"biànlìdiàn",
    meaning:"コンビニエンスストア",
    category:"街の生活",
    example:"前面有一家便利店。",
    exampleJa:"前にコンビニがある。",
    location:"武林夜市"
  },

  erweima:{
    word:"二维码",
    pinyin:"èrwéimǎ",
    meaning:"QRコード",
    category:"街の生活",
    example:"请扫描二维码。",
    exampleJa:"QRコードを読み取ってください。",
    location:"武林夜市"
  },

  luxian:{
    word:"路线",
    pinyin:"lùxiàn",
    meaning:"道順・ルート",
    category:"街の生活",
    example:"我正在看地图确认路线。",
    exampleJa:"地図を見てルートを確認している。",
    location:"武林"
  },

  jiequ:{
    word:"街区",
    pinyin:"jiēqū",
    meaning:"街区・一定範囲の市街地",
    category:"街の生活",
    example:"这个街区晚上很热闹。",
    exampleJa:"この街区は夜とても賑やかだ。",
    location:"武林"
  },

  shijing:{
    word:"市井",
    pinyin:"shìjǐng",
    meaning:"庶民の暮らす街・市井",
    category:"街の生活",
    example:"这里充满了市井生活的气息。",
    exampleJa:"ここには庶民の暮らしの空気が満ちている。",
    location:"武林夜市"
  }

};


// ======================================================
// CATEGORY
// ======================================================

const VOCAB_CATEGORIES=[
  "すべて",
  "夜市・街歩き",
  "食文化",
  "杭州・西湖",
  "歴史・文化",
  "文学・表現",
  "街の生活"
];


// ======================================================
// SAVE
// ======================================================

const VOCAB_SAVE_KEY=
  "hangzhouExplorerVocabularyV2";

const COMPLETE_SAVE_KEY=
  "hangzhouExplorerCompleteV1";


function loadVocabularyCollection(){

  try{

    const raw=
      localStorage.getItem(
        VOCAB_SAVE_KEY
      );

    if(!raw){
      return [];
    }

    const data=
      JSON.parse(raw);

    if(!Array.isArray(data)){
      return [];
    }

    return data.filter(
      id=>VOCABULARY[id]
    );

  }
  catch(error){

    console.warn(
      "Vocabulary save load failed",
      error
    );

    return [];

  }

}


let collectedVocabulary=
  loadVocabularyCollection();


function saveVocabularyCollection(){

  localStorage.setItem(
    VOCAB_SAVE_KEY,
    JSON.stringify(
      collectedVocabulary
    )
  );

}


function hasVocabulary(id){

  return collectedVocabulary.includes(
    id
  );

}


function collectVocabulary(id){

  if(!VOCABULARY[id]){
    return false;
  }

  if(hasVocabulary(id)){
    return false;
  }

  collectedVocabulary.push(id);

  saveVocabularyCollection();

  return true;

}


function getVocabularyCount(){
  return Object.keys(VOCABULARY).length;
}


function getCompletionState(){

  return (
    localStorage.getItem(
      COMPLETE_SAVE_KEY
    )==="true"
  );

}


function saveCompletionState(){

  localStorage.setItem(
    COMPLETE_SAVE_KEY,
    "true"
  );

}


// ======================================================
// RANK
// ======================================================

function getRank(count){

  if(count>=100){
    return "武林夜市通";
  }

  if(count>=75){
    return "武林夜市达人";
  }

  if(count>=50){
    return "杭州街歩き人";
  }

  if(count>=25){
    return "夜市探索者";
  }

  return "夜市见习生";

}
