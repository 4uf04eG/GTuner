let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const c0 = 16.352

function pitchToNote(pitch) {
    if (pitch === -1) return "-"

    const h = Math.round(12 * Math.log2(pitch / c0))
    const octave = Math.floor(h / 12)

    return notes[h % 12] + octave
}

function noteDifferenceInCents(from, to) {
    return Math.floor(1200 * Math.log2(from / to))
}