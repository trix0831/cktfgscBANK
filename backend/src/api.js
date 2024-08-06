import express from "express";
import Team from "../models/team.js";
import Land from "../models/land.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import Event from "../models/event.js";
import Pair from "../models/pair.js";
import Effect from "../models/effect.js";
import Broadcast from "../models/broadcast.js";
import Resource from "../models/resource.js";
const router = express.Router();

const buffBuildings2 = async (building_1, building_2) => {
  for (let i = 0; i < 3; i++) {
    if (building_1.buffed !== 1) building_1.rent[i] *= 1.5;
    if (building_2.buffed !== 1) building_2.rent[i] *= 1.5;
  }
  building_1.buffed = 1;
  building_2.buffed = 1;
  await building_1.save();
  await building_2.save();
};

const debuffBuildings2 = async (building_1, building_2) => {
  building_1.buffed = 0;
  building_2.buffed = 0;
  for (let i = 0; i < 3; i++) {
    building_1.rent[i] /= 1.5;
    building_2.rent[i] /= 1.5;
  }

  await building_1.save();
  await building_2.save();
};

const buffBuildings3 = async (building_1, building_2, building_3) => {
  for (let i = 0; i < 3; i++) {
    if (building_1.buffed === 1) building_1.rent[i] /= 1.5;
    if (building_2.buffed === 1) building_2.rent[i] /= 1.5;
    if (building_3.buffed === 1) building_3.rent[i] /= 1.5;
    building_1.rent[i] *= 2;
    building_2.rent[i] *= 2;
    building_3.rent[i] *= 2;
  }
  building_1.buffed = 2;
  building_2.buffed = 2;
  building_3.buffed = 2;
  await building_1.save();
  await building_2.save();
  await building_3.save();
};

const debuffBuildings3 = async (building_1, building_2, building_3) => {
  building_1.buffed = 0;
  building_2.buffed = 0;
  building_3.buffed = 0;
  for (let i = 0; i < 3; i++) {
    building_1.rent[i] /= 2;
    building_2.rent[i] /= 2;
    building_3.rent[i] /= 2;
  }

  // await building_1.save();
  // await building_2.save();
  // await building_3.save();
};

const buffings2 = async (buildings, num1, num2) => {
  if (buildings[num1].owner === buildings[num2].owner) {
    console.log("0");
    buffBuildings2(buildings[num1], buildings[num2]);
  } else if (
    buildings[num1].buffed === 1 &&
    buildings[num1].owner !== buildings[num2].owner
  ) {
    debuffBuildings2(buildings[num1], buildings[num2]);
  }
};

