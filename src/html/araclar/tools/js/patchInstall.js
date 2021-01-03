const {
    ipcRenderer
} = require("electron");
const $ = require("jquery");

const {
    shell
} = require('electron');

$("#github").click(() => {
    shell.openExternal('https://github.com/Tortudereli')
})

$("#eSampiyon").addClass("active");

var version = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json")['body'];
version = version[0];

var summonerData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner")['body'];
var displayName = summonerData['displayName'];
var profileIconId = summonerData['profileIconId'];
var summonerLevel = summonerData['summonerLevel'];
summonerData = null;

$("#currentSummonerIcon").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`)
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");

$("#typeSelect").change(() => {
    if ($("#typeSelect").prop('checked') == true) {
        $("#urlPatchArea").css({
            "display": "none"
        });
        $("#selectPatchArea").css({
            "display": "unset"
        });
    }
})

$("#typeUrl").change(() => {
    if ($("#typeUrl").prop('checked') == true) {
        $("#selectPatchArea").css({
            "display": "none"
        });
        $("#urlPatchArea").css({
            "display": "unset"
        });
    }
})

$("#infoPatchButton").click(() => {
    var r = confirm(`Bunu sadece eski veya yeni yamadaki oyun dosyalarına erişmek için kullanın!\nYama yaptıktan sonra eşleşmeli oyuna girmeye çalışmayın!\nOyunu kapatıp tekrar açınca otomatik olarak mevcut yama yüklenecektir. Mevcut yama dışında eşleşmeli oyuna girmeyin!\nEşleşmeli oyuna girmeden önce tam onarım yapın!\nOluşabilecek olumsuz sonuçlardan yapımcı sorumlu değildir!\nOnayladığınız takdirde "Yükle" butonu aktifleşecektir.`);
    if (r == true) {
        $("#submitPatchButton").prop('disabled', false);
    } else {
        $("#submitPatchButton").prop('disabled', true);
    }
})

var patchData = ipcRenderer.sendSync("get", "/lol-patch/v1/products/league_of_legends/supported-game-releases")

patchData['body']['supported_game_releases'].forEach(element => {
    $("#selectPatch").append(`<option value="${element['download']['url']}">${element['artifact_id'].substring(0, element['artifact_id'].indexOf("+"))}</option>`)
});

$("#submitPatchButton").click(() => {
    var json = null;
    if ($("#typeSelect").prop('checked') == true) {
        if ($("#selectPatch").val() == 0) {
            alert("Yama seçmedin!");
            json = null;
        } else {
            json = {
                "url": `/lol-patch/v1/game-patch-url?url=${encodeURIComponent($("#selectPatch").val())}`,
                "json": ""
            }
        }
    } else if ($("#typeUrl").prop('checked') == true) {
        if ($("#urlPath").val().search(".manifest") == -1) {
            alert("Geçersiz URL!");
            json = null;
        } else {
            json = {
                "url": `/lol-patch/v1/game-patch-url?url=${encodeURIComponent($("#urlPath").val())}`,
                "json": ""
            }
        }
    }

    if (json != null) {
        var status = ipcRenderer.sendSync("put", json);
    }

    if (status['status'] == 201) {
        var json1 = {
            "url": "/lol-patch/v1/products/league_of_legends/start-patching-request",
            "json": ""
        }
        var status1 = ipcRenderer.sendSync("post", json1);
        if (status1['status'] == 204) {
            alert("Yama yüklenmeye başlandı!");
        } else {
            alert("Yama yüklenemedi!");
        }
    } else {
        alert("Hatalı yama seçimi!");
    }
})