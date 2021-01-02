const {
    ipcRenderer
} = require("electron");
const $ = require("jquery");
const {
    exec
} = require("child_process");
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
summonerData = null;

$("#currentSummonerIcon").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`)
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");
version = null;


$("#trainingTool button").click(() => {
    var json = {
        "url": "/lol-lobby/v2/lobby",
        "json": {
            "customGameLobby": {
                "configuration": {
                    "gameMode": "PRACTICETOOL",
                    "mapId": 11,
                    "mutators": {
                        "id": 1
                    },
                    "teamSize": 5
                },
                "lobbyName": "Antrenman Modu",
                "lobbyPassword": ""
            },
            "isCustom": true
        }
    }
    ipcRenderer.send("post", json);
})

$("#skinBoost button").click(() => {
    var wallet = ipcRenderer.sendSync("get", "/lol-store/v1/wallet")['body'];
    var r = confirm(`Bu özellik kostüm takviyesi açılabilen oyun modunun şampiyon seçim ekranında çalışır. (Örneğin: ARAM)\n${displayName} hesabınızda ${wallet['rp']} RP vardır.\nEğer hesabınızda 95 RP ve üstü RP varsa ücret hesabınızdan düşürülür.\nRP'niz yokken aktifleştirilmesi tavsiye edilir.\nOlabilecek herhangi bir olumsuz sonuçtan yapımcı sorumlu değildir!\nOnaylıyor musunuz?`);
    if (r == true) {
        var json = {
            "url": "/lol-champ-select/v1/team-boost/purchase",
            "json": ""
        }
        ipcRenderer.send("post", json);
    }
    wallet = null;
    r = null;
})


$("#iconChange button").click(() => {
    window.location.href = 'tools/changeIcon.html';
})

$("#backgroundChange button").click(() => {
    window.location.href = 'tools/changeBg.html';
})

$("#instalock button").click(() => {
    window.location.href = 'tools/instalock.html';
})

$("#offlineCheckBox").change(() => {
    var checked = $("#offlineCheckBox").prop('checked');
    if (checked == true) {
        exec("netsh advfirewall firewall add rule name=\"LoLChatOffline\" dir=out remoteip=172.65.202.166 protocol=any action=block", (error, data, getter) => {
            if (error) {
                console.log("error", error.message);
                return;
            }
            if (getter) {
                console.log("data", data);
                return;
            }
            console.log("data", data);
        });
    } else if (checked == false) {
        exec("netsh advfirewall firewall delete rule name=\"LoLChatOffline\"", (error, data, getter) => {
            if (error) {
                console.log("error", error.message);
                return;
            }
            if (getter) {
                console.log("data", data);
                return;
            }
            console.log("data", data);
        });
    }
})

$("#chatRank button").click(() => {
    window.location.href = 'tools/chatRank.html';
})

$("#autoChampSelect button").click(() => {
    window.location.href = 'tools/autoChampSelect.html';
})

$("#patchInstall button").click(() => {
    window.location.href = 'tools/patchInstall.html';
})