const buffings3 = async (buildings, num1, num2, num3) => {
  if (
    buildings[num1].owner === buildings[num2].owner &&
    buildings[num2].owner === buildings[num3].owner
  ) {
    console.log("1");
    buffBuildings3(buildings[num1], buildings[num2], buildings[num3]);
  } else if (
    buildings[num1].owner === buildings[num2].owner &&
    buildings[num2].owner !== buildings[num3].owner &&
    buildings[num1].owner !== 0
  ) {
    console.log("2");
    if (buildings[num1].buffed === 2) {
      debuffBuildings3(buildings[num1], buildings[num2], buildings[num3]);
    }
    if (buildings[num3].buffed === 1) {
      buildings[num3].buffed = 0;
      for (let i = 0; i < 3; i++) {
        buildings[num3].rent[i] /= 1.5;
      }
    }
    buffBuildings2(buildings[num1], buildings[num2]);
    await buildings[num3].save();
  } else if (
    buildings[num2].owner === buildings[num3].owner &&
    buildings[num1].owner !== buildings[num2].owner &&
    buildings[num2].owner !== 0
  ) {
    console.log("3");
    if (buildings[num2].buffed === 2) {
      debuffBuildings3(buildings[num1], buildings[num2], buildings[num3]);
    }
    if (buildings[num1].buffed === 1) {
      buildings[num1].buffed = 0;
      for (let i = 0; i < 3; i++) {
        buildings[num1].rent[i] /= 1.5;
      }
    }
    buffBuildings2(buildings[num2], buildings[num3]);
    await buildings[num1].save();
  } else if (
    buildings[num1].owner === buildings[num3].owner &&
    buildings[num2].owner !== buildings[num1].owner &&
    buildings[num1].owner !== 0
  ) {
    console.log("4");
    if (buildings[num1].buffed === 2) {
      debuffBuildings3(buildings[num1], buildings[num2], buildings[num3]);
    }
    if (buildings[num2].buffed === 1) {
      buildings[num2].buffed = 0;
      for (let i = 0; i < 3; i++) {
        buildings[num2].rent[i] /= 1.5;
      }
    }
    buffBuildings2(buildings[num1], buildings[num3]);
    await buildings[num2].save();
  } else if (
    buildings[num1].owner !== buildings[num2].owner &&
    buildings[num2].owner !== buildings[num3].owner
  ) {
    console.log("5");
    if (buildings[num1].buffed === 1 && buildings[num2].buffed === 1) {
      debuffBuildings2(buildings[num1], buildings[num2]);
    } else if (buildings[num2].buffed === 1 && buildings[num3].buffed === 1) {
      debuffBuildings2(buildings[num2], buildings[num3]);
    } else if (buildings[num1].buffed === 1 && buildings[num3].buffed === 1) {
      debuffBuildings2(buildings[num1], buildings[num3]);
    }
  }
};

router.get("/", (req, res) => {
  res.json({ a: 1, b: 2 });
});

async function updateTeam(team, moneyChanged, io, saved) {
  const teamObj = await Team.findOne({ id: team });
  var ratio = 1;
  if (teamObj.soulgem.value === true) {
    if (moneyChanged > 0) ratio = 2;
    else ratio = 1.5;
  }
  let final = Math.round(teamObj.money + moneyChanged * ratio);
  if (saved && final < 0) {
    const message = {
      title: "破產!!!",
      description: teamObj.teamname,
      level: 0,
      createdAt: Date.now(),
    };
    await new Broadcast(message).save();
    io.emit("broadcast", message);
  }
  if (saved) {
    const temp = await Team.findOneAndUpdate(
      { id: team },
      { money: final },
      { new: true } //return the item after update
    );
    return temp;
  } else {
    return { money: final };
  }
}

async function deleteTimeoutNotification() {
  const notifications = await Notification.find();
  const time = Date.now() / 1000;
  for (let i = 0; i < notifications.length; i++) {
    if (
      notifications[i].createdAt + notifications[i].duration < time &&
      notifications[i].duration > 0
    ) {
      await Notification.findByIdAndDelete(notifications[i]._id);
    }
  }
}

// router
//   .get("/phase", async (req, res) => {
//     const phase = await Pair.findOne({ key: "phase" });
//     res.json({ phase: phase.value }).status(200);
//   })
//   .post("/phase", async (req, res) => {
//     const phase = await Pair.findOne({ key: "phase" });
//     phase.value = req.body.phase;
//     await phase.save();
//     res.json({ phase: phase.value }).status(200);
//     req.io.emit("broadcast", {
//       title: `Phase Changed to ${phase.value}`,
//       description: "",
//       level: 0,
//     });
//   });

router.get("/team", async (req, res) => {
  const teams = await Team.find().sort({ teamname: 1 });
  res.json(teams).status(200);
});

router.get("/teamRich", async (req, res) => {
  const teams = await Team.find().sort({ money: -1 });
  const team = teams[0];
  console.log(team);
  res.json(team).status(200);
});

router.post("/checkPropertyCost", async (req, res) => {
  const { team, building, mode } = req.body;

  const targetBuilding = await Land.find({ id: building });
  const targetTeam = await Team.find({ id: team });
  const surplus = targetTeam[0].money;
  if (mode === "Buy") {
    const checkPropertyCost = targetBuilding[0].price.buy;
    if (surplus >= checkPropertyCost) res.json({ message: "OK" }).status(200);
    else {
      res.json({ message: "FUCK" }).status(200);
    }
  } else if (mode === "Upgrade") {
    const checkPropertyCost = targetBuilding[0].price.upgrade;
    console.log(checkPropertyCost);
    if (surplus >= checkPropertyCost) res.json({ message: "OK" }).status(200);
    else res.json({ message: "FUCK" }).status(200);
  }
});

