import mongoose from "mongoose";
import dotenv from "dotenv-defaults";
import Team from "../models/team.js";
import Land from "../models/land.js";
import User from "../models/user.js";
import Resource from "../models/resource.js";
import Notification from "../models/notification.js";
import Broadcast from "../models/broadcast.js";
import Event from "../models/event.js";
import Pair from "../models/pair.js";
import Effect from "../models/effect.js";

dotenv.config();
console.log(process.env.MONGO_URL);

const db = mongoose.connection;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [
  {
    username: "admin",
    password: "FFaYwnz2ynAQ",
  },
  {
    username: "NPC",
    password: "pp9AxWvSh35z",
  },
  {
    username: "第01小隊",
    password: "gTtW8W4y",
  },
  {
    username: "第02小隊",
    password: "cvEGgStw",
  },
  {
    username: "第03小隊",
    password: "UAwGZSc7",
  },
  {
    username: "第04小隊",
    password: "gCy2eWBA",
  },
  {
    username: "第05小隊",
    password: "fzUegff2",
  },
  {
    username: "第06小隊",
    password: "7PPFT5QD",
  },
  {
    username: "第07小隊",
    password: "Sb4GeGAH",
  },
  {
    username: "第08小隊",
    password: "9WbxwUsS",
  },
  {
    username: "第09小隊",
    password: "rkMPmnqw",
  },
  {
    username: "第10小隊",
    password: "MeBNNkM4",
  },
];

