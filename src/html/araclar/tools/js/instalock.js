const {
  ipcRenderer
} = require("electron");
const $ = require("jquery");

const {
  shell
} = require("electron");

$("#github").click(() => {
  shell.openExternal("https://github.com/Tortudereli");
});

var version = ipcRenderer.sendSync(
  "getApi",
  "https://ddragon.leagueoflegends.com/api/versions.json"
)["body"];
version = version[0];

var summonerData = ipcRenderer.sendSync(
  "get",
  "/lol-summoner/v1/current-summoner"
)["body"];
var displayName = summonerData["displayName"];
var summonerId = summonerData["summonerId"];
var profileIconId = summonerData["profileIconId"];
var summonerLevel = summonerData["summonerLevel"];
summonerData = null;

$("#currentSummonerIcon").attr(
  "src",
  `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`
);
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");

var getChampions = ipcRenderer.sendSync(
  "get",
  `/lol-champions/v1/owned-champions-minimal`
)["body"];

getChampions.forEach((element) => {
  if (element["id"] != -1) {
    $("#selectChamp").append(
      `<option value="${element["id"]}">${element["name"]}</option>`
    );
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
var messageLane = 0;
var timer;
$("#selectChamp").val(-1);
$("#selectChamp").change(() => {
  champId = $("#selectChamp").val();
});

$("#messageLane").change(() => {
  messageLane = $("#messageLane").val();
});

$("#instalockChat").keyup(() => {
  chatMessage = $("#instalockChat").val();
});

var activeSound = new Audio("../../../sounds/sfx-ps-ui-nav-button-click.ogg");
var successSound = new Audio("../../../sounds/sfx-cs-notif-boost-unlocked.ogg");
var currentActorId = null;
checkCheckBoxTimer = setInterval(() => {
  if ($("#instalockCheckbox").prop("checked") == true) {
    if (champId != -1) {
      activeSound.play();
      var champSelectData = ipcRenderer.sendSync("get", "/lol-champ-select/v1/session");
      if (champSelectData["status"] == 200) {
        if (currentActorId == null) {
          currentActorId = champSelectData['body']['localPlayerCellId'];
          champSelectData['body']['actions'].forEach(element => {
            element.forEach(element => {
              if (element['type'] == "pick" && element['actorCellId'] == currentActorId) {
                var json = {
                  url: `/lol-champ-select/v1/session/actions/${element['id']}`,
                  json: {
                    "championId": champId,
                    "completed": true,
                  }
                };
                champSelectStatus = ipcRenderer.sendSync("patch", json);
              }
            });
          });
        }

        if (champSelectStatus['status'] == 204) {
          $("#instalockCheckbox").prop("checked", false);
          successSound.volume = 0.3;
          successSound.play();
          if (messageLane != 0) {
            chatCheck(messageLane);
          }
        }
      } else {
        currentActorId = null;
      }
    } else {
      $("#instalockCheckbox").prop("checked", false);
      alert("Şampiyon seçin!");
    }
  }
}, 300);

$().ready(() => {
  $("#loadingArea").css({
    display: "none"
  });
});

$("img, a").attr("draggable", false);

function chatCheck(msg) {
  try {
    var groupChatId = null;
    do {
      var groupChatData = ipcRenderer.sendSync("get", "/lol-chat/v1/conversations");
      groupChatData['body'].forEach(element => {
        if (element['type'] == "championSelect") {
          groupChatId = element['id'];
        }
      });

      if (groupChatId != null) {
        sendMessage(msg, groupChatId);
      }

    } while (groupChatId == null);

  } catch (error) {
    console.log(error);
  };
}

function sendMessage(msg, id) {
  var sohbetJson = {
    url: `/lol-chat/v1/conversations/${id}/messages`,
    json: {
      "body": msg
    }
  };
  ipcRenderer.sendSync("post", sohbetJson);
  var sendMessageIndex = 0;
  sendMessageTimer = setInterval(() => {
    var sendMessageStatus = 404;
    if (sendMessageIndex < 3) {
      sendMessageStatus = ipcRenderer.sendSync("post", sohbetJson)['status'];
    } else {
      clearInterval(sendMessageTimer);
    }
    if (sendMessageStatus == 200) {
      sendMessageIndex++;
    }
  }, 500)
}