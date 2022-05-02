async function getData() {
  var fs = require('fs');
  var alertDataCDN = await ipcRenderer.sendSync("getApi", "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/alert.json").body;
  var baseDir = await ipcRenderer.sendSync("getDirname");
  try {
    var alertData = require(`${baseDir}\\..\\alert.json`)
    if (alertData["alertId"] != alertDataCDN["alertId"]) {
      ipcRenderer.send("alert", {
        message: `${alertDataCDN["message"]}`,
        type: `${alertDataCDN["messageType"]}`,
        title: `${alertDataCDN["messageTitle"]}`
      });
      fs.writeFile(`${baseDir}\\..\\alert.json`, JSON.stringify(alertDataCDN), function (err) {
        if (err) {
          console.log(err);
        }
      });
    }
  } catch (error) {
    fs.writeFile(`${baseDir}\\..\\alert.json`, JSON.stringify(alertDataCDN), function (err) {
      ipcRenderer.send("alert", {
        message: `${alertDataCDN["message"]}`,
        type: `${alertDataCDN["messageType"]}`,
        title: `${alertDataCDN["messageTitle"]}`
      });
      if (err) {
        console.log(err);
      }
    });
  }


  document.getElementById("summonerMoreDataName").innerHTML = currentSummoner.displayName;
  document.getElementById("summonerDataProfileIcon").src = `http://ddragon.leagueoflegends.com/cdn/${versionData}/img/profileicon/${currentSummoner.profileIconId}.png`;;
  document.getElementById("summonerDataLevel").innerHTML = currentSummoner.summonerLevel;
  document.getElementById("levelbar").innerHTML = `Level ${currentSummoner.summonerLevel + 1}`;
  document.documentElement.style.setProperty(
    "--levelBar",
    `${(currentSummoner.xpSinceLastLevel * 100) / currentSummoner.xpUntilNextLevel}%`
  );
  if (1 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 29) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_001-029.png";
  } else if (30 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 49) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_030-049.png";
  } else if (50 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 74) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_050-074.png";
  } else if (75 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 99) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_075-099.png";
  } else if (100 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 124) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_100-124.png";
  } else if (125 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 149) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_125-149.png";
  } else if (150 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 174) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_150-174.png";
  } else if (175 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 199) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_175-199.png";
  } else if (200 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 224) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_200-224.png";
  } else if (225 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 249) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_225-249.png";
  } else if (250 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 274) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_250-274.png";
  } else if (275 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 299) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_275-299.png";
  } else if (300 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 324) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_300-324.png";
  } else if (325 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 349) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_325-349.png";
  } else if (350 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 374) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_350-374.png";
  } else if (375 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 399) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_375-399.png";
  } else if (400 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 424) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_400-424.png";
  } else if (425 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 449) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_425-449.png";
  } else if (450 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 474) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_450-474.png";
  } else if (475 <= currentSummoner.summonerLevel && currentSummoner.summonerLevel <= 499) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_475-499.png";
  } else if (500 <= currentSummoner.summonerLevel) {
    document.getElementById("summonerDataLevelFrame").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/frameLevel/lvl_500.png";
  }

  const activeBoostData = await ipcRenderer.sendSync("get", "/lol-active-boosts/v1/active-boosts").body;
  if (activeBoostData.ipBoostEndDate !== "1970-01-01T00:00:00Z" || activeBoostData.xpBoostEndDate !== "1970-01-01T00:00:00Z" || activeBoostData.ipBoostPerWinCount !== 0 || activeBoostData.xpBoostPerWinCount !== 0) {
    document.getElementById("profileBoost").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/profile/perks_boost.png";
  } else {
    document.getElementById("profileBoost").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/profile/perks_boost_disabled.png";
  }

  if (currentSummoner.rerollPoints.numberOfRolls === 0) {
    document.getElementById("profileReroll").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/profile/perks_reroll_disabled.png";
  } else {
    document.getElementById("profileReroll").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/profile/perks_reroll.png";
  }
  document.getElementById("profileRerollNumber").innerHTML = currentSummoner.rerollPoints.numberOfRolls;


  const chestData = await ipcRenderer.sendSync("get", "/lol-collections/v1/inventories/chest-eligibility").body;
  if (chestData.earnableChests === 0) {
    document.getElementById("profileChest").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/profile/perks_chest_disabled.png";
  } else {
    document.getElementById("profileChest").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/profile/perks_chest.png";
  }
  document.getElementById("profileChestNumber").innerHTML = chestData.earnableChests;

  const backgroundChampId = await ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner/summoner-profile").body.backgroundSkinId;
  let skinsData;
  switch (backgroundChampId) {
    case 147002:
      skinsData = {
        splashPath: "/lol-game-data/assets/v1/champion-splashes/147/147002.jpg"
      }
      break;

    case 147003:
      skinsData = {
        splashPath: "/lol-game-data/assets/v1/champion-splashes/147/147003.jpg"
      }
      break;

    default:
      skinsData = await ipcRenderer.sendSync("getApi", "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json").body[backgroundChampId];
      break;
  }
  document.body.style.backgroundImage = `url(${ipcRenderer.sendSync("getImg", skinsData.splashPath).body})`;
  skinsData = null;

  const champMasteryTop = await ipcRenderer.sendSync("get", `/lol-collections/v1/inventories/${currentSummoner.summonerId}/champion-mastery/top?limit=3`).body;
  const firstChampMastery = champMasteryTop.masteries[0];
  const secondChampMastery = champMasteryTop.masteries[1];
  const thirdChampMastery = champMasteryTop.masteries[2];

  if (typeof firstChampMastery !== 'undefined') {
    document.getElementById("summonerChampMasteryDataFirstChampImg").src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${firstChampMastery.championId}.png`;
    document.getElementById("summonerChampMasteryDataFirstChampFrameImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/masteryBanner/banner-mastery-small-lvl${firstChampMastery.championLevel}.png`;
    document.getElementById("summonerChampMasteryDataFirstChampText").innerText = Intl.NumberFormat("en-US").format(firstChampMastery.championPoints);
  } else {
    document.getElementById("summonerChampMasteryDataFirstChampImg").src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png`;
    document.getElementById("summonerChampMasteryDataFirstChampFrameImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/masteryBanner/banner-mastery-small-lvl1.png`;
    document.getElementById("summonerChampMasteryDataFirstChampText").innerText = '0';
  }

  if (typeof secondChampMastery !== 'undefined') {
    document.getElementById("summonerChampMasteryDataSecondChampImg").src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${secondChampMastery.championId}.png`;
    document.getElementById("summonerChampMasteryDataSecondChampFrameImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/masteryBanner/banner-mastery-small-lvl${secondChampMastery.championLevel}.png`;
    document.getElementById("summonerChampMasteryDataSecondChampText").innerText = Intl.NumberFormat("en-US").format(secondChampMastery.championPoints);
  } else {
    document.getElementById("summonerChampMasteryDataSecondChampImg").src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png`;
    document.getElementById("summonerChampMasteryDataSecondChampFrameImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/masteryBanner/banner-mastery-small-lvl1.png`;
    document.getElementById("summonerChampMasteryDataSecondChampText").innerText = '0';
  }

  if (typeof thirdChampMastery !== 'undefined') {
    document.getElementById("summonerChampMasteryDataThirdChampImg").src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${thirdChampMastery.championId}.png`;
    document.getElementById("summonerChampMasteryDataThirdChampFrameImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/masteryBanner/banner-mastery-small-lvl${thirdChampMastery.championLevel}.png`;
    document.getElementById("summonerChampMasteryDataThirdChampText").innerText = Intl.NumberFormat("en-US").format(thirdChampMastery.championPoints);
  } else {
    document.getElementById("summonerChampMasteryDataThirdChampImg").src = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png`;
    document.getElementById("summonerChampMasteryDataThirdChampFrameImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/masteryBanner/banner-mastery-small-lvl1.png`;
    document.getElementById("summonerChampMasteryDataThirdChampText").innerText = '0';
  }

  const rankedData = await ipcRenderer.sendSync("get", '/lol-ranked/v1/current-ranked-stats').body;

  document.getElementById("summonerRankedDataFirstRankImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/rankedEmb/Emblem_${rankedData.queues[0].tier}.png`;
  document.getElementById("summonerRankedDataFirstRankText").innerText = `${rankedData.queues[0].queueType.replace(/_/g, " ").replace(/5x5|SR/, "")} - ${rankedData.queues[0].tier} ${rankedData.queues[0].division} ${rankedData.queues[0].leaguePoints} LP`;

  document.getElementById("summonerRankedDataSecondRankImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/rankedEmb/Emblem_${rankedData.queues[1].tier}.png`;
  document.getElementById("summonerRankedDataSecondRankText").innerText = `${rankedData.queues[1].queueType.replace(/_/g, " ").replace(/5x5|SR/, "")} - ${rankedData.queues[1].tier} ${rankedData.queues[1].division} ${rankedData.queues[1].leaguePoints} LP`;

  document.getElementById("summonerRankedDataThirdRankImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/rankedEmb/Emblem_${rankedData.queues[2].tier}.png`;
  document.getElementById("summonerRankedDataThirdRankText").innerText = `${rankedData.queues[2].queueType.replace(/_/g, " ").replace(/5x5|SR/, "")} - ${rankedData.queues[2].tier} ${rankedData.queues[2].division} ${rankedData.queues[2].leaguePoints} LP`;



  const honorData = await ipcRenderer.sendSync("get", '/lol-honor-v2/v1/profile').body;
  if (honorData.rewardsLocked === true) {
    document.getElementById("summonerHonorDataImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/honor/emblem_${honorData.honorLevel}_locked.png`;
  } else if (honorData.honorLevel <= 1) {
    document.getElementById("summonerHonorDataImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/honor/emblem_${honorData.honorLevel}.png`;
  } else if (2 <= honorData.honorLevel && honorData.honorLevel < 5) {
    document.getElementById("summonerHonorDataImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/honor/emblem_${honorData.honorLevel}-${honorData.checkpoint}.png`;
    document.getElementById("summonerHonorDataCheckpoint").innerText = `Checkpoint ${honorData.checkpoint}`;
  } else if (honorData.honorLevel === 5) {
    document.getElementById("summonerHonorDataImg").src = `https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/honor/emblem_${honorData.honorLevel}.png`;
    document.getElementById("summonerHonorDataCheckpoint").innerText = 'Congratulations!';
  } else {
    document.getElementById("summonerHonorDataImg").src = "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/img/honor/emblem_generic.png";
  }
  document.getElementById("summonerHonorDataHonorLevel").innerText = `Level ${honorData.honorLevel}`;


  var wallet = ipcRenderer.sendSync("get", "/lol-store/v1/wallet")['body'];

  document.getElementById("walletIp").innerText = wallet.ip;
  document.getElementById("walletRp").innerText = wallet.rp;

}