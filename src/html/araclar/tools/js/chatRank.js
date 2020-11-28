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

var version = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json");
version = version[0];

var summonerData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner");
var displayName = summonerData['displayName'];
var profileIconId = summonerData['profileIconId'];
var summonerLevel = summonerData['summonerLevel'];
summonerData = null;

$("#currentSummonerIcon").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`)
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");
version = null;

var rank = "IRON";
$("#chatRankSelectRank").change(() => {
    rank = $("#chatRankSelectRank").val();
    if (rank == "MASTER" || rank == "GRANDMASTER" || rank == "CHALLENGER") {
        $("#chatRankSelectDivision option").remove();
        $('#chatRankSelectDivision').append('<option id="I">I</option>');
    } else {
        $("#chatRankSelectDivision option").remove();
        $('#chatRankSelectDivision').append('<option id="I">I</option>');
        $('#chatRankSelectDivision').append('<option id="II">II</option>');
        $('#chatRankSelectDivision').append('<option id="III">III</option>');
        $('#chatRankSelectDivision').append('<option id="IV">IV</option>');
    }
})

var division = "I";
$("#chatRankSelectDivision").change(() => {
    division = $("#chatRankSelectDivision").val();
})

var queue = "RANKED_SOLO_5x5";
$("#chatRankSelectQueue").change(() => {
    queue = $("#chatRankSelectQueue").val();
    if (queue == "Dereceli Tek/Çift") {
        queue = "RANKED_SOLO_5x5";
    } else if (queue == "Dereceli Esnek") {
        queue = "RANKED_FLEX_SR";
    } else if (queue == "Dereceli TFT") {
        queue = "RANKED_TFT";
    }
})

$("#submitChatRank").click(() => {
    var json = {
        "url": "/lol-chat/v1/me",
        "json": {
            "lol": {
                "rankedLeagueDivision": division,
                "rankedLeagueQueue": queue,
                "rankedLeagueTier": rank
            }
        }
    }
    ipcRenderer.send("put", json);
})