router.get("/team/:teamId", async (req, res) => {
  const team = await Team.findOne({ id: req.params.teamId });
  res.json(team).status(200);
});

router.get("/land", async (req, res) => {
  const lands = await Land.find().sort({ id: 1 });
  res.json(lands).status(200);
});

router.get("/land/:id", async (req, res) => {
  const land = await Land.findOne({ id: req.params.id });
  res.json(land).status(200);
});

router.get("/property/:teamId", async (req, res) => {
  const properties = await Land.find({ owner: req.params.teamId });
  res.json(properties).status(200);
});

router.post("/set", async (req, res) => {
  const { id, amount } = req.body;
  await Team.findOneAndUpdate({ id: parseInt(id) }, { money: amount });
  res.json({ success: true }).status(200);
});

router.get("/getRent", async (req, res) => {
  const building = req.query.building;
  if (building !== -1) {
    const targetBuilding = await Land.find({ id: building });
    const rent = targetBuilding[0].rent[targetBuilding[0].level - 1];
    res.json(rent).status(200);
  }
  res.json(0).status(200);
});

router.get("/resourceInfo", async (req, res) => {
  const resources = await Resource.find().sort({ id: 1 });
  res.json(resources).status(200);
});

router.post("/sellResource", async (req, res) => {
  const { teamId, resourceId, number, mode } = req.body;

  const team = await Team.find({ id: teamId });
  const resource = await Resource.find({ id: resourceId });

  if (mode === 0) {
    await Team.findOneAndUpdate(
      { id: teamId },
      {
        money: team[0].money + resource[0].price * number,
      }
    );
  } else if (mode === 1) {
    await Team.findOneAndUpdate(
      { id: teamId },
      {
        money: team[0].money - resource[0].price * number,
      }
    );
  }
  res.json("Success").status(200);
});


router.post("/sell", async (req, res) => {
  const { teamId, landId, forced } = req.body;
  const land = await Land.findOne({ id: landId });
  if (land.owner !== teamId && teamId < 10) {
    res.status(400).json({ error: "Not your land" });
    return;
  }
  const team = await Team.findOne({ id: land.owner });

  const price = calcSellPrice(land, forced);
  // team.money += price;
  // await team.save();
  await updateTeam(land.owner, price, req.io, true);
  await Land.findOneAndUpdate({ id: landId }, { owner: 0, level: 0 });
  res.status(200).json({ message: "Sell successful" });
});

router.get("/allEvents", async (req, res) => {
  const events = await Event.find().sort({ id: 1 });
  res.json(events).status(200);
});

