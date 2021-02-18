const {
  ipcRenderer,
  shell
} = require("electron");
const $ = require("jquery");

var currentVersion = 2.2;
var statusData = ipcRenderer.sendSync(
  "getApi",
  "https://raw.githubusercontent.com/Tortudereli/TortudereliTools/main/status.json"
)["body"];

if (statusData["status"] == 0) {
  $("#statusInfo").text(statusData["statusInfo"]);
  $("#statusInfo").css({
    color: statusData["statusInfoColor"],
  });
} else if (currentVersion < statusData["minVersion"]) {
  $("#statusInfo").text(
    "Uygulama sürümü artık desteklenmiyor. Lütfen uygulamayı güncelleyiniz!"
  );
  $("#statusInfo").append(
    '<br> <br> <a href="#" id="link" style="color: #ff5613; text-decoration-line: none;">TIKLA</a>'
  );
  $("#webmArea").append(
    '<video autoplay muted loop style="position: absolute; top: -8vh; left: 0; right: 0; margin: auto; width: 100vw; height: 128vh;"><source src="../images/webm/reward1_magic.webm" type="video/webm"></video>'
  );
} else if (statusData["info"] == 1) {
  $("#statusInfo").text(statusData["infoText"]);
  $("#statusInfo").css({
    color: statusData["infoTextColor"],
  });
  setTimeout(() => {
    window.location.href = "../index.html";
  }, statusData["infoTimer"]);
} else {
  window.location.href = "../index.html";
}

$("#webmArea").append(
  '<video autoplay muted style="position: absolute; bottom: 0; left: 0; right: 0; top: 0; margin: auto; width: 100vw; height: auto;"><source src="../images/webm/eog_intro_magic.webm" type="video/webm"></video>'
);

$("#link").click(() => {
  shell.openExternal("https://github.com/Tortudereli/TortudereliTools");
});

$("img, a").attr("draggable", false);