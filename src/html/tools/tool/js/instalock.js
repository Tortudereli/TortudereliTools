async function getData() {
    var getChampions = await ipcRenderer.sendSync(
        "get",
        `/lol-champions/v1/owned-champions-minimal`
    )["body"];

    getChampions.forEach(element => {
        if (element["id"] != -1) {
            if (element.freeToPlay === true && element.ownership.owned === false) {
                document.getElementById("selectChamp").innerHTML += `<option value="${element["id"]}">${element["name"]}*</option>`;
            } else {
                document.getElementById("selectChamp").innerHTML += `<option value="${element["id"]}">${element["name"]}</option>`;
            }
        }
    });
    sortSelect(document.getElementById("selectChamp"));

    function sortSelect(selElem) {
        var tmpAry = new Array();
        for (var i = 0; i < selElem.options.length; i++) {
            tmpAry[i] = new Array();
            tmpAry[i][0] = selElem.options[i].text;
            tmpAry[i][1] = selElem.options[i].value;
        }
        tmpAry.sort();
        while (selElem.options.length > 0) {
            selElem.options[0] = null;
        }
        for (var i = 0; i < tmpAry.length; i++) {
            var op = new Option(tmpAry[i][0], tmpAry[i][1]);
            selElem.options[i] = op;
        }
        return;
    }

    setInterval(() => {
        if (document.getElementById("instalockActive").checked) {
            var champSelectData = ipcRenderer.sendSync("get", "/lol-champ-select/v1/session");
            if (champSelectData.status === 200) {
                var currentActorId = champSelectData.body.localPlayerCellId;
                champSelectData.body.actions.forEach(element => {
                    element.forEach(element => {
                        if (element.type == "pick" && element.actorCellId == currentActorId) {
                            var json = {
                                url: `/lol-champ-select/v1/session/actions/${element['id']}`,
                                json: {
                                    "championId": document.getElementById("selectChamp").value,
                                    "completed": true,
                                }
                            };
                            var champSelectStatus = ipcRenderer.sendSync("patch", json);
                            afterAction(champSelectStatus.status);
                        }
                    });
                });
            }
        }
    }, 300);


    function afterAction(status) {
        if (status === 204) {
            document.getElementById("instalockActive").checked = false;
            if (document.getElementById("selectLane").value != 0) {
                var chatId = null;
                const chatIDInterval = setInterval(() => {
                    var chatData = ipcRenderer.sendSync("get", "/lol-chat/v1/conversations").body;
                    chatData.forEach(element => {
                        if (element.type == "championSelect") {
                            chatId = element.id;
                        }
                    });
                    if (chatId != null) {
                        sendMsg();
                        clearInterval(chatIDInterval);
                    }
                }, 100);

                function sendMsg() {
                    var sohbetJson = {
                        url: `/lol-chat/v1/conversations/${chatId}/messages`,
                        json: {
                            "body": document.getElementById("selectLane").value
                        }
                    };

                    var i = 0;
                    const sendMsgInterval = setInterval(() => {
                        var reqData = ipcRenderer.sendSync("post", sohbetJson);
                        if (reqData.status === 200) {
                            i++;
                        }

                        if (i === 4) {
                            clearInterval(sendMsgInterval);
                        }
                    }, 400);
                }
            }
        }
    }
}