router.post("/interest", async (req, res) => {
  try {
    console.log("interest");

    const teams = await Team.find();
    for (let i = 0; i < teams.length; i++) {
      teams[i].money = Math.round(teams[i].money * 1.05);
      await teams[i].save();
    }
    
    res.status(200).json("Success");
  } catch (error) {
    console.error("Error updating interest:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router
  .post("/event", async (req, res) => {
    const { id } = req.body;
    const teams = await Team.find();
    const pair = await Pair.findOne({ key: "currentEvent" });
    if (pair) {
      const currentEvent = parseInt(pair.value);
      let note = "";

      for (let i = 0; i < teams.length; i++) {
        teams[i].deposit = Math.round(teams[i].deposit * 0.15) * 10;
        await teams[i].save();
      }
      switch (id) {
        default: // 1, 4, 6, 7, 9, 11, 14, 16
          res.json("Success").status(200);
          break;
        case 1: // 所有人存款變成原來的80%
          {
            const teams = await Team.find();
            for (let i = 0; i < teams.length; i++) {
              teams[i].money = Math.round(teams[i].money * 0.8);
              await teams[i].save();
            }
            res.json("Success").status(200);
          }
          break;
        case 2: // 所有人加4000
          {
            const teams = await Team.find();
            for (let i = 0; i < teams.length; i++) {
              teams[i].money += 4000;
              await teams[i].save();
            }
            res.json("Success").status(200);
          }
          break;
        case 3://發股利，所有人存款變為1.4倍
          {
            const teams = await Team.find();
            for (let i = 0; i < teams.length; i++) {
              teams[i].money = Math.round(teams[i].money * 1.4);
              await teams[i].save();
            }
            res.json("Success").status(200);
          }
          break;
          case 4://工被入侵，所有人存款-2000
          {
            const teams = await Team.find();
            for (let i = 0; i < teams.length; i++) {
              teams[i].money -= 2000;
              await teams[i].save();
            }
            res.json("Success").status(200);
          }
          break;
        }
      pair.value = id;
      await pair.save();

      const newEvent = await Event.findOne({ id });
      newEvent.note = note;
      newEvent.level = 0;
      await newEvent.save();
      // await new Notification(newEvent).save();
      // console.log(newEvent);
      req.io.emit("broadcast", newEvent);
      console.log("broadcast");
    } else {
      res.json("Failed").status(403);
    }
  })
  .get("/event", async (req, res) => {
    const pair = await Pair.findOne({ key: "currentEvent" });
    const event = await Event.findOne({ id: pair.value });
    res.json(event).status(200);
  });

// router.post("/occupation", async (req, res) => {
//   const { teamname, occupation } = req.body;
//   const team = await Team.findOne({ teamname });
//   team.occupation = occupation;
//   await team.save();

//   if (occupation === "鷹眼") {
//     const pair = await Pair.findOneAndUpdate(
//       { key: "hawkEyeTeam" },
//       { value: team.id }
//     );
//   }
//   res.json(team).status(200);
// });

// router.post("/level", async (req, res) => {
//   const { teamId, level } = req.body;
//   const team = await Team.findOneAndUpdate({ id: teamId }, { level: level });
//   console.log(team);
//   res.json(team).status(200);
// });

router.post("/tape", async (req, res) => {
  const teams = await Team.find();
  for (let i = 0; i < teams.length; i++) {
    teams[i].money -= 5000;
    await teams[i].save();
  }
  req.io.emit("broadcast", {
    title: "紙膠帶發動",
    description: "紙膠帶狂暴黑料!所有小隊遭扣除5000元",
  });
  res.json("Success").status(200);
});

router.post("/goldenFruit", async (req, res) => {
  const { building } = req.body;
  const land = await Land.find({ id: building });
  const level = land[0].level;
  const targetTeam = await Team.find({ id: land[0].owner });
  targetTeam[0].money +=
    Math.round(
      (land[0].price.buy + (land[0].level - 1) * land[0].price.upgrade) * 0.07
    ) * 10;

  land[0].owner = 0;
  land[0].level = 0;
  targetTeam[0].save();
  land[0].save();
  req.io.emit("broadcast", {
    title: "金蔓莓果發動",
    description: `${targetTeam[0].teamname}被使用了金蔓莓果！`,
  });
  res.json({ land, level }).status(200);
});

router
  .post("/add", async (req, res) => {
    const { id, dollar, jeff, jeffTeam } = req.body;
    const team = await Team.findAndCheckValid(id);
    const targetTeam = await Team.find({ id: jeffTeam });
    if (!team) {
      res.status(403).send();
      console.log("Team not found");
      return;
    }

    if (jeff) {
      req.io.emit("broadcast", {
        title: "劫富卡發動",
        description: `第${jeffTeam}小隊遭到劫富！！`,
      });
      await Team.findOneAndUpdate(
        { id: jeffTeam },
        { money: targetTeam[0].money * 0.75 }
      );
    }

    await updateTeam(id, dollar, req.io, true);
    // if (dollar < 0) {
    //   req.io.emit("broadcast", {
    //     title: "扣錢",
    //     description: `第${id}小隊遭扣除${-dollar}元！！`,
    //   });
    // }

    res.status(200).send("Update succeeded");
  })
  .get("/add", async (req, res) => {
    console.log(req.query);
    const { id, dollar } = req.query;
    console.log(id, dollar);
    const data = await updateTeam(id, dollar, req.io, false);
    console.log(data);
    res.json(data).status(200);
  });

router.post("/series", async (req, res) => {
  const { teamId, area } = req.body;
  const count = await (
    await Land.find({ area, owner: teamId })
  ).filter((land) => land.owner > 0).length;
  res.json({ count }).status(200);
});

router.post("/soldout", async (req, res) => {
  const { id, building } = req.body;
  const team = await Team.find({ id: id });
  const land = await Land.find({ id: building });
  team[0].money +=
    Math.round(
      (land[0].price.buy + land[0].price.upgrade * (land[0].level - 1)) * 0.08
    ) * 10;
  land[0].level = 0;
  land[0].owner = 0;
  await team[0].save();
  await land[0].save();
  res.json("Success").status(200);
});

router.post("/deposit", async (req, res) => {
  const { id, dollar } = req.body;
  const team = await Team.find({ id: id });
  team[0].money -= dollar;
  team[0].deposit += dollar;
  await team[0].save();
  res.json("Success").status(200);
});

router.post("/accounting", async (req, res) => {
  const teams = await Team.find().sort({ id: 1 });
  for (let i = 0; i < teams.length; i++) {
    const lands = await Land.find({ owner: teams[i].id });
    let total = 0;
    for (let i = 0; i < lands.length; i++) {
      total +=
        (lands[i].price.buy + lands[i].price.upgrade * (lands[i].level - 1)) *
        0.9;
    }
    if (teams[i].deposit >= 0) teams[i].money += total + teams[i].deposit;
    else teams[i].money += total + teams[i].deposit * 1.3;

    teams[i].deposit = 0;
    await teams[i].save();
  }
  res.json("Success").status(200);
});

router.post("/rob", async (req, res) => {
  const { id } = req.body;
  const team = await Team.find({ id: id });
  const teams = await Team.find().sort({ money: 1 });
  const lands = await Land.find({ owner: teams[0].id, level: 1 });

  if (lands.length === 0) {
    req.io.emit("broadcast", {
      title: "趁火打劫發動",
      description: `${team[0].teamname}使用了趁火打劫，但${teams[0].teamname}逃過一劫...`,
    });
  } else {
    const index = Math.floor(Math.random() * lands.length);
    lands[index].owner = id;
    await lands[index].save();
    req.io.emit("broadcast", {
      title: "趁火打劫發動",
      description: `${team[0].teamname}使用了趁火打劫, 搶走${teams[0].teamname}的${lands[index].name}, 2ㄏ2ㄏ`,
    });
    res.json({ building: lands[index].id }).status(200);
  }
});

router.post("/equility", async (req, res) => {
  const { id } = req.body;
  const team = await Team.find({ id: id });
  const teams = await Team.find().sort({ money: 1 });
  let order = -1;
  for (let i = 0; i < teams.length; i++) {
    if (teams[i].id === id) order = i;
  }
  if (order + 1 === teams.length) {
    team[0].money -= 10000;
    await team[0].save();
    req.io.emit("broadcast", {
      title: "實質平等發動",
      description: `${team[0].teamname}使用了實質平等, 但你太有錢了, 扣除10000元`,
    });
  } else {
    const money =
      Math.round((teams[order].money + teams[order + 1].money) * 0.05) * 10;

    teams[order].money = money;
    teams[order + 1].money = money;
    await teams[order].save();
    await teams[order + 1].save();
    req.io.emit("broadcast", {
      title: "實質平等發動",
      description: `${team[0].teamname}使用了實質平等, 與${
        teams[order + 1].teamname
      }平分金錢`,
    });
  }
  res.json("Success").status(200);
});

router.post("/handleBuff1", async (req, res) => {
  const { name } = req.body;
  console.log(name);
  const land = await Land.find({ name: name });
  land[0].buffed = 1;
  for (let i = 0; i < 3; i++) {
    land[0].rent[i] *= 1.5;
  }
  await land[0].save();
  res.json("Success").status(200);
});

router.post("/handleBuff2", async (req, res) => {
  const { name } = req.body;
  const land = await Land.find({ name: name });
  land[0].buffed = 2;
  for (let i = 0; i < 3; i++) {
    land[0].rent[i] *= 2;
  }
  await land[0].save();
  res.json("Success").status(200);
});

router.post("/handleDeBuff", async (req, res) => {
  const { name } = req.body;
  const land = await Land.find({ name: name });
  const originstatus = land[0].buffed;
  land[0].buffed = 0;
  for (let i = 0; i < 3; i++) {
    if (originstatus === 1) land[0].rent[i] /= 1.5;
    else if (originstatus === 2) land[0].rent[i] /= 2;
  }
  await land[0].save();
  res.json("Success").status(200);
});

const calcTransfer = async (from, to, amount, isEstate) => {
  if (from === to) return null;

  const FromTeam = await Team.findOne({ id: from }); //minus
  const ToTeam = await Team.findOne({ id: to }); //add
  if (!FromTeam || !ToTeam) {
    console.log("error finding teams in func: calcTransfer");
    return null;
  }

  var FromAmount = parseInt(FromTeam.money);
  var ToAmount = parseInt(ToTeam.money);
  var TransferAmount = parseInt(amount);
  console.log(TransferAmount, ToTeam.bonus.value);
  if (isEstate && ToTeam.bonus.value !== 0)
    TransferAmount *= ToTeam.bonus.value;

  console.log(TransferAmount);
  if (FromTeam.soulgem.value)
    FromAmount -= parseInt(Math.round(TransferAmount * 1.5));
  else FromAmount -= TransferAmount;

  if (ToTeam.soulgem.value)
    ToAmount += parseInt(Math.round(TransferAmount * 2));
  else ToAmount += TransferAmount;
  console.log({ from: FromAmount, to: ToAmount });
  return { from: FromAmount, to: ToAmount };
};

router.post("/transfer", async (req, res) => {
  const { from, to, IsEstate, dollar } = req.body;
  //update team status
  await Team.findAndCheckValid(from);
  await Team.findAndCheckValid(to);

  const data = await calcTransfer(from, to, dollar, IsEstate);
  if (!data) {
    console.log("Transfer failed");
    res.status(403).send("Transfer failed");
  } else {
    await Team.findOneAndUpdate({ id: from }, { money: data.from });
    await Team.findOneAndUpdate({ id: to }, { money: data.to });
    res.status(200).send("Update succeeded");
  }
});

router.get("/transfer", async (req, res) => {
  let from = req.query.from;
  let to = req.query.to;
  let IsEstate = req.query.IsEstate;
  let dollar = req.query.dollar;
  const data = await calcTransfer(from, to, dollar, IsEstate);
  console.log(data);
  if (data !== null) res.json(data).status(200);
  else res.status(403).send();
});

// async function updateHawkEye() {
//   const { value: hawkEyeTeam } = await Pair.findOne({ key: "hawkEyeTeam" });
//   if (hawkEyeTeam === 0) return;
//   // may delete some building need to clear and fill(?)
//   for (let i = 1; i <= 40; i++) {
//     await Land.findOneAndUpdate({ id: i }, { hawkEye: 0 });
//   }
//   const hawkEyeBuildings = await Land.find({ owner: hawkEyeTeam });
//   console.log(hawkEyeBuildings);
//   for (let i = 0; i < hawkEyeBuildings.length; i++) {
//     await Land.findOneAndUpdate(
//       { id: hawkEyeBuildings[i].id - 1 },
//       { hawkEye: hawkEyeBuildings[i].id }
//     );
//     await Land.findOneAndUpdate(
//       { id: hawkEyeBuildings[i].id + 1 },
//       { hawkEye: hawkEyeBuildings[i].id }
//     );
//   }
//   for (let i = 0; i < hawkEyeBuildings.length; i++) {
//     await Land.findOneAndUpdate(
//       { id: hawkEyeBuildings[i].id },
//       { hawkEye: hawkEyeBuildings[i].id }
//     );
//   }
//   console.log("hawkEye updated");
// }

router.post("/ownership", async (req, res) => {
  const { teamId, land, level } = req.body;
  const tmp1 = await Land.findOneAndUpdate({ name: land }, { owner: teamId });
  if (!tmp1) {
    res.status(403).send();
    console.log("Update failed");
    return;
  }
  const tmp2 = await Land.findOneAndUpdate({ name: land }, { level: level });
  if (!tmp2) {
    res.status(403).send();
    console.log("Update failed");
    return;
  }

  // await updateHawkEye(land);
  res.status(200).send("update succeeded");
});

router.post("/calcbonus", async (req, res) => {
  const { teamId, land, level } = req.body;
  const buildings = await Land.find({}).sort({ id: 1 });
  console.log(req.body);
  const targetBuilding = await Land.find({ name: land });

  if (targetBuilding[0].id === 2 || targetBuilding[0].id === 3) {
    buffings2(buildings, 1, 2);
  } else if (targetBuilding[0].id === 9 || targetBuilding[0].id === 10) {
    buffings2(buildings, 8, 9);
  } else if (
    targetBuilding[0].id === 13 ||
    targetBuilding[0].id === 14 ||
    targetBuilding[0].id === 15
  ) {
    buffings3(buildings, 12, 13, 14);
  } else if (targetBuilding[0].id === 22 || targetBuilding[0].id === 23) {
    buffings2(buildings, 21, 22);
  } else if (
    targetBuilding[0].id === 28 ||
    targetBuilding[0].id === 29 ||
    targetBuilding[0].id === 30
  ) {
    buffings3(buildings, 27, 28, 29);
  } else if (
    targetBuilding[0].id === 34 ||
    targetBuilding[0].id === 35 ||
    targetBuilding[0].id === 36
  ) {
    buffings3(buildings, 33, 34, 35);
  } else if (targetBuilding[0].id === 39 || targetBuilding[0].id === 40) {
    buffings2(buildings, 38, 39);
  }
  res.json("Success").status(200);
});

router.post("/aquire", async (req, res) => {
  const { land, teamId } = req.body;
  const target = await Land.find({ name: land });
  const originOwner = target[0].owner;
  const originTeam = await Team.find({ id: originOwner });
  const newTeam = await Team.find({ id: teamId });
  originTeam[0].money +=
    target[0].price.buy + (target[0].level - 1) * target[0].price.upgrade;
  newTeam[0].money -=
    target[0].price.buy + (target[0].level - 1) * target[0].price.upgrade;
  target[0].owner = teamId;

  await originTeam[0].save();
  await newTeam[0].save();
  await target[0].save();
  res.json("Success").status(200);
});

router.get("/aquireBuilding", async (req, res) => {
  const targetBuilding = Land.find({ type: "Building" }).sort({ id: 1 });
  res.json(targetBuilding).status(200);
});

router.post("/exchange", async (req, res) => {
  const { land, otherLand, teamId, otherTeamId } = req.body;
  const land_1 = await Land.find({ name: land });
  const land_2 = await Land.find({ name: otherLand });
  land_1[0].owner = otherTeamId;
  land_2[0].owner = teamId;
  await land_1[0].save();
  await land_2[0].save();
  res.json("Success").status(200);
});

router.post("/shipRepair", async (req, res) => {
  const { teamId } = req.body;
  console.log(teamId);
  const team = await Team.find({ id: teamId });
  team[0].dice = 2;
  await team[0].save();
  res.json("Success").status(200);
});

router.get("/allEffects", async (req, res) => {
  const effects = await Effect.find({}).sort({ id: 1 });
  res.json(effects).status(200);
});

router.post("/effect", async (req, res) => {
  const { teamname, title } = req.body;
  const effect = await Effect.findOne({ title });
  if (!effect) {
    res.status(403).send();
    console.log("Effect not found");
    return;
  }
  const { id, description, trait, duration, bonus } = effect;
  const team = await Team.findOne({ teamname });
  const time = Date.now() / 1000;
  if (!team) {
    res.status(403).send("Team not found");
    console.log("Team not found");
    return;
  }
  if (bonus !== -1) {
    team.bonus = { value: bonus, duration, time };
  }
  if (id === 4) {
    // soulgem
    team.soulgem = { value: true, duration, time };
  }

  const pair = await Pair.findOne({ key: "lastNotificationId" });
  const type = trait ? "temporary" : "permanent";
  const notification = {
    id: pair.value,
    type,
    teamname,
    title,
    description: `${teamname}: ${description}`,
    duration,
    createdAt: time,
  };
  // await deleteTimeoutNotification();
  // save
  console.log(notification);
  await new Notification(notification).save();
  await team.save();
  req.io.emit("broadcast", notification);
  res.status(200).send("Update succeeded");
});

router
  .post("/broadcast", async (req, res) => {
    const { title, description, level } = req.body;
    let time = Date.now();
    const broadcast = {
      createdAt: time,
      title: title,
      description: description,
      level: level,
    };
    await new Broadcast(broadcast).save();
    req.io.emit("broadcast", { title, description, level });
    res.status(200).send("Broadcast succeeded");
    console.log("broadcast sent");
  })
  .get("/broadcast", async (req, res) => {
    const data = await Broadcast.find({}).sort({ createdAt: -1 });
    res.json(data).status(200);
  })
  .delete("/broadcast/:createdAt", async (req, res) => {
    const { createdAt } = req.params;
    const data = await Broadcast.findOneAndDelete({ createdAt });
    res.json(data).status(200);
  });

router.get("/notifications", async (req, res) => {
  await deleteTimeoutNotification();
  // save
  const newNotifications = await Notification.find();
  res.json(newNotifications).status(200);
});

// router.post("/bonus", async (req, res) => {
//   console.log(req.body);
//   const { teamname, bonus, duration } = req.body;
//   const time = Date.now() / 1000;
//   const team = await Team.findOneAndUpdate(
//     { teamname: teamname },
//     { bonus: { value: bonus, time: time, duration: duration } }
//   );
//   if (!team) {
//     res.status(403).send();
//     console.log("Update failed");
//     return;
//   }
//   res.status(200).send("update succeeded");
// });

// router.post("/soulgem", async (req, res) => {
//   const { teamname } = req.body;
//   const time = Date.now() / 1000;
//   const team = await Team.findOneAndUpdate(
//     { teamname: teamname },
//     { soulgem: { value: true, time: time } }
//   );
//   if (!team) {
//     res.status(403).send();
//     console.log("Update failed");
//     return;
//   }
//   res.status(200).send("update succeeded");
// });

// router.get("/checkvalid", async (req, res) => {
//   const { teamname } = req.query;
//   const team = await findAndCheckValid(teamname);
//   res.status(200).send(team);
// });

// Login
router.post("/login", async (req, res) => {
  // console.log(req.body);
  const { username, password } = req.body;
  // console.log(username);
  // console.log(password);
  const user = await User.findAndValidate(username, password);
  if (!user) {
    res.status(200).send({ username: "" });
    console.log("login failed");
    return;
  }
  res.status(200).send({ username: user.username });
  // null, npc, admin: String
});

router.get("/room", async (req, res) => {
  res.status(200).send(req.io.room);
});

// router.post("/logout", async (req, res) => {
//   req.session.destroy();
//   res.status(200).send("logout success");
// });

// router.get("/adminsecret", requireAdmin, async (req, res) => {
//   res.status(200).send("admin secret");
// });

// router.get("/npcsecret", requireNPC, async (req, res) => {
//   res.status(200).send("npc secret");
// });

export default router;
