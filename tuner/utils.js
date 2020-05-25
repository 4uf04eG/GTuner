let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const c0 = 16.352

let prevPitches = []

function pitchToNoteNumber(pitch) {
    return Math.round(12 * Math.log2(pitch / c0))
}

function noteNumberToNote(noteNumber) {
    const octave = Math.floor(noteNumber / 12)
    return notes[noteNumber % 12] + octave
}

function noteNumberToPitch(noteNumber) {
    return c0 * (2 ** (noteNumber / 12))
}

function pitchDifferenceInCents(from, to) {
    return Math.floor(1200 * Math.log2(from / to) * 0.5)
}

function movingAverage(pitch, windowSize = 5) {
    if (prevPitches.length < windowSize) {
        prevPitches.push(pitch)
        return 50 // Just a big number to skip visualisation
    }

    const average = prevPitches.reduce((p, c) => p + c, 0) / prevPitches.length;
    prevPitches.shift()
    return Math.round(average)
}