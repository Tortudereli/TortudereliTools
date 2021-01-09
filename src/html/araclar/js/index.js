const {
  ipcRenderer
} = require("electron");
const $ = require("jquery");
const {
  exec
} = require("child_process");
const {
  shell
} = require("electron");

$("#github").click(() => {
  shell.openExternal("https://github.com/Tortudereli");
});

var versionData = ipcRenderer.sendSync(
  "getApi",
  "https://ddragon.leagueoflegends.com/api/versions.json"
)["body"];
var version = versionData[0];
versionData = null;

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
$("#iconChange div img").attr(
  "src",
  `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`
);
version = null;

var buttonSound = new Audio("../../sounds/sfx-uikit-button-gold-click.ogg");
var activeSound = new Audio("../../sounds/sfx-ps-ui-nav-button-click.ogg");
$("#trainingTool button").click(() => {
  buttonSound.pause();
  buttonSound.currentTime = 0;
  buttonSound.play();
  var json = {
    url: "/lol-lobby/v2/lobby",
    json: {
      customGameLobby: {
        configuration: {
          gameMode: "PRACTICETOOL",
          mapId: 11,
          mutators: {
            id: 1,
          },
          teamSize: 5,
        },
        lobbyName: "Tortudereli Antrenman Modu",
        lobbyPassword: "",
      },
      isCustom: true,
    },
  };
  ipcRenderer.send("post", json);
});

$("#skinBoost button").click(() => {
  buttonSound.pause();
  buttonSound.currentTime = 0;
  buttonSound.play();
  var wallet = ipcRenderer.sendSync("get", "/lol-store/v1/wallet")["body"];
  var r = confirm(
    `Bu özellik kostüm takviyesi açılabilen oyun modunun şampiyon seçim ekranında çalışır. (Örneğin: ARAM)\n${displayName} hesabınızda ${wallet["rp"]} RP vardır.\nEğer hesabınızda 95 RP ve üstü RP varsa ücret hesabınızdan düşürülür.\nRP'niz yokken aktifleştirilmesi tavsiye edilir.\nOlabilecek herhangi bir olumsuz sonuçtan yapımcı sorumlu değildir!\nOnaylıyor musunuz?`
  );
  if (r == true) {
    var json = {
      url: "/lol-champ-select/v1/team-boost/purchase",
      json: "",
    };
    var durum = ipcRenderer.sendSync("post", json);
    if (durum['status'] == 204) {
      var boostSound = new Audio("../../sounds/sfx-cs-notif-boost-unlocked.ogg");
      boostSound.play();
    } else {
      alert("Kostüm takviyesi aktifleştirilemedi!");
    }
  }
  wallet = null;
  r = null;
});

$("#iconChange button").click(() => {
  window.location.href = "tools/changeIcon.html";
});

$("#backgroundChange button").click(() => {
  window.location.href = "tools/changeBg.html";
});

$("#instalock button").click(() => {
  alert("Kapalı seçimde kullanmanız önerilir!");
  window.location.href = "tools/instalock.html";
});

$("#instalock .toolsImg img").attr("src", ipcRenderer.sendSync("getImg", "/lol-game-data/assets/v1/champion-icons/157.png")['body']);

$("#offlineActive").click(() => {
  buttonSound.pause();
  buttonSound.currentTime = 0;
  buttonSound.play();
  alert("Bu özelliği kullanmak için programı yönetici olarak çalıştırmanız gerekmektedir.\nAntivirüs programı bu özelliğin kullanılmasını engelleyebilir.");
  exec(
    'netsh advfirewall firewall add rule name="LoLChatOffline" dir=out remoteip=172.65.202.166 protocol=any action=block',
    (error, data, getter) => {
      if (error) {
        console.log("error", error.message);
        return;
      }
      if (getter) {
        console.log("data", data);
        return;
      }
      console.log("data", data);
    }
  );
});

$("#offlineDeactive").click(() => {
  buttonSound.pause();
  buttonSound.currentTime = 0;
  buttonSound.play();
  exec(
    'netsh advfirewall firewall delete rule name="LoLChatOffline"',
    (error, data, getter) => {
      if (error) {
        console.log("error", error.message);
        return;
      }
      if (getter) {
        console.log("data", data);
        return;
      }
      console.log("data", data);
    }
  );
});

$("#chatRank button").click(() => {
  window.location.href = "tools/chatRank.html";
});

$("#autoChampSelect button").click(() => {
  window.location.href = "tools/autoChampSelect.html";
});

$("#patchInstall button").click(() => {
  window.location.href = "tools/patchInstall.html";
});

var backgroundIdData = ipcRenderer.sendSync(
  "get",
  "/lol-summoner/v1/current-summoner/summoner-profile"
)["body"];
var backgroundId = backgroundIdData["backgroundSkinId"];
backgroundIdData = null;
var backgroundChampId = String(backgroundId).substring(
  0,
  String(backgroundId).length - 3
);

switch (backgroundId) {
  default:
    var skinData = ipcRenderer.sendSync(
      "get",
      `/lol-champions/v1/inventories/${summonerId}/champions/${backgroundChampId}/skins/${backgroundId}`
    )["body"];
    var backgroundImagePath = skinData["tilePath"];
    break;

  case 147002:
    var skinData = ipcRenderer.sendSync(
      "get",
      `/lol-champions/v1/inventories/${summonerId}/champions/${backgroundChampId}/skins/147001`
    )["body"];
    var backgroundImagePath = skinData["questSkinInfo"]["tiers"][1]["tilePath"];
    break;

  case 147003:
    var skinData = ipcRenderer.sendSync(
      "get",
      `/lol-champions/v1/inventories/${summonerId}/champions/${backgroundChampId}/skins/147001`
    )["body"];
    var backgroundImagePath = skinData["questSkinInfo"]["tiers"][2]["tilePath"];
    break;
}

$("#backgroundChange div img").attr(
  "src",
  ipcRenderer.sendSync("getImg", `${backgroundImagePath}`)["body"]
);

var currentGameVersion = ipcRenderer.sendSync("get", "/lol-patch/v1/game-version");
if (typeof currentGameVersion['body'] == 'undefined') {
  $("#patchInstallVersion").text("--------------");
} else {
  $("#patchInstallVersion").text(currentGameVersion['body'].substring(0, currentGameVersion['body'].indexOf("+")));
}

$().ready(() => {
  $("#loadingArea").css({
    "display": "none"
  });
})

$("img, a").attr("draggable", false);