async function getData() {
    document.getElementById("methodSelect").addEventListener('click', () => {
        document.getElementById('methodSelectDiv').style.display = "unset";
        document.getElementById('methodURLDiv').style.display = "none";
    });
    document.getElementById("methodURL").addEventListener('click', () => {
        document.getElementById('methodSelectDiv').style.display = "none";
        document.getElementById('methodURLDiv').style.display = "unset";
    });

    try {
        var patchData = await ipcRenderer.sendSync("get", "/lol-patch/v1/products/league_of_legends/supported-game-releases");
    } catch (error) {
        alert(error);
    }

    patchData["body"]["supported_game_releases"].forEach((element) => {
        document.getElementById("selectVersion").innerHTML += `<option value="${element["download"]["url"]}">${element["artifact_id"].substring(0, element["artifact_id"].indexOf("+"))}</option>`;
    });

    document.getElementById("installButton").addEventListener("click", async () => {
        var json = null;
        try {
            if (document.getElementById("methodSelectRadio").checked) {
                console.log(document.getElementById("selectVersion").value);
                json = {
                    url: `/lol-patch/v1/game-patch-url?url=${encodeURIComponent(document.getElementById("selectVersion").value)}`,
                    json: "",
                }
            } else if (document.getElementById("methodURLRadio").checked) {
                if (document.getElementById("inputURL").value.indexOf(".manifest") != -1 && document.getElementById("inputURL").value != ".manifest") {
                    json = {
                        url: `/lol-patch/v1/game-patch-url?url=${encodeURIComponent(document.getElementById("inputURL").value)}`,
                        json: "",
                    }
                } else {
                    document.getElementById("inputURL").focus();
                    document.getElementById("statusInfo").innerHTML = "Incorrect patch URL!";
                    document.getElementById("statusInfo").style.color = "#ff6850";
                    setTimeout(() => {
                        document.getElementById("statusInfo").innerHTML = "Status";
                        document.getElementById("statusInfo").style.color = "#fff";
                    }, 2000);
                }
            }
        } catch (error) {
            alert(error);
        } finally {
            if (json != null) {
                var status = await ipcRenderer.sendSync("put", json);
            }

            if (status["status"] == 201) {
                var json1 = {
                    url: "/lol-patch/v1/products/league_of_legends/start-patching-request",
                    json: "",
                };
                var status1 = await ipcRenderer.sendSync("post", json1);
                if (status1["status"] == 204) {
                    document.getElementById("statusInfo").innerHTML = "Successful! Patch started uploading!";
                    document.getElementById("statusInfo").style.color = "#60f15d";
                    setTimeout(() => {
                        document.getElementById("statusInfo").innerHTML = "Status";
                        document.getElementById("statusInfo").style.color = "#fff";
                    }, 2000);
                } else {
                    document.getElementById("statusInfo").innerHTML = "Patch failed to install!";
                    document.getElementById("statusInfo").style.color = "#ff6850";
                    setTimeout(() => {
                        document.getElementById("statusInfo").innerHTML = "Status";
                        document.getElementById("statusInfo").style.color = "#fff";
                    }, 2000);
                }
            } else {
                document.getElementById("statusInfo").innerHTML = "Incorrect patch selection!";
                document.getElementById("statusInfo").style.color = "#ff6850";
                setTimeout(() => {
                    document.getElementById("statusInfo").innerHTML = "Status";
                    document.getElementById("statusInfo").style.color = "#fff";
                }, 2000);
            }

            if (status["status"] == 400) {
                document.getElementById("statusInfo").innerText = "Incorrect URL entered. The game and application will be closed.";
                setTimeout(() => {
                    ipcRenderer.send("appClose");
                }, 800);
            }
        }
    });

}