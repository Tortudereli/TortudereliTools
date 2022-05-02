async function getData() {
    const currentGameVersion = await ipcRenderer.sendSync("get", "/lol-patch/v1/game-version");

    if (typeof currentGameVersion['body'] == 'undefined') {
        document.getElementById('patchInstallVersion').innerText = "--------------";
    } else {
        document.getElementById('patchInstallVersion').innerText = currentGameVersion['body'].substring(0, currentGameVersion['body'].indexOf("+"));
    }

    document.getElementById("instalockToolImg").src = await ipcRenderer.sendSync("getImg", "/lol-game-data/assets/v1/champion-icons/157.png")['body'];

    const backgroundChampId = await ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner/summoner-profile").body.backgroundSkinId;

    let skinsData;
    switch (backgroundChampId) {
        case 147002:
            skinsData = {
                tilePath: "/lol-game-data/assets/v1/champion-tiles/147/147002.jpg"
            }
            break;

        case 147003:
            skinsData = {
                tilePath: "/lol-game-data/assets/v1/champion-tiles/147/147003.jpg"
            }
            break;

        default:
            skinsData = await ipcRenderer.sendSync("getApi", "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json").body[backgroundChampId];
            break;
    }
    document.getElementById("bgImage").src = await ipcRenderer.sendSync("getImg", skinsData.tilePath).body;
    skinsData = null;
}