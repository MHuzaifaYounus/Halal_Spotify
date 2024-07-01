let currentsong = new Audio()
// change duration format 
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    // Calculate minutes and seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds with leading zeros if necessary
    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    var formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Return formatted time as a string
    return formattedMinutes + ':' + formattedSeconds;
}

// getting songs into an array named "songs" 
async function getsongs() {
    let a = await fetch("/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }

    return songs
}

// get images of songs from dir 
async function getsongimages() {
    let a = await fetch("/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let song_images = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".jpg") || element.href.endsWith(".png")) {
            song_images.push(element.href)

        }

    }
    return song_images
}
function getPlaylist(playlistName, tagLine, playlistimg,) {
    let playlistbox = document.createElement("div")
    playlistbox.className = "playlist-box " + playlistName
    document.querySelector(".playlist-container").append(playlistbox)

    let song_img = document.createElement("div")
    song_img.className = "song-img"
    playlistbox.append(song_img)

    let playbutton = document.createElement("button")
    playbutton.className = "playbtn"
    song_img.append(playbutton)

    let buttonimg = document.createElement("img")
    buttonimg.setAttribute("src", "svgs/play.svg")
    playbutton.append(buttonimg)

    let songimg = document.createElement("img")
    songimg.setAttribute("src", playlistimg)
    song_img.append(songimg)

    let songtext = document.createElement("div")
    songtext.className = "song-text"
    playlistbox.append(songtext)

    let songtitle = document.createElement("h1")
    songtitle.innerText = playlistName
    songtext.append(songtitle)

    let songartist = document.createElement("p")
    songartist.innerText = tagLine
    songtext.append(songartist)
}
getPlaylist("Sleep", "Keep calm and focus with ambient and post-rock music.", "playlist_pics/sleep.png")
getPlaylist("Hip-Hop", "Rap gods of Pakistan. Cover: Talha Anjum", "/playlist_pics/hiphop.png")
getPlaylist("K-POP", "Welcome to the BTS's universe. H appy BTS Festa A.R.M.Y 💜", "/playlist_pics/k-pop.png")
getPlaylist("Desi-POP", "Home to the Desi Pop Bops.", "/playlist_pics/desi-pop.png")

// playing song 
const playMusic = (track, pause = false) => {
    currentsong.src = "/songs/" + track
    if (!pause) {
        currentsong.play()
    }


}

