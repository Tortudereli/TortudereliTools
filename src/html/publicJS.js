const {
    ipcRenderer,
    shell
} = require("electron");


const versionData = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json").body[0];
const currentSummoner = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner").body;

const dirname = ipcRenderer.sendSync("getDirname");

document.body.innerHTML += `<div id="donatePopup" style="display: none;">
<span id="donateClose">X</span>
<h1>DONATE</h1>
<select name="selectBox" id="selectBox" class="form-select-lg"></select>
<select style="display: none;" name="selectBox2" id="selectBox2" class="form-select-lg"></select>
<img id="donateQrImg" src="" alt="">
<br>
<span id="donateDesc"></span>
<br>
<span id="donateDesc2"></span>
</div>
`;

document.body.innerHTML += `<div id="bugReportPopup" style="display: none;">
<span id="bugReportClose">X</span>
<h1>BUG REPORT</h1>
<p>Please contact when you find bug.</p>
<span>E-mail: <a href="mailto:tortudereli@outlook.com.tr">tortudereli@outlook.com.tr</a></span>
<br>
<span>Discord: Tortudereli#1382</span>
</div>
`;

document.getElementById("bugReport").addEventListener("click", () => {
    document.getElementById("donatePopup").style.display = "none";
    document.getElementById("bugReportPopup").style.display = "unset";
});

document.getElementById("bugReportClose").addEventListener("click", () => {
    document.getElementById("bugReportPopup").style.display = "none";
});

document.getElementById("donateButton").addEventListener("click", () => {
    document.getElementById("bugReportPopup").style.display = "none";
    document.getElementById("donatePopup").style.display = "unset";
});

document.getElementById("donateClose").addEventListener("click", () => {
    document.getElementById("donatePopup").style.display = "none";
});

document.getElementById("gitHubImg").addEventListener("click", () => {
    shell.openExternal('https://github.com/Tortudereli');

});
document.getElementById("currentVersion").addEventListener("click", () => {
    shell.openExternal('https://github.com/Tortudereli/TortudereliTools/releases');
});


document.getElementById("goProfile").setAttribute("href", `${dirname}\\src\\html\\profile\\index.html`);
document.getElementById("goInventory").setAttribute("href", `${dirname}\\src\\html\\inventory\\index.html`);
document.getElementById("goTools").setAttribute("href", `${dirname}\\src\\html\\tools\\index.html`);


let walletData;
const donateListData = ipcRenderer.sendSync("getApi", "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/donate/donateData.json").body;
donateListData.forEach(element => {
    document.getElementById("selectBox").innerHTML += `<option value="${element.short}">${element.name}</option>`;
});

document.getElementById("selectBox").addEventListener("change", () => {
    updateDonateData();
})

document.getElementById("selectBox2").addEventListener("change", () => {
    updateAddressData();
})

updateDonateData();

function updateDonateData() {
    donateListData.forEach(element => {
        if (element.short == document.getElementById("selectBox").value) {
            if (typeof element['networks'] !== 'undefined') {
                document.getElementById("selectBox2").style.display = "unset";
                document.getElementById("selectBox2").innerHTML = "";
                element['networks'].forEach(element => {
                    document.getElementById("selectBox2").innerHTML += `<option value="${element}">${element}</option>`;
                });
                updateAddressData();
            } else {
                document.getElementById("selectBox2").style.display = "none";
                document.getElementById("donateDesc2").innerText = "";
                walletData = ipcRenderer.sendSync("getApi", "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/donate/walletAdress.json").body['walletAddress'][element.short];
                document.getElementById("donateQrImg").setAttribute("src", walletData.qrURL);
                document.getElementById("donateDesc").innerText = walletData.address;
            }
        }
    });
}

function updateAddressData() {
    walletData = ipcRenderer.sendSync("getApi", "https://raw.githubusercontent.com/Tortudereli/TortudereliToolsCDN/main/donate/walletAdress.json").body['walletAddress'];
    let networkType = document.getElementById("selectBox2").value;
    document.getElementById("donateQrImg").setAttribute("src", walletData[networkType].qrURL);
    document.getElementById("donateDesc").innerText = walletData[networkType].address;
    if (networkType == "BEP2") {
        document.getElementById("donateDesc2").innerText = "memo: " + walletData.memo;
    } else {
        document.getElementById("donateDesc2").innerText = "";
    }
}

getData();