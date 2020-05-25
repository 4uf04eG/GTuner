let pitchDetector;

let noteText;
let pitchText;

function requestMicrophoneAccess() {
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(handleSuccess).catch(function(_) {
        alert("Couldn't get access to a microphone")
    })
}

function handleSuccess(stream) {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(1024, 1, 1);
    processor.onaudioprocess = updatePitch
    source.connect(processor)

    noteText = document.getElementById("note")
    pitchText = document.getElementById("pitch")

    pitchDetector = new PitchDetector(context.sampleRate)
}

function updatePitch(e) {
    let buffer = e.inputBuffer.getChannelData(0)
    let pitch = pitchDetector.detectPitch(buffer)

    if (pitch !== -1) {
        noteText.textContent = pitchToNote(pitch)
        pitchText.textContent = noteDifferenceInCents(pitch, 329.63)
    }

    // drawWaveLine(buffer)

}