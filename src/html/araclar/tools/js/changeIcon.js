const {
  ipcRenderer
} = require("electron");
const $ = require("jquery");

const {
  shell
} = require("electron");

$("#github").click(() => {
  shell.openExternal("https://github.com/Tortudereli");
});

var version = ipcRenderer.sendSync(
  "getApi",
  "https://ddragon.leagueoflegends.com/api/versions.json"
)["body"];
version = version[0];

var summonerData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner")["body"];
var displayName = summonerData["displayName"];
var profileIconId = summonerData["profileIconId"];
var summonerLevel = summonerData["summonerLevel"];
summonerData = null;

$("#currentSummonerIcon").attr(
  "src",
  `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`
);
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");

var iconData = ipcRenderer.sendSync("get", `/lol-inventory/v2/inventory/SUMMONER_ICON`)["body"];

for (let index = 0; index < 30; index++) {
  iconData.push({
    "itemId": index
  });
}

for (let index = 50; index < 79; index++) {
  iconData.push({
    "itemId": index
  });
}

iconData.forEach((element) => {
  $("#changeIconMain").append(
    `<img id="icon${element['itemId']}" src="http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${element['itemId']}.png" alt="">`
  );

  $(`#icon${element['itemId']}`).click(() => {
    var postData = {
      url: "/lol-summoner/v1/current-summoner/icon",
      json: {
        profileIconId: element['itemId'],
      },
    };
    ipcRenderer.send("put", postData);
    location.reload();
  });
});

iconData = null;
version = null;

$().ready(() => {
  $("#loadingArea").css({
    display: "none",
  });
});

$("img, a").attr("draggable", false);