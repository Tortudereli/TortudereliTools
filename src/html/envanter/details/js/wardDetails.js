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
var wardId = getUrlVars()["id"];

var totemData = ipcRenderer.sendSync("get", `/lol-collections/v1/inventories/${summonerId}/ward-skins`)['body'];
var totemsData = ipcRenderer.sendSync("getApi", "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/ward-skins.json")['body'];

function getTotemUrl(id) {
    for (let i = 0; i < totemsData.length; i++) {
        if (totemsData[i]['id'] === id) {
            return totemsData[i]['wardImagePath'];
        }
    }
}

totemData.forEach(element => {
    if (element['id'] == wardId) {
        var totemUrl = getTotemUrl(element['id']);
        $("#champDetailsImg img").attr('src', `${ipcRenderer.sendSync("getImg", totemUrl)['body']}`)
        $("#champDetailsName").text(element['name']);
        document.title = element['name'];
        $("#wardDetailsPurchaseDate").text(new Date(element['ownership']['rental']['purchaseDate']).toLocaleString("tr-TR"));
    }
});

version = null;
totemsData = null;
totemData = null;