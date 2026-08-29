import { Iterator } from './iterate'
import { lanes } from './lanes'
import { getScaledTime, TimeScaleSegment } from './timeScaleSegment'

export const note = {
    radius: 0.1125,
}

export const toT = (visualTime: Range, scaledTime: number) =>
    Math.remap(visualTime.min, visualTime.max, -1, 0, scaledTime)

export const approachPos = (t: number) => approach(t, 0.6444, 1.6294, 1.8924)

export const approachSize = (t: number) => approach(t, 0.601, 1.4536, 1.6396)

const approach = (t: number, a: number, b: number, c: number) => a * t ** 3 + b * t ** 2 + c * t + 1

export const layout = (lane: number, pos: number, size: number) =>
    new Rect({
        l: -1,
        r: 1,
        t: -1,
        b: 1,
    })
        .mul(size * note.radius)
        .add(position(lane, pos))

export const position = (lane: number, pos: number) => Vec.t.mul(pos).rotate(-lane * lanes.angle)

export const getNoteTargetScaledTime = (
    iterator: Iterator<TimeScaleSegment>,
    targetTime: number,
) => {
    if (!iterator.index) return targetTime

    if (targetTime < iterator.segment.time) return targetTime * iterator.segment.timeScale

    while (iterator.next) {
        if (targetTime < iterator.segment.nextTime) break

        iterator.advance()
    }

    return getScaledTime(targetTime, iterator.segment)
}

export const getNoteSpawnTime = (
    iterator: Iterator<TimeScaleSegment>,
    maxTime: number,
    noteDuration: number,
) => {
    if (!iterator.index) return maxTime - noteDuration

    if (iterator.segment.timeScale) {
        const minTime = maxTime - noteDuration * Math.sign(iterator.segment.timeScale)
        const delta = minTime / iterator.segment.timeScale

        if (delta < iterator.segment.time) return delta
    } else if (noteDuration > Math.abs(maxTime)) {
        return -2
    }

    while (iterator.next) {
        if (isInSkip(maxTime, noteDuration, iterator.segment)) return iterator.segment.time

        const time = getTime(maxTime, noteDuration, iterator.segment)
        if (time >= iterator.segment.time && time < iterator.segment.nextTime) return time

        iterator.advance()
    }

    return isInSkip(maxTime, noteDuration, iterator.segment)
        ? iterator.segment.time
        : getTime(maxTime, noteDuration, iterator.segment)
}

const isInSkip = (maxTime: number, noteDuration: number, segment: TimeScaleSegment) => {
    if (!segment.skip) return false
    const minTime = maxTime - noteDuration * Math.sign(segment.skip)
    const scaledTime = minTime - segment.scaledTime

    return scaledTime <= segment.skip
}

const getTime = (maxTime: number, noteDuration: number, segment: TimeScaleSegment) => {
    const minTime = maxTime - noteDuration * Math.sign(segment.timeScale)
    const scaledTime = minTime - segment.scaledTime - segment.skip

    if (!segment.ease || segment.timeScale === segment.nextTimeScale) {
        if (segment.timeScale) {
            return segment.time + scaledTime / segment.timeScale
        } else {
            return 999999
        }
    } else {
        const x1 = segment.time
        const x2 = segment.nextTime
        const y1 = segment.timeScale
        const y2 = segment.nextTimeScale
        const p = scaledTime

        return (
            (-Math.sqrt((2 * p * y1) / (x1 - x2) - (2 * p * y2) / (x1 - x2) + y1 ** 2) -
                (x1 * y1) / (x1 - x2) +
                (x1 * y2) / (x1 - x2) +
                y1) /
            (2 * (y2 / (2 * (x1 - x2)) - y1 / (2 * (x1 - x2))))
        )
    }
}
