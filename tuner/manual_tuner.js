let audio;

function handleButtonClick(buttonId) {
    let fileName = "/static/mp3/" + buttonId.replace("btn-", "") + ".mp3"

    if (audio) {
        audio.pause()
        audio.removeEventListener('ended', repeat)
    }

    audio = new Audio(fileName)
    audio.addEventListener('ended', repeat, false)
    audio.play()
}

function repeat() {
    this.currentTime = 0;
    this.play();
}