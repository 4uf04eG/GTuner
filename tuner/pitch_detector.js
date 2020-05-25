class PitchDetector {
    constructor(sr, smallC = 0.5, defaultC = 0.97, lowerC = 60) {
        this.sampleRate = sr

        this.smallCutoff = smallC      // Peak threshold for performance reasons
        this.defualtCutoff = defaultC  // Relative size of a peak
        this.lowerPitchCutoff = lowerC // Pitch threshold in Hz
    }

    // Algorithm is based on the paper "A smarter way to find pitch".
    // Link to publication: shorturl.at/mnpEQ
    detectPitch(buffer) {
        const nsdf = this.normalisedSquareDifference(buffer)
        const maxPos = this.peakPicking(nsdf)

        let highestAmplitude = Number.NEGATIVE_INFINITY
        let estimates = []

        for (let i = 0; i < maxPos.length; i++) {
            let tau = maxPos[i]
            highestAmplitude = Math.max(highestAmplitude, nsdf[tau])

            if (nsdf[tau] > this.smallCutoff) {
                let turningPos = this.parabolicInterpolation(nsdf, tau)
                estimates.push(turningPos)
                highestAmplitude = Math.max(highestAmplitude, turningPos.amplitude)
            }
        }

        if (estimates.length === 0) return -1

        const actualCutoff = this.defualtCutoff * highestAmplitude
        let period

        for (let i = 0; i < estimates.length; i++) {
            if (estimates[i].amplitude >= actualCutoff) {
                period = estimates[i].period
                break
            }
        }

        const frequency = this.sampleRate / period

        return frequency > this.lowerPitchCutoff ? frequency : -1
    }

    // Normalised Square Difference function formula:
    //
    //          2 * r'(t) (Auto Correlation Function)
    // n'(t) = ----------
    //           m'(t) (greatest possible magnitude of 2*ACF)
    normalisedSquareDifference(buffer) {
        let nsdf = []

        for (let tau = 0; tau < buffer.length; tau++) {
            let acf = 0.0
            let m = 0.0

            for (let i = 0; i < buffer.length - tau; i++) {
                acf += buffer[i] * buffer[i + tau]
                m += buffer[i] ** 2 + buffer[i + tau] ** 2
            }

            nsdf.push(2.0 * acf / m)
        }

        return nsdf
    }

    // Finds the highest value between each pair of positive zero crossings
    peakPicking(nsdf) {
        let pos = 0
        let curMaxPos = 0
        let maxPositions = []

        // Find the first negative zero crossing
        while (pos < (nsdf.length - 1) / 3 && nsdf[pos] > 0) pos++

        // Skipping values below zero
        while (pos < nsdf.length - 1 && nsdf[pos] <= 0.0) pos++

        if (pos === 0) pos = 1

        while (pos < nsdf.length - 1) {
            if (nsdf[pos] > nsdf[pos - 1] && nsdf[pos] >= nsdf[pos + 1]) {
                if (curMaxPos === 0) {
                    curMaxPos = pos // First maxima
                } else if (nsdf[pos] > nsdf[curMaxPos]) {
                    curMaxPos = pos // Higher maxima
                }
            }

            pos++

            // Looking for negative zero crossings
            if (pos < nsdf.length - 1 && nsdf[pos] <= 0) {
                if (curMaxPos > 0) {
                    maxPositions.push(curMaxPos)
                    curMaxPos = 0
                }

                while (pos < nsdf.length - 1 && nsdf[pos] <= 0.0) pos++
            }
        }

        if (curMaxPos > 0) maxPositions.push(curMaxPos)

        return maxPositions
    }

    parabolicInterpolation(nsdf, tau) {
        const nsdfa = nsdf[tau - 1];
        const nsdfb = nsdf[tau];
        const nsdfc = nsdf[tau + 1];

        const bValue = tau;
        const bottom = nsdfc + nsdfa - 2 * nsdfb;

        let period
        let amplitude

        if (bottom === 0.0) {
            period = bValue;
            amplitude = nsdfb;
        } else {
            const delta = nsdfa - nsdfc;
            period = bValue + delta / (2 * bottom);
            amplitude = nsdfb - delta * delta / (8 * bottom);
        }

        return {period: period, amplitude: amplitude}
    }
}
