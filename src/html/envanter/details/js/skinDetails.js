const {
    ipcRenderer
} = require("electron");
const $ = require("jquery");

const {
    shell
} = require('electron')

$("#github").click(() => {
    shell.openExternal('https://github.com/Tortudereli')
})

$("#eSampiyon").addClass("active");

var versionData = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json");
var version = versionData[0];
versionData = null;

var summonerData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner");
var displayName = summonerData['displayName'];
var profileIconId = summonerData['profileIconId'];
var summonerLevel = summonerData['summonerLevel'];
var summonerId = summonerData['summonerId'];
summonerData = null;

$("#currentSummonerIcon").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`)
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
var skinId = getUrlVars()["id"];
var champId = getUrlVars()["champId"];

var skinData = ipcRenderer.sendSync("get", `/lol-champions/v1/inventories/${summonerId}/champions/${champId}/skins/${skinId}`);

$("#champDetailsName").text(skinData['name']);
document.title = skinData['name'];

$("#champDetailsImg img").attr('src', `${ipcRenderer.sendSync("getImg", skinData['tilePath'])}`)
$("#skinDetailsPurchaseDate").text(new Date(skinData['ownership']['rental']['purchaseDate']).toLocaleString("tr-TR"));

$("#main").css({
    "background": `url(${ipcRenderer.sendSync("getImg", skinData['splashPath'])}`,
    "background-repeat": "no-repeat",
    "background-size": "100% 100vh",
})

version = null;