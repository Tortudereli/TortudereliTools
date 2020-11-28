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

$("#eSimge").addClass("active");

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


var iconData = ipcRenderer.sendSync("get", `/lol-collections/v2/inventories/${summonerId}/summoner-icons`);
var versionData = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json");
var version = versionData[0];
versionData = null;

iconData['icons'].forEach(element => {
    $('#simgeAlan').append(`<img id="${element}" src="http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${element}.png" alt="">`);
    $(`#${element}`).click(() => {
        window.location.href = `details/iconDetails.html?id=${element}`;
    })
});

summonerId = null;
iconData = null;
version = null;