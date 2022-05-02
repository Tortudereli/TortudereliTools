async function getData() {
    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }
    var champId = getUrlVars()["id"];
    var champData = ipcRenderer.sendSync("get", `/lol-champions/v1/inventories/${currentSummoner.summonerId}/champions/${champId}`).body;
    if (champData["alias"] == "FiddleSticks") {
        champData["alias"] = "Fiddlesticks";
    }
    var allChampData = ipcRenderer.sendSync("getApi", `http://ddragon.leagueoflegends.com/cdn/${versionData}/data/en_US/champion/${champData.alias}.json`).body;
    console.log(champData);
    console.log(allChampData);
    console.log(currentSummoner);
    
    for (let index = 0; index < Object.keys(allChampData["data"][champData.alias]["stats"]).length; index++) {
        document.getElementById("stats").innerHTML += Object.keys(allChampData["data"][champData.alias]["stats"])[index] + ": " + allChampData["data"][champData.alias]["stats"][Object.keys(allChampData["data"][champData.alias]["stats"])[index]] + "<br>";
    }

    for (let index = 0; index < Object.keys(allChampData["data"][champData.alias]["info"]).length; index++) {
        document.getElementById("info").innerHTML += Object.keys(allChampData["data"][champData.alias]["info"])[index] + ": " + allChampData["data"][champData.alias]["info"][Object.keys(allChampData["data"][champData.alias]["info"])[index]] + "<br>";
    }

    allChampData["data"][champData.alias]["tags"].forEach(element => {
        document.getElementById("tags").innerHTML += element + "<br>";
    });

    allChampData["data"][champData.alias]["allytips"].forEach(element => {
        document.getElementById("allytips").innerHTML += element + "<br>";
    });

    allChampData["data"][champData.alias]["enemytips"].forEach(element => {
        document.getElementById("enemytips").innerHTML += element + "<br>";
    });

    document.getElementById("passive").innerHTML += "Spell: " + allChampData["data"][champData.alias]["passive"]["name"] + "<br>";
    document.getElementById("passive").innerHTML += "Desc: " + allChampData["data"][champData.alias]["passive"]["description"] + "<br><br>";

    allChampData["data"][champData.alias]["spells"].forEach(element => {
        document.getElementById("spells").innerHTML += `
        <span>Spell: ${element["id"]}</span><br>
        <span>Name: ${element["name"]}</span><br>
        <span>Desc: ${element["description"]}</span><br>
        <span>Max rank: ${element["maxrank"]}</span><br>
        <span>Cooldown: ${element["cooldownBurn"]}</span><br>
        <span>Cost: ${element["costBurn"]}</span><br>
        <span>Range: ${element["rangeBurn"]}</span><br>
        <br><br>`
    });

    document.title = champData.title + " " + champData.name;
    document.body.style.backgroundImage = `url(${ipcRenderer.sendSync("getImg", champData.baseSplashPath).body})`;
    document.getElementById("champHeader").innerText = champData.title + " " + champData.name;
}