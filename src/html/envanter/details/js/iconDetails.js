const {
    ipcRenderer
} = require("electron");
const {
    data
} = require("jquery");
const $ = require("jquery");

const {
    shell
} = require('electron')

$("#github").click(() => {
    shell.openExternal('https://github.com/Tortudereli')
})

var versionData = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json")['body'];
var version = versionData[0];
versionData = null;

var summonerData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner")['body'];
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
var iconId = getUrlVars()["id"];

$("#champDetailsImg img").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${iconId}.png`)

var iconData = ipcRenderer.sendSync("get", `/lol-inventory/v2/inventory/SUMMONER_ICON`)['body'];

iconData.forEach(element => {
    if (element['itemId'] == iconId) {
        $("#iconDetailsPurchaseDate").text(`${element['purchaseDate'].substring(6,8)}/${element['purchaseDate'].substring(4,6)}/${element['purchaseDate'].substring(0,4)}`);
    }
});
version = null;

$().ready(() => {
    $("#loadingArea").css({
        "display": "none"
    });
})

$("img, a").attr("draggable", false);