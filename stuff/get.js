var mapCode;
function getMap() {
    fetch('https://beatsaver.com/api/maps/latest/0').then(res => res.json()).then(data => {
        var latestKey = data.docs[0].key
        var latestNumber = convert(latestKey)
        var randomMapNumber = Math.floor(Math.random() * latestNumber);
        var randomMapKey = randomMapNumber.toString(16)
        mapCode = randomMapKey
        fetch('https://beatsaver.com/api/maps/detail/' + randomMapKey).then(res => res.json()).then(data => {
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
    console.log(mapData)

    // Set Name, Desc, Mapper, and Author
    document.getElementById('songTitle').innerHTML = mapData.name
    document.getElementById('description').innerHTML = mapData.description
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

    var difficulties = mapData.metadata.difficulties
    if (difficulties.easy) {
        console.log('1')
        document.getElementById('easy1').style = "display: block;"
    }
    if (difficulties.normal) {
        console.log('2')
        document.getElementById('normal1').style = "display: block;"
    }
    if (difficulties.hard) {
        console.log('3')
        document.getElementById('hard1').style = "display: block;"
    }
    if (difficulties.expert) {
        console.log('4')
        document.getElementById('expert1').style = "display: block;"
    }
    if (difficulties.expertplus) {
        console.log('5')
        document.getElementById('expertplus1').style = "display: block;"
    }

    $('#songModal').modal('show')
}