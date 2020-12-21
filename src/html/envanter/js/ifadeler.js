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

$("#eIfade").addClass("active");



var versionData = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json")['body'];
var version = versionData[0];
versionData = null;

var summonerData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner")['body'];
var displayName = summonerData['displayName'];
var profileIconId = summonerData['profileIconId'];
var summonerLevel = summonerData['summonerLevel'];
summonerData = null;

$("#currentSummonerIcon").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`)
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");
version = null;

var emoteData = ipcRenderer.sendSync("get", `/lol-inventory/v1/inventory/emotes`)['body'];

var baseUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets";

var emotesData = ipcRenderer.sendSync("getApi", "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-emotes.json")['body'];

function getEmoteUrl(id) {
    for (let i = 0; i < emotesData.length; i++) {
        if (emotesData[i]['id'] === id) {
            return emotesData[i]['inventoryIcon'];
        }
    }
}

emoteData.forEach(element => {
    var emoteUrl = getEmoteUrl(element['itemId']);
    $('#ifadeAlan').append(`<img id="${element['itemId']}" src="${ipcRenderer.sendSync("getImg", emoteUrl)['body']}" alt="">`);
    $(`#${element['itemId']}`).click(() => {
        window.location.href = `details/emoteDetails.html?id=${element['itemId']}`;
    })
});

emoteData = null;
emotesData = null;