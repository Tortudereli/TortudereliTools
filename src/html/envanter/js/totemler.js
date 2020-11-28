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

$("#eTotem").addClass("active");

var versionData = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json");
var version = versionData[0];
versionData = null;

var summonerData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner");
var summonerId = summonerData['summonerId'];
var displayName = summonerData['displayName'];
var profileIconId = summonerData['profileIconId'];
var summonerLevel = summonerData['summonerLevel'];
summonerData = null;

$("#currentSummonerIcon").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`)
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");
version = null;

var totemData = ipcRenderer.sendSync("get", `/lol-collections/v1/inventories/${summonerId}/ward-skins`);
var totemsData = ipcRenderer.sendSync("getApi", "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/ward-skins.json");

function getTotemUrl(id) {
    for (let i = 0; i < totemsData.length; i++) {
        if (totemsData[i]['id'] === id) {
            return totemsData[i]['wardImagePath'];
        }
    }
}

totemData.forEach(element => {
    if (element['ownership']['owned'] == true) {
        var totemUrl = getTotemUrl(element['id']);
        $('#totemAlan').append(`<img id="${element['id']}" src="${ipcRenderer.sendSync("getImg", totemUrl)}" alt="">`);
        $(`#${element['id']}`).click(() => {
            window.location.href = `details/wardDetails.html?id=${element['id']}`;
        })
    }
});

summonerId = null;
champData = null;
totemsData = null;