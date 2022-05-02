async function getData() {
    let champData = await ipcRenderer.sendSync("getApi", `http://ddragon.leagueoflegends.com/cdn/${versionData}/data/en_US/champion.json`).body;

    Object.keys(champData.data).forEach(element => {
        document.getElementById("selectBgChamp").innerHTML += `<option value="${element}">${element}</option>`;
    });
    champData = null;

    function skinList() {
        document.getElementById("selectBgSkin").innerHTML = null;
        let champValue = document.getElementById("selectBgChamp").value;
        let skinData = ipcRenderer.sendSync("getApi", `http://ddragon.leagueoflegends.com/cdn/${versionData}/data/en_US/champion/${champValue}.json`).body;
        skinData.data[champValue].skins.forEach(element => {
            if (element.name === "default") {
                document.getElementById("selectBgSkin").innerHTML += `<option value="${element.id}">${champValue}</option>`;
            } else {
                document.getElementById("selectBgSkin").innerHTML += `<option value="${element.id}">${element.name}</option>`;
            }
        });
        skinData = null;
    }

    skinList();
    document.getElementById("selectBgChamp").addEventListener("change", () => {
        skinList();
    })

    document.getElementById("changeBgAccept").addEventListener("click", () => {
        var json = {
            url: "/lol-summoner/v1/current-summoner/summoner-profile",
            json: {
                key: "backgroundSkinId",
                value: document.getElementById("selectBgSkin").value,
            },
        };
        ipcRenderer.send("post", json);
        location.reload();
    })

    const backgroundChampId = await ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner/summoner-profile").body.backgroundSkinId;
    let skinsData;
    switch (backgroundChampId) {
      case 147002:
        skinsData = {
          splashPath: "/lol-game-data/assets/v1/champion-splashes/147/147002.jpg"
        }
        break;
  
      case 147003:
        skinsData = {
          splashPath: "/lol-game-data/assets/v1/champion-splashes/147/147003.jpg"
        }
        break;
  
      default:
        skinsData = await ipcRenderer.sendSync("getApi", "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/skins.json").body[backgroundChampId];
        break;
    }
    document.body.style.backgroundImage = `url(${ipcRenderer.sendSync("getImg", skinsData.splashPath).body})`;
    skinsData = null;
}