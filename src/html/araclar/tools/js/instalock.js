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

var getChampions = ipcRenderer.sendSync("get", `/lol-champions/v1/owned-champions-minimal`)['body'];

getChampions.forEach(element => {
    if (element['id'] != -1) {
        $('#selectChamp').append(`<option value="${element['id']}">${element['name']}</option>`);
    }
});

sortSelect(document.getElementById("selectChamp"));

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

var champId = -1;
var timer;
$("#selectChamp").val(-1);
$("#selectChamp").change(() => {
    champId = $("#selectChamp").val();
})

$("#instalockChat").keyup(() => {
    chatMessage = $("#instalockChat").val();
})


$("#instalockCheckbox").change(() => {
    var checked = $("#instalockCheckbox").prop('checked');
    if (checked == true) {
        if (champId != -1) {
            timer = setInterval(() => {
                    for (let index = 1; index < 11; index++) {
                        var json = {
                            "url": `/lol-champ-select/v1/session/actions/${index}`,
                            "json": {
                                "championId": champId,
                                "completed": true
                            }
                        }
                        ipcRenderer.send("patch", json);

                        var kontrol = ipcRenderer.sendSync("get", "/lol-champ-select/v1/session")['body'];
                        kontrol = kontrol['actions'][index - 1];
                        $.each(kontrol, function (indexInArray, valueOfElement) {
                            if (valueOfElement['championId'] == champId) {
                                if (valueOfElement['completed'] == true) {
                                    $("#instalockCheckbox").prop('checked', false);
                                    clearInterval(timer);
                                    return;
                                }
                            }
                        });
                    }
                },
                500);
        } else {
            $("#instalockCheckbox").prop("checked", false);
            alert("Şampiyon seçin!");
        }
    } else {
        clearInterval(timer);
    }
})