const teams = [
  {
    id: 1,
    teamname: "第01小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resources: { gold: 0, meat: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 2,
    teamname: "第02小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resources: { gold: 0, meat: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 3,
    teamname: "第03小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resources: { gold: 0, meat: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 4,
    teamname: "第04小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resources: { gold: 0, meat: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 5,
    teamname: "第05小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resources: { gold: 0, meat: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 6,
    teamname: "第06小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resources: { gold: 0, meat: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 7,
    teamname: "第07小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resources: { gold: 0, meat: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 8,
    teamname: "第08小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resources: { gold: 0, meat: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 9,
    teamname: "第09小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resources: { gold: 0, meat: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
  {
    id: 10,
    teamname: "第10小隊",
    // occupation: "N/A",
    money: 40000,
    deposit: 0,
    resources: { gold: 0, meat: 0, cola: 0, wood: 0, metal: 0 },
    bonus: { value: 1.0, time: 0, duration: 0 },
    soulgem: { value: false, time: 0 },
  },
];

const lands = [
  { id: 1, type: "Go", name: "Go格", description: "你夠格嗎" },
  {
    id: 2,
    type: "Building",
    area: 1,
    name: "窮困潦島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 7500, upgrade: 4500 },
    rent: [2500, 5000, 10000],
  },
  {
    id: 3,
    type: "Building",
    area: 1,
    name: "牆頭草兩邊島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 7500, upgrade: 4500 },
    rent: [2500, 5000, 10000],
  },
  { id: 4, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 5,
    type: "Event",
    name: "大型事件格",
    description: "好像有大事要發生了！",
  },
  {
    id: 6,
    type: "Building",
    area: 1,
    name: "兵敗如山島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 9000, upgrade: 5400 },
    rent: [3000, 6000, 12000],
  },
  { id: 7, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 8,
    type: "Chance",
    name: "機會命運",
    description: "為你的未來重新洗牌！",
  },
  {
    id: 9,
    type: "Building",
    area: 1,
    name: "千杯不島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 7200 },
    rent: [4000, 8000, 16000],
  },
  {
    id: 10,
    type: "Building",
    area: 1,
    name: "喝三杯就島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 7200 },
    rent: [4000, 8000, 16000],
  },
  {
    id: 11,
    type: "Arena",
    name: "天空鬥技場",
    description: "Yo Battle!",
  },
  {
    id: 12,
    type: "Transport",
    name: "轉運站",
    description: "帶你去一個有好康的地方",
  },
  {
    id: 13,
    type: "Building",
    area: 1,
    name: "摔島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 13500, upgrade: 8000 },
    rent: [4500, 9000, 18000],
  },
  {
    id: 14,
    type: "Building",
    area: 1,
    name: "跌島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 13500, upgrade: 8000 },
    rent: [4500, 9000, 18000],
  },
  {
    id: 15,
    type: "Building",
    area: 1,
    name: "滑島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 13500, upgrade: 8000 },
    rent: [4500, 9000, 18000],
  },
  { id: 16, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 17,
    type: "Building",
    area: 1,
    name: "神魂顛島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 13500, upgrade: 9000 },
    rent: [4500, 9000, 18000],
  },
  {
    id: 18,
    type: "Store",
    name: "卡片商店",
    description: "多種卡片任君挑選",
  },
  {
    id: 19,
    type: "Chance",
    name: "機會命運",
    description: "為你的未來重新洗牌！",
  },
  { id: 20, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 21,
    type: "Bank",
    name: "銀行",
    description: "有借有還，再借不難",
  },
  {
    id: 22,
    type: "Building",
    area: 1,
    name: "美女幫我課後輔島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 10500, upgrade: 6300 },
    rent: [3500, 7000, 14000],
  },
  {
    id: 23,
    type: "Building",
    area: 1,
    name: "暈島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 10500, upgrade: 6300 },
    rent: [3500, 7000, 14000],
  },
  { id: 24, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 25,
    type: "Event",
    name: "大型事件格",
    description: "好像有大事要發生了！",
  },
  {
    id: 26,
    type: "Jail",
    name: "海底監獄-推進城",
    description: "進監獄囉，真爽",
  },
  {
    id: 27,
    type: "Store",
    name: "卡片商店",
    description: "多種卡片任君挑選",
  },
  {
    id: 28,
    type: "Building",
    area: 1,
    name: "段考前祈島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 6600 },
    rent: [4000, 8000, 16000],
  },
  {
    id: 29,
    type: "Building",
    area: 1,
    name: "賈霸睏中島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 6600 },
    rent: [4000, 8000, 16000],
  },
  {
    id: 30,
    type: "Building",
    area: 1,
    name: "一上課就島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 12000, upgrade: 6600 },
    rent: [4000, 8000, 16000],
  },
  { id: 31, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 32,
    type: "Chance",
    name: "機會命運",
    description: "為你的未來重新洗牌！",
  },
  {
    id: 33,
    type: "Transport",
    name: "轉運站",
    description: "帶你去一個有好康的地方",
  },
  {
    id: 34,
    type: "Building",
    area: 1,
    name: "失戀欠開島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 15000, upgrade: 9000 },
    rent: [5000, 10000, 20000],
  },
  {
    id: 35,
    type: "Building",
    area: 1,
    name: "不愛我拉島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 15000, upgrade: 9000 },
    rent: [5000, 10000, 20000],
  },
  {
    id: 36,
    type: "Building",
    area: 1,
    name: "我喜歡你知不知島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 15000, upgrade: 9000 },
    rent: [5000, 10000, 20000],
  },
  { id: 37, type: "Game", name: "遊戲格", description: "認真聽規則！" },
  {
    id: 38,
    type: "Chance",
    name: "機會命運",
    description: "為你的未來重新洗牌！",
  },
  {
    id: 39,
    type: "Building",
    area: 1,
    name: "卡加布列島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 16500, upgrade: 10000 },
    rent: [5500, 11000, 22000],
  },
  {
    id: 40,
    type: "Building",
    area: 1,
    name: "可愛巧虎島",
    owner: 0,
    level: 0,
    buffed: 0,
    price: { buy: 16500, upgrade: 10000 },
    rent: [5500, 11000, 22000],
  },
];

const events = [
  {
    id: 0,
    title: "無",
    description: "",
  },
  {
    id: 1,
    title: "開局加成",
    description:
      "每隊獲得隨機一張一般道具卡 + 購買地產折扣20%，效果持續至下一次大型事件觸發",
  },
  {
    id: 2,
    title: "八國聯軍",
    description: "洋人來啦，先跑為妙，所有人現金-5000, 並且往前6格。",
  },
  {
    id: 3,
    title: "振興券",
    description: "來幫臺灣衝經濟嘍, 每個小隊普發$10000。",
  },
  {
    id: 4,
    title: "蓋房補助",
    description: "擁有地產格的小隊們，可以免費在任意一個自己的地產格蓋一棟房子",
  },
  {
    id: 5,
    title: "求佛",
    description:
      "我們還能不能能不能再見面？戀愛腦的你向佛祖發誓，為了愛情你可以放棄一切, 於是向佛祖捐獻30%現金+任意一張卡片，以示誠心。",
  },
  {
    id: 6,
    title: "暗水",
    description: "技能遭到封鎖, 15分鐘內無法使用卡片",
  },
  {
    id: 7,
    title: "贖罪券",
    description:
      "男隊輔被抓進監獄，小隊須前往遊戲格支付 6000 塊營救。10 分鐘內沒有成功解救男隊輔的小隊會被場控強制中斷，送入監獄。",
  },
  {
    id: 8,
    title: "颱風肆虐",
    description:
      "卡努颱風襲擊, 舟山河泛濫成災, 編號12至34的房子數量-1。房產等級1的地產不受影響",
  },
  {
    id: 9,
    title: "政府打房",
    description:
      "30分鐘內, 蓋房子時若為該地點第二棟房子, 則須付1.5倍的價格; 若為第三棟則需2倍。",
  },
  {
    id: 10,
    title: "尋獲歷史正文",
    description: "獲得歷史線索, 獲得現金15000 + 一項隱藏成就的敘述",
  },
  {
    id: 11,
    title: "通貨膨脹",
    description: "卡片價格上漲1000, 效果持續至遊戲結束",
  },
  {
    id: 12,
    title: "人民的法槌",
    description:
      "仇富心態爆發, 現金前2的小隊入獄 + 扣除其40%的現金, 並將其數額平分給剩下8個小隊",
  },
  {
    id: 13,
    title: "屯房稅",
    description: "各隊扣除「擁有的房子數量*2000」 的現金",
  },
  {
    id: 14,
    title: "防疫措施",
    description:
      "小隊們群聚需要隔離，有在競技場對戰過的小隊，回到該隊初始格，並且金錢-5000",
  },
  {
    id: 15,
    title: "經濟復甦",
    description: "將所有現金不足20000的小隊補至20000",
  },
  {
    id: 16,
    title: "銀行關閉",
    description:
      "今後無法再使用銀行存款功能(仍然可以提款、借貸、還款)，往後不再發生大型事件",
  },
];

// const effects = [
//   {
//     id: 1,
//     title: "地產增值(I)",
//     description: "房地產租金提升至150%, 效果持續10分鐘。不可疊加使用",
//     trait: 1,
//     duration: 600,
//     bonus: 1.5,
//   },
//   {
//     id: 2,
//     title: "財產凍結",
//     description: "其他小隊踩到此小隊的房產無須付租金, 效果持續5分鐘",
//     trait: 1,
//     duration: 300,
//     bonus: 0,
//   },
//   {
//     id: 3,
//     title: "量子領域",
//     description:
//       "選擇一個區域, 若其他小隊停在此區域會損失10%手上的金錢, 效果持續10分鐘",
//     trait: 1,
//     duration: 600,
//     bonus: -1,
//   },
//   {
//     id: 4,
//     title: "靈魂寶石",
//     description:
//       "所需支付的金錢提升至150%, 但同時所獲得的金錢提升至200%, 效果持續10分鐘",
//     trait: 1,
//     duration: 600,
//     bonus: -1,
//   },
//   {
//     id: 5,
//     title: "地產增值(II)",
//     description: "房地產租金提升至200%, 效果持續10分鐘。不可疊加使用",
//     trait: 1,
//     duration: 600,
//     bonus: 2,
//   },
//   {
//     id: 6,
//     title: "double一下",
//     description:
//       "選擇一個區域。若持有該區域數量-1的房產即可獲得double效果, 此效果沒有時間限制",
//     trait: 0,
//     duration: -1,
//     bonus: -1,
//   },
//   {
//     id: 7,
//     title: "時間寶石",
//     description: "強制其他小隊接下來的3回合內必須倒著走, GO格沒錢領",
//     trait: 1,
//     duration: 300,
//     bonus: -1,
//   },
// ];

const notifications = [
  {
    id: 0,
    title: "歡迎遊玩大富翁",
    description: "衝啊",
    type: "temporary",
    duration: 1800,
    createdAt: 0,
  },
  // {
  //   id: 1,
  //   title: "Test temporary",
  //   description: "temporary",
  //   type: "temporary",
  //   duration: 10,
  //   createdAt: Date.now() / 1000,
  // },
];

const pairs = [
  {
    key: "currentEvent",
    value: 0,
  },
  {
    key: "lastNotificationId",
    value: 0,
  },
  {
    key: "hawkEyeTeam",
    value: 0,
  },
  {
    key: "phase",
    value: 1,
  },
];

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("db connected");
  await Team.deleteMany({});
  await Land.deleteMany({});
  await Resource.deleteMany({});
  await User.deleteMany({});
  await Event.deleteMany({});
  await Pair.deleteMany({});
  await Notification.deleteMany({});
  await Effect.deleteMany({});
  await Broadcast.deleteMany({});
  console.log("delete done");

  users.forEach(async (user) => {
    await new User(user).save();
  });
  console.log("users created");

  lands.forEach(async (ground) => {
    await new Land(ground).save();
  });
  console.log("lands created");

  teams.forEach(async (row) => {
    await new Team(row).save();
  });
  console.log("teams created");

  events.forEach(async (row) => {
    await new Event(row).save();
  });
  console.log("events created");

  pairs.forEach(async (row) => {
    await new Pair(row).save();
  });
  console.log("pairs created");

  notifications.forEach(async (row) => {
    await new Notification(row).save();
  });
  console.log("notifications created");

  // effects.forEach(async (row) => {
  //   await new Effect(row).save();
  // });
  // console.log("effects created");

  console.log("finish saving data");
});
