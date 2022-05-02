async function getData() {
    var champData = ipcRenderer.sendSync("get", `/lol-champions/v1/owned-champions-minimal`).body;
    console.log(champData);

    champData.forEach(element => {
        if (element.freeToPlay === false && element.ownership.owned === true) {
            document.getElementById("inventoryArea").innerHTML += `<a href="${dirname}\\src\\html\\inventory\\details\\champDetails.html?id=${element.id}"><img src="${ipcRenderer.sendSync("getImg", element.baseLoadScreenPath).body}"></img></a>`;
        }
    });
}