// get songs details from the array "songs" 
async function main() {
    let songs = await getsongs()
    let song_images = await getsongimages()
    playMusic(songs[0], true)
    document.querySelector(".songatplaybar").firstElementChild.setAttribute("src", song_images[0])
    document.querySelector(".songatplaybartext").firstElementChild.innerText = songs[0].replaceAll("%20", " ").split(".mp3")[0].split("-")[0].split(".")[1]
    document.querySelector(".songatplaybartext").children[1].innerHTML = songs[0].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]
    // making cards 
    for (let index = 0; index < songs.length; index++) {

        let song_image_path = song_images[index].replaceAll("%20", " ")
        let songName = songs[index].replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
        let songPath = songs[index].replaceAll("%20", " ")
        let artistName = songs[index].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]

        getsongdetails(song_image_path, songName, artistName, songPath)
    }
    // adding click event on main logo 
    document.querySelector(".logo").addEventListener("click", e => {
        document.querySelector(".left-bar").style.left = 0
        document.querySelector(".left-bar").style.opacity = "100%"

    })
    // addEventListener on home logo 
    console.log(screen.width);
    if (screen.width <= 644) {
        document.querySelector(".home").addEventListener("click", e => {
            document.querySelector(".left-bar").style.left = "-30%"
            document.querySelector(".left-bar").style.opacity = "0"

        })
        document.querySelector("#search-btn").addEventListener("click",() => { 
            document.querySelector(".left-bar").style.left = "-30%"
            document.querySelector(".left-bar").style.opacity = "0"
         })
    }
    // play pause button click 
    document.querySelector("#song_btn").addEventListener("click", element => {

        if (currentsong.paused) {
            currentsong.play()
            document.querySelector("#song_btn").firstElementChild.src = "svgs/pause.svg"


        }
        else if (currentsong.play) {
            document.querySelector("#song_btn").firstElementChild.src = "svgs/play.svg"
            currentsong.pause()
        }
        else {

        }
    })
    // Add click on seekbar 
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        document.querySelector(".seekbar_overlay").style.width = percent + "%"
        currentsong.currentTime = (currentsong.duration * percent) / 100


    })
    // updating song duration 
    currentsong.addEventListener("timeupdate", () => {
        let index = songs.indexOf(currentsong.src.split("/songs/")[1])
        document.querySelector(".seekbar-box").children[0].innerHTML = formatTime(currentsong.currentTime)
        document.querySelector(".seekbar-box").children[2].innerHTML = formatTime(currentsong.duration)
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
        document.querySelector(".seekbar_overlay").style.width = (currentsong.currentTime / currentsong.duration) * 100 + "%"
        // AUTOPLAY SONGS WHEN CURRENT SONG IS END 
        if (currentsong.currentTime == currentsong.duration) {
            // IF THE CURRENT SONG IS LAST SONG THEN AGAIN PLAY FIRST SONG 
            if (index == (songs.length - 1)) {
                playMusic(songs[0])
                document.querySelector(".songatplaybar").firstElementChild.setAttribute("src", song_images[0])
                document.querySelector(".songatplaybartext").firstElementChild.innerText = songs[0].replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
                document.querySelector(".songatplaybartext").children[1].innerHTML = songs[0].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]

            }
            //  PLAY NEXT SONG
            else {

                playMusic(songs[index + 1])
                document.querySelector(".songatplaybar").firstElementChild.setAttribute("src", song_images[index + 1])
                document.querySelector(".songatplaybartext").firstElementChild.innerText = songs[index + 1].replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
                document.querySelector(".songatplaybartext").children[1].innerHTML = songs[index + 1].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]
            }


        }


    })
    // add click event to previouse 
    document.querySelector(".previose-btn").addEventListener("click", e => {
        let index = songs.indexOf(currentsong.src.split("/songs/")[1])
        if (index > 0) {
            playMusic(songs[index - 1])
            document.querySelector(".songatplaybar").firstElementChild.setAttribute("src", song_images[index - 1])
            document.querySelector(".songatplaybartext").firstElementChild.innerText = songs[index - 1].replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
            document.querySelector(".songatplaybartext").children[1].innerHTML = songs[index - 1].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]
        }
    })
    // add click event to next
    document.querySelector(".next-btn").addEventListener("click", e => {
        let index = songs.indexOf(currentsong.src.split("/songs/")[1])

        if (index < (songs.length - 1)) {
            playMusic(songs[index + 1])
            document.querySelector(".songatplaybar").firstElementChild.setAttribute("src", song_images[index + 1])
            document.querySelector(".songatplaybartext").firstElementChild.innerText = songs[index + 1].replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
            document.querySelector(".songatplaybartext").children[1].innerHTML = songs[index + 1].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]
        }
    })

    // add an event to volume
    document.querySelector(".othertools").getElementsByTagName("input")[0].addEventListener("change", e => {
        console.log(e.target.value / 100);
        currentsong.volume = e.target.value / 100;
    })
}

