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

$("#eKostum").addClass("active");

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

var skinData = ipcRenderer.sendSync("get", `/lol-champions/v1/inventories/${summonerId}/skins-minimal`);
console.log(skinData)
skinData.forEach(element => {
    if (element['isBase'] !== true) {
        if (element['ownership']['owned'] == true) {
            $('#kostumAlan').append(`<img id="${element['id']}" src="${ipcRenderer.sendSync("getImg", element['tilePath'])}" alt="">`);
            $(`#${element['id']}`).click(() => {
                window.location.href = `details/skinDetails.html?champId=${element['championId']}&id=${element['id']}`;
            })
        }
    }
});

skinData = null;