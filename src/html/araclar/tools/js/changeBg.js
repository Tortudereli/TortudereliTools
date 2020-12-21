const {
    ipcRenderer
} = require("electron");
const $ = require("jquery");

const {
    shell
} = require('electron');
const { isEmptyObject } = require("jquery");

$("#github").click(() => {
    shell.openExternal('https://github.com/Tortudereli')
})

$("#eSampiyon").addClass("active");

var version = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json")['body'];
version = version[0];

var summonerData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner")['body'];
var displayName = summonerData['displayName'];
var summonerId = summonerData['summonerId'];
var profileIconId = summonerData['profileIconId'];
var summonerLevel = summonerData['summonerLevel'];
summonerData = null;

$("#currentSummonerIcon").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`)
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");

var backgroundIdData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner/summoner-profile")['body'];
var backgroundId = backgroundIdData['backgroundSkinId'];
backgroundIdData = null;
var backgroundChampId = String(backgroundId).substring(0, String(backgroundId).length - 3);

switch (backgroundId) {
	default:
        var skinData = ipcRenderer.sendSync("get", `/lol-champions/v1/inventories/${summonerId}/champions/${backgroundChampId}/skins/${backgroundId}`)['body'];
        var backgroundImagePath = skinData['splashPath'];
        break;

    case 147002:
        var skinData = ipcRenderer.sendSync("get", `/lol-champions/v1/inventories/${summonerId}/champions/${backgroundChampId}/skins/147001`)['body'];
        var backgroundImagePath = skinData['questSkinInfo']['tiers'][1]['splashPath'];
        break;

    case 147003:
        var skinData = ipcRenderer.sendSync("get", `/lol-champions/v1/inventories/${summonerId}/champions/${backgroundChampId}/skins/147001`)['body'];
        var backgroundImagePath = skinData['questSkinInfo']['tiers'][2]['splashPath'];
        break;
}

skinData = null;
$("#main").css({
    "background": `url(${ipcRenderer.sendSync("getImg", `${backgroundImagePath}`)['body']}`,
    "background-repeat": "no-repeat",
    "background-size": "100% 100vh"
})

var getChampions = ipcRenderer.sendSync("getApi", `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/tr_tr/v1/champion-summary.json`)['body'];

getChampions.forEach(element => {
    if (element['id'] !== -1) {
        $('#bgSelectChamp').append(`<option value="${element['id']}">${element['name']}</option>`);
    }
});

getChampions = null;
sortSelect(document.getElementById("bgSelectChamp"));

function sortSelect(selElem) {
    var tmpAry = new Array();
    for (var i = 0; i < selElem.options.length; i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selElem.options[i].text;
        tmpAry[i][1] = selElem.options[i].value;
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (var i = 0; i < tmpAry.length; i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        selElem.options[i] = op;
    }
    return;
}



$("#bgSelectChamp").change(() => {
    var champId = $('#bgSelectChamp').val();
    $("#bgSelectSkin option").remove();
    $('#bgSelectSkin').append(`<option id="defaultSkin">- Kostüm Seç -</option>`);

	var getSkins = ipcRenderer.sendSync("get", `/lol-champions/v1/inventories/${summonerId}/champions/${champId}/skins`)['body'];
	
	getSkins.forEach(element => {
        $('#bgSelectSkin').append(`<option value="${element['id']}">${element['name']}</option>`);
        if (element['questSkinInfo']['tiers'].length !== 0) {
            element['questSkinInfo']['tiers'].forEach(element1 => {
                if (element1['id'] !== element['id']) {
                    $('#bgSelectSkin').append(`<option value="${element1['id']}">${element1['name']}</option>`);
                }
            });
        }
    });
    
    getSkins = null;
})

var skinId;
$("#bgSelectSkin").change(() => {
    skinId = $('#bgSelectSkin').val();
    $("#defaultSkin").remove();
})

$("#submitBg").click(() => {
    var json = {
        "url": "/lol-summoner/v1/current-summoner/summoner-profile",
        "json": {
            "key": "backgroundSkinId",
            "value": skinId
        }
    }
    ipcRenderer.send("post", json);
	location.reload();
})
version = null;