async function getData() {
    var skinData = ipcRenderer.sendSync("get", `/lol-champions/v1/inventories/${currentSummoner.summonerId}/skins-minimal`)['body'];
    skinData.forEach(element => {
        if (element['isBase'] !== true) {
            if (element['ownership']['owned'] == true) {
                document.getElementById('inventoryArea').innerHTML += `<img id="${element['id']}" src="${ipcRenderer.sendSync("getImg", element['tilePath'])['body']}" alt="">`;
            }
        }
    });
}