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

var versionData = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json")['body'];
var version = versionData[0];
versionData = null;

var summonerData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner")['body'];
var summonerId = summonerData['summonerId'];
var displayName = summonerData['displayName'];
var profileIconId = summonerData['profileIconId'];
var summonerLevel = summonerData['summonerLevel'];
summonerData = null;

$("#currentSummonerIcon").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`)
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");
version = null;


var iconData = ipcRenderer.sendSync("get", `/lol-inventory/v2/inventory/SUMMONER_ICON`)['body'];
var versionData = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json")['body'];
var version = versionData[0];
versionData = null;

iconData.forEach(element => {
    $('#simgeAlan').append(`<img id="${element['itemId']}" src="http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${element['itemId']}.png" alt="">`);
    $(`#${element['itemId']}`).click(() => {
        window.location.href = `details/iconDetails.html?id=${element['itemId']}`;
    })
});

summonerId = null;
iconData = null;
version = null;

$().ready(() => {
    $("#loadingArea").css({
        "display": "none"
    });
})

$("img, a").attr("draggable", false);