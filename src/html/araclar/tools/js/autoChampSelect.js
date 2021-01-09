const {
  ipcRenderer,
  shell
} = require("electron");
const $ = require("jquery");

const {
  getJSON,
  ready
} = require("jquery");

$("#github").click(() => {
  shell.openExternal("https://github.com/Tortudereli");
});

function updateTooltip() {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

var version = ipcRenderer.sendSync(
  "getApi",
  "https://ddragon.leagueoflegends.com/api/versions.json"
)["body"];
version = version[0];

var summonerData = ipcRenderer.sendSync(
  "get",
  "/lol-summoner/v1/current-summoner"
)["body"];
var displayName = summonerData["displayName"];
var profileIconId = summonerData["profileIconId"];
var summonerLevel = summonerData["summonerLevel"];
summonerData = null;

$("#currentSummonerIcon").attr(
  "src",
  `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`
);
$("#currentSummonerName").text(displayName);
$("#currentSummonerLevel").text(summonerLevel + ". Seviye");
version = null;

var getChampions = ipcRenderer.sendSync(
  "getApi",
  `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/tr_tr/v1/champion-summary.json`
)["body"];

getChampions.forEach((element) => {
  if (element["id"] !== -1) {
    $("#autoMatchingBanChamp").append(
      `<option value="${element["id"]}">${element["name"]}</option>`
    );
  }
});

var getPickableChampions = ipcRenderer.sendSync(
  "get",
  `/lol-champions/v1/owned-champions-minimal`
)["body"];

getPickableChampions.forEach((element) => {
  if (element["id"] != -1) {
    if (
      element["freeToPlay"] == true &&
      element["ownership"]["owned"] == false
    ) {
      $("#autoMatchingSelectChamp").append(
        `<option value="${element["id"]}">${element["name"]} *</option>`
      );
    } else {
      $("#autoMatchingSelectChamp").append(
        `<option value="${element["id"]}">${element["name"]}</option>`
      );
    }
  }
});

getChampions = null;
sortSelect(document.getElementById("autoMatchingBanChamp"));
sortSelect(document.getElementById("autoMatchingSelectChamp"));

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

var autoMatchingCheckBox;
$("#autoMatchingAutoAccept").change(() => {
  $("#submitAutoAccept").prop("checked", false);
  autoMatchingCheckBox = $("#autoMatchingAutoAccept").prop("checked");
});

var banChampId = 0;
$("#autoMatchingBanChamp").change(() => {
  $("#submitAutoAccept").prop("checked", false);
  banChampId = $("#autoMatchingBanChamp").val();
});

var selectChampId = 0;
$("#autoMatchingSelectChamp").change(() => {
  $("#submitAutoAccept").prop("checked", false);
  selectChampId = $("#autoMatchingSelectChamp").val();
});

var primaryRune1 = 0,
  primaryRune2 = 0,
  primaryRune3 = 0,
  primaryRune4 = 0,
  primaryStyleText,
  primaryStyleValue;
$("#autoMatchingPrimaryStyle").change(() => {
  $("#submitAutoAccept").prop("checked", false);
  primaryStyleText = $("#autoMatchingPrimaryStyle option:selected").text();
  primaryStyleValue = $("#autoMatchingPrimaryStyle option:selected").val();
  if (primaryStyleValue != 0) {
    var runeDataName;
    if (primaryStyleText == "İsabet") {
      runeDataName = "isabet";
    } else if (primaryStyleText == "Hakimiyet") {
      runeDataName = "hakimiyet";
    } else if (primaryStyleText == "Büyücülük") {
      runeDataName = "buyuculuk";
    } else if (primaryStyleText == "Azim") {
      runeDataName = "azim";
    } else if (primaryStyleText == "İlham") {
      runeDataName = "ilham";
    }
    $.getJSON(`js/json/${runeDataName}Runes.json`, function (data) {
      $("#primaryPerksArea img").remove();
      $("#primaryPerksArea br").remove();
      $("#autoMatchingSubStyle option").remove();
      $("#subPerksAreaRune img").remove();
      $("#subPerksAreaRune br").remove();
      $("#subPerksAreaStat").css("display", "none");
      $("#autoMatchingSubStyle").prop("disabled", false);
      $("#autoMatchingSubStyle").append(
        `<option id="defaultSubStyle" value="0">- İkincil Rün Seç -</option>`
      );
      $.getJSON("js/json/perkStyle.json", function (data1) {
        data1.forEach((element) => {
          if (primaryStyleText != element["name"]) {
            $("#autoMatchingSubStyle").append(
              `<option value="${element["value"]}">${element["name"]}</option>`
            );
          }
        });
      });

      var runeImgUrl, runeLongDesc;

      var perkData = ipcRenderer.sendSync("get", "/lol-perks/v1/perks")["body"];
      var i = 1;
      data.forEach((element) => {
        perkData.forEach((element1) => {
          if (element["value"] == element1["id"]) {
            runeImgUrl = element1["iconPath"];
            runeLongDesc = element1["longDesc"];

            if (
              primaryStyleText == "İsabet" ||
              primaryStyleText == "Hakimiyet"
            ) {
              if (i <= 4) {
                $("#primaryPerksArea").append(
                  `<img class="ilkSira" id="${element["value"]}" src="${
                    ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                  }" alt="${i}" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                );
                $(`#${element["value"]}`).click(() => {
                  $(".ilkSira").css("opacity", "0.3");
                  $(`#${element["value"]}`).css("opacity", "unset");
                  primaryRune1 = element["value"];
                });
                if (i == 4) {
                  $("#primaryPerksArea").append("<br>");
                }
              } else if (i <= 7 || i <= 10) {
                if (i <= 7) {
                  $("#primaryPerksArea").append(
                    `<img class="ikinciSira" id="${element["value"]}" src="${
                      ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                    }" alt="${i}" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                  );
                  $(`#${element["value"]}`).click(() => {
                    $(".ikinciSira").css("opacity", "0.3");
                    $(`#${element["value"]}`).css("opacity", "unset");
                    primaryRune2 = element["value"];
                  });
                } else if (i <= 10) {
                  $("#primaryPerksArea").append(
                    `<img class="ucuncuSira" id="${element["value"]}" src="${
                      ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                    }" alt="${i}" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                  );
                  $(`#${element["value"]}`).click(() => {
                    $(".ucuncuSira").css("opacity", "0.3");
                    $(`#${element["value"]}`).css("opacity", "unset");
                    primaryRune3 = element["value"];
                  });
                }
                if (i == 7 || i == 10) {
                  $("#primaryPerksArea").append("<br>");
                }
              } else if (i > 10) {
                $("#primaryPerksArea").append(
                  `<img class="sonSira" id="${element["value"]}" src="${
                    ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                  }" alt="${i}" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                );
                $(`#${element["value"]}`).click(() => {
                  $(".sonSira").css("opacity", "0.3");
                  $(`#${element["value"]}`).css("opacity", "unset");
                  primaryRune4 = element["value"];
                });
              }
            } else if (
              primaryStyleText == "Büyücülük" ||
              primaryStyleText == "Azim" ||
              primaryStyleText == "İlham"
            ) {
              if (i <= 3) {
                $("#primaryPerksArea").append(
                  `<img class="ilkSira" id="${element["value"]}" src="${
                    ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                  }" alt="${i}" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                );
                $(`#${element["value"]}`).click(() => {
                  $(".ilkSira").css("opacity", "0.3");
                  $(`#${element["value"]}`).css("opacity", "unset");
                  primaryRune1 = element["value"];
                });
                if (i == 3) {
                  $("#primaryPerksArea").append("<br>");
                }
              } else if (i <= 6 || i <= 9) {
                if (i <= 6) {
                  $("#primaryPerksArea").append(
                    `<img class="ikinciSira" id="${element["value"]}" src="${
                      ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                    }" alt="${i}" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                  );
                  $(`#${element["value"]}`).click(() => {
                    $(".ikinciSira").css("opacity", "0.3");
                    $(`#${element["value"]}`).css("opacity", "unset");
                    primaryRune2 = element["value"];
                  });
                } else if (i <= 9) {
                  $("#primaryPerksArea").append(
                    `<img class="ucuncuSira" id="${element["value"]}" src="${
                      ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                    }" alt="${i}" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                  );
                  $(`#${element["value"]}`).click(() => {
                    $(".ucuncuSira").css("opacity", "0.3");
                    $(`#${element["value"]}`).css("opacity", "unset");
                    primaryRune3 = element["value"];
                  });
                }
                if (i == 6 || i == 9) {
                  $("#primaryPerksArea").append("<br>");
                }
              } else if (i > 9) {
                $("#primaryPerksArea").append(
                  `<img class="sonSira" id="${element["value"]}" src="${
                    ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                  }" alt="${i}" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                );
                $(`#${element["value"]}`).click(() => {
                  $(".sonSira").css("opacity", "0.3");
                  $(`#${element["value"]}`).css("opacity", "unset");
                  primaryRune4 = element["value"];
                });
              }
            }
            i++;
          }
        });
      });
    });
  } else {
    $("#primaryPerksArea img").remove();
    $("#subPerksAreaRune img").remove();
    $("#subPerksAreaRune br").remove();
    $("#subPerksAreaStat").css("display", "none");
    $("#autoMatchingSubStyle").prop("disabled", true);
  }
  setTimeout(() => {
    updateTooltip();
  }, 1000);
});

