async function getData() {
    var wardData = ipcRenderer.sendSync("get", `/lol-collections/v1/inventories/${currentSummoner.summonerId}/ward-skins`)['body'];
    var wardsData = ipcRenderer.sendSync("getApi", "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/ward-skins.json")['body'];

    function getWardUrl(id) {
        for (let i = 0; i < wardsData.length; i++) {
            if (wardsData[i]['id'] === id) {
                return wardsData[i]['wardImagePath'];
            }
        }
    }

    wardData.forEach(element => {
        if (element['ownership']['owned'] == true) {
            var wardUrl = getWardUrl(element['id']);
            document.getElementById('inventoryArea').innerHTML += `<img src="${ipcRenderer.sendSync("getImg", wardUrl)['body']}" alt="">`;
        }
    });
}