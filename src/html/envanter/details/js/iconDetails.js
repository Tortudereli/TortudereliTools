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

$("#eSampiyon").addClass("active");

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

var iconData = ipcRenderer.sendSync("get", `/lol-collections/v2/inventories/${summonerId}/summoner-icons`)['body'];

iconData['summonerIcons'].forEach(element => {
    if (element['iconId'] == iconId) {
        $("#iconDetailsPurchaseDate").text(new Date(element['ownership']['rental']['purchaseDate']).toLocaleString("tr-TR"));
    }
});
version = null;