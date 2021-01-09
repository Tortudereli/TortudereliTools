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

var versionData = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json")['body'];
var version = versionData[0];
versionData = null;

var summonerData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner")['body'];
var displayName = summonerData['displayName'];
var profileIconId = summonerData['profileIconId'];
var summonerLevel = summonerData['summonerLevel'];
var summonerId = summonerData['summonerId'];
summonerData = null;

$("#currentSummonerIcon").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`);
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
var champId = getUrlVars()["id"];



var champData = ipcRenderer.sendSync("get", `/lol-champions/v1/inventories/${summonerId}/champions/${champId}`)['body'];

$("#main").css({
    "background": `url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champData['alias']}_0.jpg`,
    "background-repeat": "no-repeat",
    "background-size": "100% 100vh",
})

var freeToPlay = champData['freeToPlay'];
var champOwned = champData['ownership']['owned'];

$("#champDetailsName").text(champData['name']);
$("#champDetailsTitle").text(champData['title']);
document.title = champData['title'] + " " + champData['name'];
$("#champDetailsImg img").attr('src', `${ipcRenderer.sendSync("getImg", champData['squarePortraitPath'])['body']}`)


if (champOwned) {
    $("#champDetailsOwned").text("Mevcut");
    $("#champDetailsPurchaseDate").text(new Date(champData['ownership']['rental']['purchaseDate']).toLocaleString("tr-TR"));
} else {
    $("#champDetailsOwned").text("Mevcut Değil");
    $("#champDetailsPurchaseDate").text("-");
}


if (freeToPlay) {
    $("#champDetailsFreeToPlay").text("Var");
} else {
    $("#champDetailsFreeToPlay").text("Yok");
}


var champMasteyData = ipcRenderer.sendSync("get", `/lol-collections/v1/inventories/${summonerId}/champion-mastery`)['body'];

champMasteyData.forEach(element => {
    if (element['championId'] == champId) {
        $("#champDetailsLevel").text(element['championLevel']);
        $("#champDetailsPoint").text(element['formattedChampionPoints']);
        if (element['highestGrade'] !== "") {
            $("#champDetailsNote").text(element['highestGrade']);
        } else {
            $("#champDetailsNote").text("-");
        }
        $("#champDetailsLastPlayed").text(new Date(element['lastPlayTime']).toLocaleString("tr-TR"));
        if (element['chestGranted']) {
            $("#champDetailsChest").text("Alındı");
        } else {
            $("#champDetailsChest").text("Alınmadı");
        }
    }

});

var snd1 = new Audio(ipcRenderer.sendSync("getAudio", champData['stingerSfxPath'])['body']);
snd1.volume = 0.2;
snd1.play();

var snd2 = new Audio(ipcRenderer.sendSync("getAudio", champData['chooseVoPath'])['body']);
var snd3 = new Audio(ipcRenderer.sendSync("getAudio", champData['banVoPath'])['body']);
snd2.volume = 0.4;
snd3.volume = 0.4;

$("#audioChampSelect").click(() => {
    snd3.pause();
    snd2.pause();
    snd2.currentTime = 0;
    snd2.play();
});

$("#audioChampBan").click(() => {
    snd2.pause();
    snd3.pause();
    snd3.currentTime = 0;
    snd3.play();
});

champMasteyData = null;
version = null;

$().ready(() => {
    $("#loadingArea").css({
        "display": "none"
    });
})

$("img, a").attr("draggable", false);