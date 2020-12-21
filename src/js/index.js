const {
    ipcRenderer,
    shell
} = require("electron");
const $ = require("jquery");


$("#github").click(() => {
    shell.openExternal('https://github.com/Tortudereli')
})

$("#ttVersion").click(() => {
    shell.openExternal('https://github.com/Tortudereli/TortudereliTools')
})

alert("test");

try {
    var currentVersion = 1.5;
    var ttVersion = ipcRenderer.sendSync("getApi", "https://raw.githubusercontent.com/Tortudereli/TortudereliTools/main/status.json")['body'];
    var ttVersion = ttVersion['version'];

    if (ttVersion != currentVersion) {
        $("#ttVersion").css("display", "block");
        setInterval(() => {
            var r = Math.floor((Math.random() * 255) + 1);
            var g = Math.floor((Math.random() * 255) + 1);
            var b = Math.floor((Math.random() * 255) + 1);
            $("#ttVersion").css("color", `rgb(${r}, ${g}, ${b})`);
        }, 2000);
    } else {
        $("#ttVersion").css("display", "none");
    }


    var versionData = ipcRenderer.sendSync("getApi", "https://ddragon.leagueoflegends.com/api/versions.json")['body'];
    var version = versionData[0];
    versionData = null;

    var summonerData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner")['body'];
    var displayName = summonerData['displayName'];
    var profileIconId = summonerData['profileIconId'];
    var rerollPoints = summonerData['rerollPoints']['numberOfRolls'];
    var summonerId = summonerData['summonerId'];
    var summonerLevel = summonerData['summonerLevel'];
    var xpSinceLastLevel = summonerData['xpSinceLastLevel'];
    var xpUntilNextLevel = summonerData['xpUntilNextLevel'];
    summonerData = null;



    var backgroundIdData = ipcRenderer.sendSync("get", "/lol-summoner/v1/current-summoner/summoner-profile")['body'];
    var backgroundId = backgroundIdData['backgroundSkinId'];
    backgroundIdData = null;
    var backgroundChampId = String(backgroundId).substring(0, String(backgroundId).length - 3);

    switch (backgroundId) {
        default:
            var skinData = ipcRenderer.sendSync("get", `/lol-champions/v1/inventories/${summonerId}/champions/${backgroundChampId}/skins/${backgroundId}`)['body'];
            var backgroundImagePath = skinData['splashPath'];
            break;

        case 147002:
            var skinData = ipcRenderer.sendSync("get", `/lol-champions/v1/inventories/${summonerId}/champions/${backgroundChampId}/skins/147001`)['body'];
            var backgroundImagePath = skinData['questSkinInfo']['tiers'][1]['splashPath'];
            break;

        case 147003:
            var skinData = ipcRenderer.sendSync("get", `/lol-champions/v1/inventories/${summonerId}/champions/${backgroundChampId}/skins/147001`)['body'];
            var backgroundImagePath = skinData['questSkinInfo']['tiers'][2]['splashPath'];
            break;
    }

    if (typeof backgroundImagePath == 'undefined') {
        setTimeout(() => {
            location.reload();
        }, 1000);
    }

    skinData = null;
    $("#main").css({
        "background": `url(${ipcRenderer.sendSync("getImg", `${backgroundImagePath}`)['body']}`,
        "background-repeat": "no-repeat",
        "background-size": "100% 100vh"
    })



    $("#currentSummonerIcon").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`)
    $("#currentSummonerName").text(displayName);
    $("#currentSummonerLevel").text(summonerLevel + ". Seviye");
    $("#summonerIcon").attr('src', `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`)
    $("#summonerLevel").text(summonerLevel);
    $("#summonerName").text(displayName);
    $("#level").text(summonerLevel);
    $("#nextLevel").text(summonerLevel + 1);
    $("#target").text(xpSinceLastLevel + " / " + xpUntilNextLevel);
    document.documentElement.style.setProperty('--levelBar', `${(xpSinceLastLevel * 100) / xpUntilNextLevel}%`);
    $("#summonerPerksRerollText").text(rerollPoints);
    if (rerollPoints == 0) {
        $("#summonerPerksReroll").attr('src', 'images/profile/perks_reroll_disabled.png');
    } else {
        $("#summonerPerksReroll").attr('src', 'images/profile/perks_reroll.png');
    }


    var rankedData = ipcRenderer.sendSync("get", "/lol-ranked/v1/current-ranked-stats")['body'];
    var highDataDivision = rankedData['highestRankedEntry']['division'];
    var highDataLeaguePoints = rankedData['highestRankedEntry']['leaguePoints'];
    var highDataLosses = rankedData['highestRankedEntry']['losses'];
    var highDataQueueType = rankedData['highestRankedEntry']['queueType'];
    var highDataTier = rankedData['highestRankedEntry']['tier'];
    var highDataWins = rankedData['highestRankedEntry']['wins'];

    if (highDataQueueType == "RANKED_SOLO_5x5") {
        var leftDivision = rankedData['queueMap']['RANKED_FLEX_SR']['division'];
        var leftLeaguePoints = rankedData['queueMap']['RANKED_FLEX_SR']['leaguePoints'];
        var leftLosses = rankedData['queueMap']['RANKED_FLEX_SR']['losses'];
        var leftQueueType = rankedData['queueMap']['RANKED_FLEX_SR']['queueType'];
        var leftTier = rankedData['queueMap']['RANKED_FLEX_SR']['tier'];
        var leftWins = rankedData['queueMap']['RANKED_FLEX_SR']['wins'];
    } else if (highDataQueueType == "RANKED_FLEX_SR") {
        var leftDivision = rankedData['queueMap']['RANKED_SOLO_5x5']['division'];
        var leftLeaguePoints = rankedData['queueMap']['RANKED_SOLO_5x5']['leaguePoints'];
        var leftLosses = rankedData['queueMap']['RANKED_SOLO_5x5']['losses'];
        var leftQueueType = rankedData['queueMap']['RANKED_SOLO_5x5']['queueType'];
        var leftTier = rankedData['queueMap']['RANKED_SOLO_5x5']['tier'];
        var leftWins = rankedData['queueMap']['RANKED_SOLO_5x5']['wins'];
    } else if (highDataQueueType == "RANKED_TFT") {
        var leftDivision = rankedData['queueMap']['RANKED_SOLO_5x5']['division'];
        var leftLeaguePoints = rankedData['queueMap']['RANKED_SOLO_5x5']['leaguePoints'];
        var leftLosses = rankedData['queueMap']['RANKED_SOLO_5x5']['losses'];
        var leftQueueType = rankedData['queueMap']['RANKED_SOLO_5x5']['queueType'];
        var leftTier = rankedData['queueMap']['RANKED_SOLO_5x5']['tier'];
        var leftWins = rankedData['queueMap']['RANKED_SOLO_5x5']['wins'];
    }

    if (highDataQueueType == "RANKED_SOLO_5x5" && leftQueueType == "RANKED_FLEX_SR") {
        var rightDivision = rankedData['queueMap']['RANKED_TFT']['division'];
        var rightLeaguePoints = rankedData['queueMap']['RANKED_TFT']['leaguePoints'];
        var rightLosses = rankedData['queueMap']['RANKED_TFT']['losses'];
        var rightQueueType = rankedData['queueMap']['RANKED_TFT']['queueType'];
        var rightTier = rankedData['queueMap']['RANKED_TFT']['tier'];
        var rightWins = rankedData['queueMap']['RANKED_TFT']['wins'];
    } else if (highDataQueueType == "RANKED_FLEX_SR" && leftQueueType == "RANKED_SOLO_5x5") {
        var rightDivision = rankedData['queueMap']['RANKED_TFT']['division'];
        var rightLeaguePoints = rankedData['queueMap']['RANKED_TFT']['leaguePoints'];
        var rightLosses = rankedData['queueMap']['RANKED_TFT']['losses'];
        var rightQueueType = rankedData['queueMap']['RANKED_TFT']['queueType'];
        var rightTier = rankedData['queueMap']['RANKED_TFT']['tier'];
        var rightWins = rankedData['queueMap']['RANKED_TFT']['wins'];
    } else if (highDataQueueType == "RANKED_TFT" && leftQueueType == "RANKED_SOLO_5x5") {
        var rightDivision = rankedData['queueMap']['RANKED_FLEX_SR']['division'];
        var rightLeaguePoints = rankedData['queueMap']['RANKED_FLEX_SR']['leaguePoints'];
        var rightLosses = rankedData['queueMap']['RANKED_FLEX_SR']['losses'];
        var rightQueueType = rankedData['queueMap']['RANKED_FLEX_SR']['queueType'];
        var rightTier = rankedData['queueMap']['RANKED_FLEX_SR']['tier'];
        var rightWins = rankedData['queueMap']['RANKED_FLEX_SR']['wins'];
    }

    rankedData = null;
    if (highDataQueueType == "RANKED_SOLO_5x5") {
        highDataQueueType = "Dereceli Tek/Çift";
    } else if (highDataQueueType == "RANKED_FLEX_SR") {
        highDataQueueType = "Dereceli Esnek";
    } else if (highDataQueueType == "RANKED_TFT") {
        highDataQueueType = "Dereceli TFT";
    }
    if (leftQueueType == "RANKED_SOLO_5x5") {
        leftQueueType = "Dereceli Tek/Çift";
    } else if (leftQueueType == "RANKED_FLEX_SR") {
        leftQueueType = "Dereceli Esnek";
    } else if (leftQueueType == "RANKED_TFT") {
        leftQueueType = "Dereceli TFT";
    }
    if (rightQueueType == "RANKED_SOLO_5x5") {
        rightQueueType = "Dereceli Tek/Çift";
    } else if (rightQueueType == "RANKED_FLEX_SR") {
        rightQueueType = "Dereceli Esnek";
    } else if (rightQueueType == "RANKED_TFT") {
        rightQueueType = "Dereceli TFT";
    }

    $("#highEloName").text(highDataQueueType);
    $("#highEloLP").text(highDataTier + " " + highDataDivision + " / " + highDataLeaguePoints + " LP");
    $("#highEloImg").attr('src', `images/rankedEmb/Emblem_${highDataTier}.png`);
    $("#highEloImg").attr('data-bs-original-title', `${highDataWins} Zafer - ${highDataLosses} Bozgun`);

    $("#leftEloName").text(leftQueueType);
    $("#leftEloLP").text(leftTier + " " + leftDivision + " / " + leftLeaguePoints + " LP");
    $("#leftEloImg").attr('src', `images/rankedEmb/Emblem_${leftTier}.png`);
    $("#leftEloImg").attr('data-bs-original-title', `${leftWins} Zafer - ${leftLosses} Bozgun`);

    $("#rightEloName").text(rightQueueType);
    $("#rightEloLP").text(rightTier + " " + rightDivision + " / " + rightLeaguePoints + " LP");
    $("#rightEloImg").attr('src', `images/rankedEmb/Emblem_${rightTier}.png`);
    $("#rightEloImg").attr('data-bs-original-title', `${rightWins} Zafer - ${rightLosses} Bozgun`);



    var masteryData = ipcRenderer.sendSync("get", `/lol-collections/v1/inventories/${summonerId}/champion-mastery/top?limit=3`)['body'];
    var firstChampId = masteryData['masteries'][0]['championId'];
    var firstChampionLevel = masteryData['masteries'][0]['championLevel'];
    var firstChampionPoints = masteryData['masteries'][0]['championPoints'];

    var secondChampId = masteryData['masteries'][1]['championId'];
    var secondChampionLevel = masteryData['masteries'][1]['championLevel'];
    var secondChampionPoints = masteryData['masteries'][1]['championPoints'];

    var thirdChampId = masteryData['masteries'][2]['championId'];
    var thirdChampionLevel = masteryData['masteries'][2]['championLevel'];
    var thirdChampionPoints = masteryData['masteries'][2]['championPoints'];
    masteryData = null;

    $("#highChampImg").attr('src', `https://cdn.communitydragon.org/${version}/champion/${firstChampId}/square`)
    $("#highChampBanner").attr('src', `images/masteryBanner/banner-mastery-small-lvl${firstChampionLevel}.png`);
    $("#highChampPoint").text(firstChampionPoints.toLocaleString("tr-TR"));

    $("#secondChampImg").attr('src', `https://cdn.communitydragon.org/${version}/champion/${secondChampId}/square`)
    $("#secondChampBanner").attr('src', `images/masteryBanner/banner-mastery-small-lvl${secondChampionLevel}.png`);
    $("#secondChampPoint").text(secondChampionPoints.toLocaleString("tr-TR"));

    $("#thirdChampImg").attr('src', `https://cdn.communitydragon.org/${version}/champion/${thirdChampId}/square`)
    $("#thirdChampBanner").attr('src', `images/masteryBanner/banner-mastery-small-lvl${thirdChampionLevel}.png`);
    $("#thirdChampPoint").text(thirdChampionPoints.toLocaleString("tr-TR"));


    var honorData = ipcRenderer.sendSync("get", `/lol-honor-v2/v1/profile`)['body'];
    var checkpoint = honorData['checkpoint'];
    var honorLevel = honorData['honorLevel'];
    var rewardsLocked = honorData['rewardsLocked'];
    honorData = null;

    let honorImg;
    let honorLevelText;
    if (honorLevel == 0) {
        if (rewardsLocked == true) {
            honorImg = 'images/honor/emblem_0_locked.png';
        } else {
            honorImg = 'images/honor/emblem_0.png';
        }
    } else if (honorLevel == 1) {
        if (rewardsLocked == true) {
            honorImg = 'images/honor/emblem_1_locked.png';
        } else {
            honorImg = 'images/honor/emblem_1.png';
        }
    } else if (honorLevel == 5) {
        honorImg = 'images/honor/emblem_5.png';
        honorLevelText = '';
    } else if (honorImg == null) {
        if (checkpoint == 0) {
            honorLevelText = '';
        } else if (checkpoint == 1) {
            honorLevelText = '1. Dönüm Noktası';
        } else if (checkpoint == 2) {
            honorLevelText = '2. Dönüm Noktası';
        } else if (checkpoint == 3) {
            honorLevelText = '3. Dönüm Noktası';
        }

        honorImg = `images/honor/emblem_${honorLevel}-${checkpoint}.png`;
    } else {
        honorImg = 'images/honor/emblem_generic.png';
    }

    $("#honorInfoImg").attr('src', `${honorImg}`);
    $("#honorInfoLevel").text(`${honorLevel}. Seviye`);
    $("#honorInfoCheckpoint").text(`${honorLevelText}`);


    var chestData = ipcRenderer.sendSync("get", `/lol-collections/v1/inventories/chest-eligibility`)['body'];
    var earnableChests = chestData['earnableChests'];
    var nextChestRechargeTime = chestData['nextChestRechargeTime'];
    $("#summonerPerksChest").attr('data-bs-original-title', `Sonraki sandık hakkı ${new Date(nextChestRechargeTime).toLocaleString("tr-TR")}`);
    chestData = null;
    $("#summonerPerksChestText").text(`${earnableChests}`);
    if (earnableChests == 0) {
        $("#summonerPerksChest").attr('src', 'images/profile/perks_chest_disabled.png');
    } else {
        $("#summonerPerksChest").attr('src', 'images/profile/perks_chest.png');
    }


    var activeBoost = ipcRenderer.sendSync("get", "/lol-active-boosts/v1/active-boosts")['body'];
    if (activeBoost['xpBoostPerWinCount'] !== 0 || activeBoost['xpBoostEndDate'] !== "1970-01-01T00:00:00Z") {
        $("#summonerPerksBoost").attr('src', 'images/profile/perks_boost.png');
    } else {
        $("#summonerPerksBoost").attr('src', 'images/profile/perks_boost_disabled.png');
    }

    activeBoost = null;

    var wallet = ipcRenderer.sendSync("get", "/lol-store/v1/wallet")['body'];
    var summonerIp = wallet['ip']
    var summonerRP = wallet['rp']

    $("#summonerIpSpan").text(summonerIp);
    $("#summonerRPSpan").text(summonerRP);
    wallet = null;

} catch (error) {
    setTimeout(() => {
        location.reload();
    }, 1000);
}