// make cards from details aurgoments
async function getsongdetails(songimage, songname, artist, songpath, container = "default") {
    if (container === "default") {
        container = document.querySelector(".cont" + songname.split(".")[0])
    }
    else {
        container = document.querySelector(".search-cont")

    }
    let song = document.createElement("div")
    song.className = "song"
    container.append(song)
    song.addEventListener("click", element => {
        playMusic(songpath.trim())
        document.querySelector(".songatplaybar").firstElementChild.setAttribute("src", songimage)
        document.querySelector(".songatplaybartext").firstElementChild.innerText = songname.split(".")[1]
        document.querySelector(".songatplaybartext").children[1].innerHTML = artist
        document.querySelector("#song_btn").firstElementChild.src = "svgs/pause.svg"



    })

    let song_img = document.createElement("div")
    song_img.className = "song-img"
    song.append(song_img)

    let playbutton = document.createElement("button")
    playbutton.className = "playbtn"
    song_img.append(playbutton)

    let buttonimg = document.createElement("img")
    buttonimg.setAttribute("src", "svgs/play.svg")
    playbutton.append(buttonimg)

    let songimg = document.createElement("img")
    songimg.setAttribute("src", songimage)
    song_img.append(songimg)

    let songtext = document.createElement("div")
    songtext.className = "song-text"
    song.append(songtext)

    let songtitle = document.createElement("h1")
    songtitle.innerText = songname.split(".")[1]
    songtext.append(songtitle)

    let songartist = document.createElement("p")
    songartist.innerText = artist
    songtext.append(songartist)

}
main()

async function serach() {
    let songs = await getsongs()
    let song_images = await getsongimages()
    let availableSongs = []
    let result = []
    for (let index = 0; index < songs.length; index++) {
        let songName = songs[index].replaceAll("%20", "").split(".mp3")[0].split("-")[0]
        availableSongs.push(songName)
    }
    document.getElementById("search-bar").onkeyup = function () {
        let resultForImg = []
        let input = document.getElementById("search-bar").value
        document.querySelector(".playlist-container").style.display = "none"
        document.querySelector(".search-cont").style.display = "flex"
        if (input.length) {
            result = songs.filter((keyword) => {
                return keyword.toLowerCase().includes(input.toLowerCase())
            })
            resultForImg = song_images.filter((keyword) => {
                return keyword.toLowerCase().includes(input.toLowerCase())
            })
            console.log(result);
            document.querySelector(".search-cont").innerHTML = " "
            for (let index = 0; index < result.length; index++) {
                let song_image_path = resultForImg[index].replaceAll("%20", " ")
                let songName = result[index].replaceAll("%20", " ").split(".mp3")[0].split("-")[0]
                let songPath = result[index].replaceAll("%20", " ")
                let artistName = result[index].replaceAll("%20", " ").split(".mp3")[0].split("-")[1]
                getsongdetails(song_image_path, songName, artistName, songPath, "search-cont")

            }

        }
        else if (input === "") {
            document.querySelector(".search-cont").style.display = "none"
            document.querySelector(".playlist-container").style.display = "flex"

        }


    }


}

serach()

let playlistBoxArray = document.querySelectorAll(".playlist-box")
for (let index = 0; index < playlistBoxArray.length; index++) {
    const element = playlistBoxArray[index];
    element.addEventListener("click", () => {
        console.log("click");
        document.querySelector(".playlist-container").style.display = "none"
        document.querySelector(".cont" + (index + 1)).style.display = "flex"

    })
}

let backbtns = document.querySelectorAll(".back")
for (let index = 0; index < backbtns.length; index++) {
    const e = backbtns[index];
    e.addEventListener("click", () => {
        console.log("back");
        document.querySelector(".playlist-container").style.display = "flex"
        document.querySelector(".cont" + (index + 1)).style.display = "none"

    })
}

document.querySelector("#search-btn").addEventListener("click", () => {
    console.log("search");
    document.querySelector(".searchbar").style.display = "flex"
})
document.querySelector("#searched").addEventListener("click", () => {
    document.querySelector(".searchbar").style.display = "none"
    document.getElementById("search-bar").value = ""

})
document.querySelector(".home").addEventListener("click",() => {
    document.querySelector(".playlist-container").style.display = "flex"
    document.querySelector(".search-cont").style.display = "none"
 })