let waveLineCanvas;
let waveLineContext;
let pitchOffsetCanvas;
let pitchOffsetContext;

function initializeCanvas() {
    waveLineCanvas = document.getElementById("wave-line")
    waveLineContext = waveLineCanvas.getContext('2d')
    pitchOffsetCanvas = document.getElementById("pitch-offset")
    pitchOffsetContext = pitchOffsetCanvas.getContext('2d')

    drawWaveLine(new Float32Array(1024))
    drawRuler()
}

function drawWaveLine(buffer) {
    waveLineContext.clearRect(0, 0,
        waveLineCanvas.width, waveLineCanvas.height)
    waveLineContext.beginPath()

    for (let i = 0; i < buffer.length; i++) {
        const x = i
        const y = (0.5 + (buffer[i] * 4)) * waveLineCanvas.height

        if (i === 0) {
            waveLineContext.moveTo(x, y)
        } else {
            waveLineContext.lineTo(x, y)
        }
    }

    waveLineContext.strokeStyle = "#eb265a"
    waveLineContext.stroke()
}

function drawRuler() {
    let rulerCanvas = document.getElementById("ruler")
    let rulerContext = rulerCanvas.getContext('2d')

    const binGap = rulerCanvas.width / 10
    const binTopOffset = 10
    const binHeight = 20 + binTopOffset
    const binsNum = rulerCanvas.width / binGap

    // Base line
    rulerContext.beginPath()
    rulerContext.moveTo(binTopOffset, binHeight)
    rulerContext.lineTo(rulerCanvas.width, binHeight)

    for (let i = 1; i < binsNum; i++) {
        let pos = i * binGap + 3
        rulerContext.moveTo(pos, binTopOffset)
        rulerContext.lineTo(pos, binHeight)
    }

    rulerContext.strokeStyle = "#606060"
    rulerContext.stroke()

    // Middle division
    rulerContext.beginPath()
    rulerContext.moveTo(binsNum * binGap / 2 + 3, 0)
    rulerContext.lineTo(binsNum * binGap / 2 + 3, binHeight)
    rulerContext.strokeStyle = "#ffffff"
    rulerContext.stroke()

    let rulerValue = -40

    for (let i = 1; i < binsNum; i++) {
        let pos = i * binGap
        let text = rulerValue > 0 ? "+" + rulerValue: rulerValue

        rulerContext.strokeText(text, pos, binHeight + 15)
        rulerValue += 10
    }
}

function drawPitchDifference(difference) {
    let center = pitchOffsetCanvas.width / 2
    let position = center + (difference * 3.8)

    if (position < pitchOffsetCanvas.width) {
        pitchOffsetContext.clearRect(0, 0,
            pitchOffsetCanvas.width, pitchOffsetCanvas.height)
        pitchOffsetContext.beginPath()

        pitchOffsetContext.moveTo(position, 0)
        pitchOffsetContext.lineTo(position, 30)
        pitchOffsetContext.strokeStyle = "#eb265a"
        pitchOffsetContext.stroke()

        pitchOffsetContext.strokeText(difference, position + 3, 10)
    }
}