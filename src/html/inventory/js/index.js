async function getData() {
    var champData = ipcRenderer.sendSync("getApi", `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json`).body;
    champData.splice(0, 1);

    champData.forEach(element => {
        var imagePath = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${element.id}/${element.id}000.jpg`;
        document.getElementById("inventoryArea").innerHTML += `<a href="${dirname}\\src\\html\\inventory\\details\\champDetails.html?id=${element.id}"><img src="${imagePath}"></img></a>`;
    });
}