var subRune1 = 0,
  subRune2 = 0,
  subStyleText,
  subStyleValue;
var subRuneKontrol1 = false;
var subRuneKontrol2 = false;
var subRuneKontrol3 = false;

$("#autoMatchingSubStyle").change(() => {
  $("#submitAutoAccept").prop("checked", false);
  subStyleText = $("#autoMatchingSubStyle option:selected").text();
  subStyleValue = $("#autoMatchingSubStyle option:selected").val();

  if (subStyleValue != 0) {
    var runeDataName;
    if (subStyleText == "İsabet") {
      runeDataName = "isabet";
    } else if (subStyleText == "Hakimiyet") {
      runeDataName = "hakimiyet";
    } else if (subStyleText == "Büyücülük") {
      runeDataName = "buyuculuk";
    } else if (subStyleText == "Azim") {
      runeDataName = "azim";
    } else if (subStyleText == "İlham") {
      runeDataName = "ilham";
    }
    $.getJSON(`js/json/${runeDataName}Runes.json`, function (data) {
      $("#subPerksAreaRune img").remove();
      $("#subPerksAreaRune br").remove();
      $("#subPerksAreaStat").css("display", "block");

      var runeImgUrl, runeLongDesc;

      var perkData = ipcRenderer.sendSync("get", "/lol-perks/v1/perks")["body"];
      var i = 1;
      data.forEach((element) => {
        perkData.forEach((element1) => {
          if (element["value"] == element1["id"]) {
            runeImgUrl = element1["iconPath"];
            runeLongDesc = element1["longDesc"];
            if (subStyleText == "İsabet" || subStyleText == "Hakimiyet") {
              if (
                data[0]["value"] != element["value"] &&
                data[1]["value"] != element["value"] &&
                data[2]["value"] != element["value"] &&
                data[3]["value"] != element["value"]
              ) {
                if (i <= 3) {
                  $("#subPerksAreaRune").append(
                    `<img class="subIlkSira" id="${element["value"]}" src="${
                      ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                    }" alt="" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                  );
                  $(`#${element["value"]}`).click(() => {
                    if (subRuneKontrol2 == false && subRuneKontrol3 == false) {
                      $(".subIlkSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol1 = true;
                      subRune1 = element["value"];
                    } else if (
                      subRuneKontrol2 == true &&
                      subRuneKontrol3 == false
                    ) {
                      $(".subIlkSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol1 = true;
                      subRune2 = element["value"];
                    } else if (
                      subRuneKontrol2 == false &&
                      subRuneKontrol3 == true
                    ) {
                      $(".subIlkSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol1 = true;
                      subRune2 = element["value"];
                    } else {
                      $(".subIlkSira").css("opacity", "0.3");
                      $(".subIkinciSira").css("opacity", "0.3");
                      $(".subSonSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRune1 = element["value"];
                      subRune2 = 0;
                      subRuneKontrol1 = true;
                      subRuneKontrol2 = false;
                      subRuneKontrol3 = false;
                    }
                  });
                } else if (i <= 6) {
                  $("#subPerksAreaRune").append(
                    `<img class="subIkinciSira" id="${element["value"]}" src="${
                      ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                    }" alt="" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                  );
                  $(`#${element["value"]}`).click(() => {
                    if (subRuneKontrol1 == false && subRuneKontrol3 == false) {
                      $(".subIkinciSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol2 = true;
                      subRune1 = element["value"];
                    } else if (
                      subRuneKontrol1 == true &&
                      subRuneKontrol3 == false
                    ) {
                      $(".subIkinciSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol2 = true;
                      subRune2 = element["value"];
                    } else if (
                      subRuneKontrol1 == false &&
                      subRuneKontrol3 == true
                    ) {
                      $(".subIkinciSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol2 = true;
                      subRune2 = element["value"];
                    } else {
                      $(".subIlkSira").css("opacity", "0.3");
                      $(".subIkinciSira").css("opacity", "0.3");
                      $(".subSonSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRune1 = element["value"];
                      subRune2 = 0;
                      subRuneKontrol1 = false;
                      subRuneKontrol2 = true;
                      subRuneKontrol3 = false;
                    }
                  });
                } else if (i > 6) {
                  $("#subPerksAreaRune").append(
                    `<img class="subSonSira" id="${element["value"]}" src="${
                      ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                    }" alt="" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                  );
                  $(`#${element["value"]}`).click(() => {
                    if (subRuneKontrol1 == false && subRuneKontrol2 == false) {
                      $(".subSonSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol3 = true;
                      subRune1 = element["value"];
                    } else if (
                      subRuneKontrol1 == true &&
                      subRuneKontrol2 == false
                    ) {
                      $(".subSonSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol3 = true;
                      subRune2 = element["value"];
                    } else if (
                      subRuneKontrol1 == false &&
                      subRuneKontrol2 == true
                    ) {
                      $(".subSonSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol3 = true;
                      subRune2 = element["value"];
                    } else {
                      $(".subIlkSira").css("opacity", "0.3");
                      $(".subIkinciSira").css("opacity", "0.3");
                      $(".subSonSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRune1 = element["value"];
                      subRune2 = 0;
                      subRuneKontrol1 = false;
                      subRuneKontrol2 = false;
                      subRuneKontrol3 = true;
                    }
                  });
                }
                if (i == 3 || i == 6) {
                  $("#subPerksAreaRune").append("<br>");
                }
                i++;
              }
            } else if (
              subStyleText == "Büyücülük" ||
              subStyleText == "Azim" ||
              subStyleText == "İlham"
            ) {
              if (
                data[0]["value"] != element["value"] &&
                data[1]["value"] != element["value"] &&
                data[2]["value"] != element["value"]
              ) {
                if (i <= 3) {
                  $("#subPerksAreaRune").append(
                    `<img class="subIlkSira" id="${element["value"]}" src="${
                      ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                    }" alt="" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                  );
                  $(`#${element["value"]}`).click(() => {
                    if (subRuneKontrol2 == false && subRuneKontrol3 == false) {
                      $(".subIlkSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol1 = true;
                      subRune1 = element["value"];
                    } else if (
                      subRuneKontrol2 == true &&
                      subRuneKontrol3 == false
                    ) {
                      $(".subIlkSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol1 = true;
                      subRune2 = element["value"];
                    } else if (
                      subRuneKontrol2 == false &&
                      subRuneKontrol3 == true
                    ) {
                      $(".subIlkSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol1 = true;
                      subRune2 = element["value"];
                    } else {
                      $(".subIlkSira").css("opacity", "0.3");
                      $(".subIkinciSira").css("opacity", "0.3");
                      $(".subSonSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRune1 = element["value"];
                      subRune2 = 0;
                      subRuneKontrol1 = true;
                      subRuneKontrol2 = false;
                      subRuneKontrol3 = false;
                    }
                  });
                } else if (i <= 6) {
                  $("#subPerksAreaRune").append(
                    `<img class="subIkinciSira" id="${element["value"]}" src="${
                      ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                    }" alt="" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                  );
                  $(`#${element["value"]}`).click(() => {
                    if (subRuneKontrol1 == false && subRuneKontrol3 == false) {
                      $(".subIkinciSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol2 = true;
                      subRune1 = element["value"];
                    } else if (
                      subRuneKontrol1 == true &&
                      subRuneKontrol3 == false
                    ) {
                      $(".subIkinciSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol2 = true;
                      subRune2 = element["value"];
                    } else if (
                      subRuneKontrol1 == false &&
                      subRuneKontrol3 == true
                    ) {
                      $(".subIkinciSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol2 = true;
                      subRune2 = element["value"];
                    } else {
                      $(".subIlkSira").css("opacity", "0.3");
                      $(".subIkinciSira").css("opacity", "0.3");
                      $(".subSonSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRune1 = element["value"];
                      subRune2 = 0;
                      subRuneKontrol1 = false;
                      subRuneKontrol2 = true;
                      subRuneKontrol3 = false;
                    }
                  });
                } else if (i > 6) {
                  $("#subPerksAreaRune").append(
                    `<img class="subSonSira" id="${element["value"]}" src="${
                      ipcRenderer.sendSync("getImg", runeImgUrl)["body"]
                    }" alt="" data-bs-delay="100" data-bs-placement="top" data-bs-toggle="tooltip" data-bs-html="true" data-bs-original-title="${runeLongDesc}">`
                  );
                  $(`#${element["value"]}`).click(() => {
                    if (subRuneKontrol1 == false && subRuneKontrol2 == false) {
                      $(".subSonSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol3 = true;
                      subRune1 = element["value"];
                    } else if (
                      subRuneKontrol1 == true &&
                      subRuneKontrol2 == false
                    ) {
                      $(".subSonSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol3 = true;
                      subRune2 = element["value"];
                    } else if (
                      subRuneKontrol1 == false &&
                      subRuneKontrol2 == true
                    ) {
                      $(".subSonSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRuneKontrol3 = true;
                      subRune2 = element["value"];
                    } else {
                      $(".subIlkSira").css("opacity", "0.3");
                      $(".subIkinciSira").css("opacity", "0.3");
                      $(".subSonSira").css("opacity", "0.3");
                      $(`#${element["value"]}`).css("opacity", "unset");
                      subRune1 = element["value"];
                      subRune2 = 0;
                      subRuneKontrol1 = false;
                      subRuneKontrol2 = false;
                      subRuneKontrol3 = true;
                    }
                  });
                }
                if (i == 3 || i == 6) {
                  $("#subPerksAreaRune").append("<br>");
                }
                i++;
              }
            }
          }
        });
      });
    });
  } else {
    $("#subPerksAreaRune img").remove();
    $("#subPerksAreaStat").css("display", "none");
  }
  setTimeout(() => {
    updateTooltip();
  }, 1000);
});

function getRuneData(val) {
  var perkData = ipcRenderer.sendSync("get", "/lol-perks/v1/perks")["body"];
  var runeData;
  perkData.forEach((element) => {
    if (element["id"] == val) {
      runeData = element;
    }
  });
  return runeData;
}

$("#subPerksAreaStat11").attr(
  "src",
  ipcRenderer.sendSync("getImg", getRuneData(5008)["iconPath"])["body"]
);
$("#subPerksAreaStat12").attr(
  "src",
  ipcRenderer.sendSync("getImg", getRuneData(5005)["iconPath"])["body"]
);
$("#subPerksAreaStat13").attr(
  "src",
  ipcRenderer.sendSync("getImg", getRuneData(5007)["iconPath"])["body"]
);
$("#subPerksAreaStat21").attr(
  "src",
  ipcRenderer.sendSync("getImg", getRuneData(5008)["iconPath"])["body"]
);
$("#subPerksAreaStat22").attr(
  "src",
  ipcRenderer.sendSync("getImg", getRuneData(5002)["iconPath"])["body"]
);
$("#subPerksAreaStat23").attr(
  "src",
  ipcRenderer.sendSync("getImg", getRuneData(5003)["iconPath"])["body"]
);
$("#subPerksAreaStat31").attr(
  "src",
  ipcRenderer.sendSync("getImg", getRuneData(5001)["iconPath"])["body"]
);
$("#subPerksAreaStat32").attr(
  "src",
  ipcRenderer.sendSync("getImg", getRuneData(5002)["iconPath"])["body"]
);
$("#subPerksAreaStat33").attr(
  "src",
  ipcRenderer.sendSync("getImg", getRuneData(5003)["iconPath"])["body"]
);

$("#subPerksAreaStat11").attr(
  "data-bs-original-title",
  getRuneData(5008)["longDesc"]
);
$("#subPerksAreaStat12").attr(
  "data-bs-original-title",
  getRuneData(5005)["longDesc"]
);
$("#subPerksAreaStat13").attr(
  "data-bs-original-title",
  getRuneData(5007)["longDesc"]
);
$("#subPerksAreaStat21").attr(
  "data-bs-original-title",
  getRuneData(5008)["longDesc"]
);
$("#subPerksAreaStat22").attr(
  "data-bs-original-title",
  getRuneData(5002)["longDesc"]
);
$("#subPerksAreaStat23").attr(
  "data-bs-original-title",
  getRuneData(5003)["longDesc"]
);
$("#subPerksAreaStat31").attr(
  "data-bs-original-title",
  getRuneData(5001)["longDesc"]
);
$("#subPerksAreaStat32").attr(
  "data-bs-original-title",
  getRuneData(5002)["longDesc"]
);
$("#subPerksAreaStat33").attr(
  "data-bs-original-title",
  getRuneData(5003)["longDesc"]
);

var statRune1 = 0,
  statRune2 = 0,
  statRune3 = 0;
$("#subPerksAreaStat11").click(() => {
  $(".statIlkSira").css("opacity", "0.3");
  $("#subPerksAreaStat11").css("opacity", "unset");
  $(".statIlkSira").css("border", "none");
  $("#subPerksAreaStat11").css("border", "1px solid white");
  statRune1 = 5008;
});
$("#subPerksAreaStat12").click(() => {
  $(".statIlkSira").css("opacity", "0.3");
  $("#subPerksAreaStat12").css("opacity", "unset");
  $(".statIlkSira").css("border", "none");
  $("#subPerksAreaStat12").css("border", "1px solid white");
  statRune1 = 5005;
});
$("#subPerksAreaStat13").click(() => {
  $(".statIlkSira").css("opacity", "0.3");
  $("#subPerksAreaStat13").css("opacity", "unset");
  $(".statIlkSira").css("border", "none");
  $("#subPerksAreaStat13").css("border", "1px solid white");
  statRune1 = 5007;
});

$("#subPerksAreaStat21").click(() => {
  $(".statIkinciSira").css("opacity", "0.3");
  $("#subPerksAreaStat21").css("opacity", "unset");
  $(".statIkinciSira").css("border", "none");
  $("#subPerksAreaStat21").css("border", "1px solid white");
  statRune2 = 5008;
});
$("#subPerksAreaStat22").click(() => {
  $(".statIkinciSira").css("opacity", "0.3");
  $("#subPerksAreaStat22").css("opacity", "unset");
  $(".statIkinciSira").css("border", "none");
  $("#subPerksAreaStat22").css("border", "1px solid white");
  statRune2 = 5002;
});
$("#subPerksAreaStat23").click(() => {
  $(".statIkinciSira").css("opacity", "0.3");
  $("#subPerksAreaStat23").css("opacity", "unset");
  $(".statIkinciSira").css("border", "none");
  $("#subPerksAreaStat23").css("border", "1px solid white");
  statRune2 = 5003;
});

$("#subPerksAreaStat31").click(() => {
  $(".statSonSira").css("opacity", "0.3");
  $("#subPerksAreaStat31").css("opacity", "unset");
  $(".statSonSira").css("border", "none");
  $("#subPerksAreaStat31").css("border", "1px solid white");
  statRune3 = 5001;
});
$("#subPerksAreaStat32").click(() => {
  $(".statSonSira").css("opacity", "0.3");
  $("#subPerksAreaStat32").css("opacity", "unset");
  $(".statSonSira").css("border", "none");
  $("#subPerksAreaStat32").css("border", "1px solid white");
  statRune3 = 5002;
});
$("#subPerksAreaStat33").click(() => {
  $(".statSonSira").css("opacity", "0.3");
  $("#subPerksAreaStat33").css("opacity", "unset");
  $(".statSonSira").css("border", "none");
  $("#subPerksAreaStat33").css("border", "1px solid white");
  statRune3 = 5003;
});

var runeStatus = false;
$("#runeSubmit").change(() => {
  $("#submitAutoAccept").prop("checked", false);
  if (
    primaryRune1 == 0 ||
    primaryRune2 == 0 ||
    primaryRune3 == 0 ||
    primaryRune4 == 0 ||
    subRune1 == 0 ||
    subRune2 == 0 ||
    statRune1 == 0 ||
    statRune2 == 0 ||
    statRune3 == 0
  ) {
    $("#runeSubmit").prop("checked", false);
    alert("Eksik Rün Seçimi!");
  }
  if ($("#runeSubmit").prop("checked") == true) {
    $("#autoMatchingPrimaryStyle").prop("disabled", true);
    $("#autoMatchingSubStyle").prop("disabled", true);
  } else {
    $("#autoMatchingPrimaryStyle").prop("disabled", false);
    $("#autoMatchingSubStyle").prop("disabled", false);
    runeStatus = false;
  }
});

var spell1 = 0,
  spell2 = 0,
  spellStatus = false;
var summonerSpellData = ipcRenderer.sendSync(
  "getApi",
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/tr_tr/v1/summoner-spells.json"
)["body"];
summonerSpellData.forEach((element) => {
  if (summonerLevel >= element["summonerLevel"]) {
    element["gameModes"].forEach((element1) => {
      if (element1 == "CLASSIC") {
        $("#autoMatchingSelectSpell1").append(
          `<option value="${element["id"]}">${element["name"]}</option>`
        );
      }
    });
  }
});

$("#autoMatchingSelectSpell1").change(() => {
  spell1 = $("#autoMatchingSelectSpell1 option:selected").val();
  if (spell1 != 0) {
    $("#autoMatchingSelectSpell2").prop("disabled", false);
  } else {
    $("#autoMatchingSelectSpell2").prop("disabled", true);
  }
  $("#autoMatchingSelectSpell2 option").remove();
  $("#autoMatchingSelectSpell2").append(
    `<option id="defaultSelectSpell2" value="0">- F büyüsü seç -</option>`
  );
  summonerSpellData.forEach((element) => {
    if (summonerLevel >= element["summonerLevel"]) {
      element["gameModes"].forEach((element1) => {
        if (
          element1 == "CLASSIC" &&
          $("#autoMatchingSelectSpell1 option:selected").text() !=
          element["name"]
        ) {
          $("#autoMatchingSelectSpell2").append(
            `<option value="${element["id"]}">${element["name"]}</option>`
          );
        }
      });
    }
  });
});

$("#autoMatchingSelectSpell2").change(() => {
  spell2 = $("#autoMatchingSelectSpell2 option:selected").val();
});

$("#spellSubmit").change(() => {
  $("#submitAutoAccept").prop("checked", false);
  if (spell1 == 0 || spell2 == 0) {
    $("#spellSubmit").prop("checked", false);
    alert("Eksik sihirdar büyüsü Seçimi!");
  }
  if ($("#spellSubmit").prop("checked") == false) {
    runeStatus = false;
  }
});

setInterval(() => {
  var submitAutoAccept = $("#submitAutoAccept").prop("checked");

  if (submitAutoAccept == true) {
    if (autoMatchingCheckBox == true) {
      try {
        var json = {
          url: "/lol-matchmaking/v1/ready-check/accept",
          json: "",
        };
        ipcRenderer.send("post", json);
      } catch (error) {}
    }

    if (
      ipcRenderer.sendSync("get", "/lol-champ-select/v1/session")["status"] ==
      200
    ) {
      if (banChampId != 0) {
        try {
          var oldI = 0;
          var oldJ = 0;
          var data = ipcRenderer.sendSync(
            "get",
            "/lol-champ-select/v1/session"
          )["body"];
          for (let i = 0; i < data["actions"].length; i++) {
            for (let j = 0; j < data["actions"][i].length; j++) {
              if (
                data["actions"][oldI][oldJ]["championId"] == banChampId &&
                data["actions"][oldI][oldJ]["type"] == "ban"
              ) {
                break;
              } else {
                if (data["actions"][i][j]["type"] == "ban") {
                  var json = {
                    url: `/lol-champ-select/v1/session/actions/${data["actions"][i][j]["id"]}`,
                    json: {
                      championId: banChampId,
                      completed: true,
                    },
                  };
                  ipcRenderer.send("patch", json);
                }
              }
              oldJ = j;
            }
            oldI = i;
          }
        } catch (error) {}
      }

      if (selectChampId != 0) {
        try {
          var oldI = 0;
          var oldJ = 0;
          var data = ipcRenderer.sendSync(
            "get",
            "/lol-champ-select/v1/session"
          )["body"];

          for (let i = 0; i < data["actions"].length; i++) {
            for (let j = 0; j < data["actions"][i].length; j++) {
              if (
                data["actions"][oldI][oldJ]["championId"] == selectChampId &&
                data["actions"][oldI][oldJ]["type"] == "pick"
              ) {
                break;
              } else {
                if (data["actions"][i][j]["type"] == "pick") {
                  var json = {
                    url: `/lol-champ-select/v1/session/actions/${data["actions"][i][j]["id"]}`,
                    json: {
                      championId: selectChampId,
                      completed: true,
                    },
                  };
                  ipcRenderer.send("patch", json);
                }
              }
              oldJ = j;
            }
            oldI = i;
          }
        } catch (error) {}
      }

      var runeSubmit = $("#runeSubmit").prop("checked");
      if (runeSubmit == true && runeStatus == false) {
        try {
          var currentPageId = ipcRenderer.sendSync(
            "get",
            "/lol-perks/v1/currentpage"
          )["body"];
          currentPageId = currentPageId["id"];
          ipcRenderer.send("delete", `/lol-perks/v1/pages/${currentPageId}`);

          var postData = {
            url: "/lol-perks/v1/pages",
            json: {
              current: true,
              name: "TortudereliTools",
              primaryStyleId: primaryStyleValue,
              selectedPerkIds: [
                primaryRune1,
                primaryRune2,
                primaryRune3,
                primaryRune4,
                subRune1,
                subRune2,
                statRune1,
                statRune2,
                statRune3,
              ],
              subStyleId: subStyleValue,
            },
          };
          var status = ipcRenderer.sendSync("post", postData)["status"];
          if (status == 200) {
            runeStatus = true;
          }
        } catch (error) {}
      }

      var spellSubmit = $("#spellSubmit").prop("checked");
      if (spellSubmit == true && spellStatus == false) {
        try {
          var patchData = {
            url: "/lol-champ-select/v1/session/my-selection",
            json: {
              spell1Id: spell1,
              spell2Id: spell2,
            },
          };
          var status = ipcRenderer.sendSync("patch", patchData)["status"];
          if (status == 204) {
            runeStatus = true;
          }
        } catch (error) {}
      }
    }
  } else {
    runeStatus = false;
    spellStatus = false;
  }
}, 5000);

var confirmSound = new Audio("../../../sounds/sfx-gameselect-button-confirm-click.ogg");
var activeSound = new Audio("../../../sounds/sfx-ps-ui-nav-button-click.ogg");
$("#submitAutoAccept").change(() => {
  if ($("#submitAutoAccept").prop("checked") == true) {
    confirmSound.pause();
    confirmSound.currentTime = 0;
    confirmSound.play();
  }
})

$("#spellSubmit").change(() => {
  if ($("#spellSubmit").prop("checked") == true) {
    activeSound.pause();
    activeSound.currentTime = 0;
    activeSound.play();
  }
})

$("#runeSubmit").change(() => {
  if ($("#runeSubmit").prop("checked") == true) {
    activeSound.pause();
    activeSound.currentTime = 0;
    activeSound.play();
  }
})

$("#autoMatchingAutoAccept").change(() => {
  if ($("#autoMatchingAutoAccept").prop("checked") == true) {
    activeSound.pause();
    activeSound.currentTime = 0;
    activeSound.play();
  }
})

$().ready(() => {
  $("#loadingArea").css({
    display: "none",
  });
});

$("img, a").attr("draggable", false);