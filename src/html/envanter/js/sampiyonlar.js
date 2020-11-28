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
summonerData = null;

$("#currentSummonerIcon").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`)
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");
version = null;


var champData = ipcRenderer.sendSync("get", `/lol-champions/v1/owned-champions-minimal`);
champData.forEach(element => {
    $('#sampiyonAlan').append(`<img id="${element['id']}" src="${ipcRenderer.sendSync("getImg", element['baseLoadScreenPath'])}" alt="">`);
    $(`#${element['id']}`).click(() => {
        window.location.href = `details/championDetails.html?id=${element['id']}`;
    })
});
summonerId = null;