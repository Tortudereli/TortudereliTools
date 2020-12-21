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
var emoteId = getUrlVars()["id"];

var emoteData = ipcRenderer.sendSync("get", `/lol-inventory/v1/inventory/emotes`)['body'];
var emotesData = ipcRenderer.sendSync("getApi", "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-emotes.json")['body'];

function getEmoteUrl(id) {
    for (let i = 0; i < emotesData.length; i++) {
        if (emotesData[i]['id'] === id) {
            return emotesData[i]['inventoryIcon'];
        }
    }
}

emoteData.forEach(element => {
    if (element['itemId'] == emoteId) {
        var emoteUrl = getEmoteUrl(element['itemId']);
        $("#champDetailsImg img").attr('src', `${ipcRenderer.sendSync("getImg", emoteUrl)['body']}`);
        $("#emoteDetailsPurchaseDate").text(element['purchaseDate'].substring(6, 8) + "." + element['purchaseDate'].substring(4, 6) + "." + element['purchaseDate'].substring(0, 4) + " " + element['purchaseDate'].substring(9, 11) + ":" + element['purchaseDate'].substring(11, 13) + ":" + element['purchaseDate'].substring(13, 15));
    }
});

version = null;
emoteData = null;
emotesData = null;