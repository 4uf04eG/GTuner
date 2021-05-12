let pitchDetector;

let noteText;
let pitchText;

function requestMicrophoneAccess() {
    initializeCanvas()
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(handleSuccess).catch(function (_) {
        let field = document.getElementById("error")
        field.style.display = "inline-block"
    })
}

function handleSuccess(stream) {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(1024, 1, 1);
    processor.onaudioprocess = updatePitch
    processor.connect(context.destination)
    source.connect(processor)

    noteText = document.getElementById("note")
    pitchText = document.getElementById("pitch")

    pitchDetector = new PitchDetector(context.sampleRate)
}

function updatePitch(e) {
    let buffer = e.inputBuffer.getChannelData(0)
    let pitch = pitchDetector.detectPitch(buffer)

    if (pitch !== -1) {
        let noteNumber = pitchToNoteNumber(pitch)
        let targetPitch = noteNumberToPitch(noteNumber)
        let diff = pitchDifferenceInCents(pitch, targetPitch)

        noteText.textContent = noteNumberToNote(noteNumber)
        pitchText.textContent = pitch.toFixed(3) + " Hz"
        drawPitchDifference(movingAverage(diff))
    }

    drawWaveLine(buffer)
}