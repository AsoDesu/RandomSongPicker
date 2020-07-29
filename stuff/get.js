var mapCode;
function getMap() {
    document.getElementById('loadingIcon').style = ""

    fetch('https://beatsaver.com/api/maps/latest/0').then(res => res.json()).then(data => {
        var latestKey = data.docs[0].key
        var latestNumber = convert(latestKey)
        var randomMapNumber = Math.floor(Math.random() * latestNumber);
        var randomMapKey = randomMapNumber.toString(16)
        mapCode = randomMapKey
        fetch('https://beatsaver.com/api/maps/detail/' + randomMapKey).then(res => res.json()).then(data => {
            // Difficulty Check
            if ($("#easyCheck").is(":checked") && !data.metadata.difficulties.easy) {
                console.log('Found map but wasnt easy')
                getMap()
                return
            }
            if ($("#normalCheck").is(":checked") && !data.metadata.difficulties.normal) {
                console.log('Found map but wasnt normal')
                getMap()
                return
            }
            if ($("#hardCheck").is(":checked") && !data.metadata.difficulties.hard) {
                console.log('Found map but wasnt hard')
                getMap()
                return
            }
            if ($("#expertCheck").is(":checked") && !data.metadata.difficulties.expert) {
                console.log('Found map but wasnt expert')
                getMap()
                return
            }
            if ($("#expertPlusCheck").is(":checked") && !data.metadata.difficulties.expertPlus) {
                console.log('Found map but wasnt expert+')
                getMap()
                return
            }

            console.log(data)
            showDisplay(randomMapKey)
            return
        }).catch(() => {
            console.log('Map Not Found')
            getMap()
        })
    })
}

function convert(hexString) {
    return parseInt(hexString, 16);
}

async function showDisplay(hexCode) {
    var mapData;
    await fetch('https://beatsaver.com/api/maps/detail/' + hexCode).then(res => res.json()).then(data => mapData = data)

    // Set Name, Mapper, and Author
    document.getElementById('songTitle').innerHTML = mapData.name
    // Set desc
    document.getElementById('description').innerHTML = mapData.description.replace(/(\r\n|\n|\r)/gm, "<br />");

    document.getElementById('songAuthor').innerHTML = mapData.metadata.songAuthorName
    document.getElementById('songMapper').innerHTML = 'Mapped by ' + mapData.metadata.levelAuthorName
    // Set Rating, Downloads, and key
    var rating = mapData.stats.upVotes - mapData.stats.downVotes
    document.getElementById('rating').innerHTML = rating + ' ⭐'
    document.getElementById('downloads').innerHTML = mapData.stats.downloads + ' 💾'
    document.getElementById('key').innerHTML = hexCode + ' 🔑'
    // Set date
    var dateUpladed = mapData.uploaded.split('T')[0].replace('-', '/').replace('-', '/')
    document.getElementById('date').innerHTML = dateUpladed + ' 🕔'
    document.getElementById('oneclickBtn').href = "beatsaver://" + hexCode
    document.getElementById('downloadBtn').href = "https://beatsaver.com/api/download/key/" + hexCode
    document.getElementById('linkBtn').href = "https://beatsaver.com/beatmap/" + hexCode

    // Reset difficulty labels
    document.getElementById('expertplus1').style = "display: none;"
    document.getElementById('expert1').style = "display: none;"
    document.getElementById('hard1').style = "display: none;"
    document.getElementById('normal1').style = "display: none;"
    document.getElementById('easy1').style = "display: none;"

    // Set difficulty labels
    var difficulties = mapData.metadata.difficulties
    if (difficulties.easy) {
        document.getElementById('easy1').style = "display: block;"
    }
    if (difficulties.normal) {
        document.getElementById('normal1').style = "display: block;"
    }
    if (difficulties.hard) {
        document.getElementById('hard1').style = "display: block;"
    }
    if (difficulties.expert) {
        document.getElementById('expert1').style = "display: block;"
    }
    if (difficulties.expertPlus) {
        document.getElementById('expertplus1').style = "display: block;"
    }

    // Reset Characteristics labels
    document.getElementById('standard1').style = "display: none;"
    document.getElementById('light1').style = "display: none;"
    document.getElementById('oneSaber1').style = "display: none;"
    document.getElementById('noArrow1').style = "display: none;"
    document.getElementById('3601').style = "display: none;"
    document.getElementById('901').style = "display: none;"
    document.getElementById('law1').style = "display: none;"

    // Set Characteristics Labels
    var characteristics = mapData.metadata.characteristics
    characteristics.forEach(item => {
        if (item.name == "Standard") {
            document.getElementById('standard1').style = "display: block;"
        }
        if (item.name == "Lightshow") {
            document.getElementById('light1').style = "display: block;"
        }
        if (item.name == "Lawless") {
            document.getElementById('law1').style = "display: block;"
        }
        if (item.name == "OneSaber") {
            document.getElementById('oneSaber1').style = "display: block;"
        }
        if (item.name == "NoArrows") {
            document.getElementById('noArrow1').style = "display: block;"
        }
        if (item.name == "360Degree") {
            document.getElementById('3601').style = "display: block;"
        }
        if (item.name == "90Degree") {
            document.getElementById('901').style = "display: block;"
        }
    });

    $('#songModal').modal('show')
    document.getElementById('loadingIcon').style = "display: none;"
}

function preview() {
    window.open(
        "https://skystudioapps.com/bs-viewer/?id=" + mapCode, "_blank");
}
