const {
  ipcRenderer
} = require("electron");
const $ = require("jquery");
const {
  post
} = require("request");

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

var summonerData = ipcRenderer.sendSync(
  "get",
  "/lol-summoner/v1/current-summoner"
)["body"];
var summonerId = summonerData["summonerId"];
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

var iconData = ipcRenderer.sendSync(
  "get",
  `/lol-collections/v2/inventories/${summonerId}/summoner-icons`
)["body"];
iconData = iconData["icons"];
iconData.push(29);
for (let index = 50; index < 79; index++) {
  iconData.push(index);
}

iconData.forEach((element) => {
  $("#changeIconMain").append(
    `<img id="icon${element}" src="http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${element}.png" alt="">`
  );

  $(`#icon${element}`).click(() => {
    var postData = {
      url: "/lol-summoner/v1/current-summoner/icon",
      json: {
        profileIconId: element,
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