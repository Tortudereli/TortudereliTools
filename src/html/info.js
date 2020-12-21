const {
    ipcRenderer,
    shell
} = require("electron");
const $ = require("jquery");

var currentVersion = 1.5;
var statusData = ipcRenderer.sendSync("getApi",
    "https://cdn.jsdelivr.net/gh/Tortudereli/TortudereliTools@main/status.json")['body'];

if (statusData['status'] == 0) {
    $("#statusInfo").text(statusData['statusInfo']);
    $("#statusInfo").css({
        "color": statusData['statusInfoColor']
    });
} else if (currentVersion < statusData['minVersion']) {
    $("#statusInfo").text('Uygulama sürümü artık desteklenmiyor. Lütfen uygulamayı güncelleyiniz!');
    $("#statusInfo").append('<br> <br> <a href="#" id="link" style="color: #ffda52;">Tıkla</a>');
} else {
    window.location.href = '../index.html';
}

$("#link").click(() => {
    shell.openExternal('https://github.com/Tortudereli/TortudereliTools')
})