async function getData() {
    var emoteData = ipcRenderer.sendSync("get", `/lol-inventory/v2/inventory/EMOTE`)['body'];
    var emotesData = ipcRenderer.sendSync("getApi", "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-emotes.json")['body'];
    
    function getEmoteUrl(id) {
        for (let i = 0; i < emotesData.length; i++) {
            if (emotesData[i]['id'] === id) {
                return emotesData[i]['inventoryIcon'];
            }
        }
    }

    emoteData.forEach(element => {
        var emoteUrl = getEmoteUrl(element['itemId']);
        document.getElementById('inventoryArea').innerHTML += `<img src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/loadouts/summoneremotes${emoteUrl.substring(52).toLowerCase()}" alt="">`;
    });
}