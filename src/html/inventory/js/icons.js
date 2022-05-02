async function getData() {
    var iconData = ipcRenderer.sendSync("get", `/lol-inventory/v2/inventory/SUMMONER_ICON`)['body'];
    iconData.forEach(element => {
        document.getElementById('inventoryArea').innerHTML += `<img src="http://ddragon.leagueoflegends.com/cdn/${versionData}/img/profileicon/${element['itemId']}.png" alt="">`;
    });
}