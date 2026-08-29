import { HiderSegment } from './hiderSegment'
import { Iterator } from './iterate'
import { getScaledTime, TimeScaleSegment } from './timeScaleSegment'

export const preprocessTimeScales = (iterator: Iterator<TimeScaleSegment>) => {
    let scaledTime = iterator.segment.time * iterator.segment.timeScale
    iterator.segment.scaledTime = scaledTime

    while (iterator.next) {
        iterator.segment.nextTime = iterator.nextSegment.time
        iterator.segment.nextTimeScale = iterator.nextSegment.timeScale
        scaledTime = getScaledTime(iterator.segment.nextTime, iterator.segment)

        iterator.advance()

        iterator.segment.scaledTime = scaledTime
    }
}

export const preprocessHiders = (iterator: Iterator<HiderSegment>) => {
    while (iterator.next) {
        iterator.segment.nextTime = iterator.nextSegment.time
        iterator.segment.nextOpacity = iterator.nextSegment.opacity

        iterator.advance()
    }
}
