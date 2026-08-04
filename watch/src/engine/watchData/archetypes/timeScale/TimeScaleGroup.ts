import { archetypes } from '..'
import {
    TimeScaleSegment,
    getScaledTime,
} from '../../../../../../shared/src/engine/data/timeScaleSegment.js'
import { options } from '../../../configuration/options'
import {
    getSpeedChangeBeatWatch,
    getSpeedChangeTimeScaleWatch,
    getSpeedChangeEaseWatch,
    getSpeedChangeNextWatch,
} from './TimeScaleChange.js'

export const getHeadIndexWatch = (group: number): number => {
    const groupImport = archetypes.TimeScaleGroup.import.get(group || 0)
    return (groupImport && groupImport.head) || 0
}

export const getCurrentScaledTime = (group: number) => {
    const groupSharedMemory = archetypes.TimeScaleGroup.sharedMemory.get(group || 0)

    if (time.now <= groupSharedMemory.head.time)
        return getScaledTime(time.now, groupSharedMemory.head)

    if (time.now >= groupSharedMemory.tail.time)
        return getScaledTime(time.now, groupSharedMemory.tail)

    return getScaledTime(time.now, groupSharedMemory.current)
}

export const getScaledTimeAt = (group: number, targetTime: number) => {
    const headIndex = getHeadIndexWatch(group)
    if (!headIndex) return targetTime

    const headBeat = getSpeedChangeBeatWatch(headIndex)
    const headTimeScale = getSpeedChangeTimeScaleWatch(headIndex)
    const headEase = getSpeedChangeEaseWatch(headIndex)

    const headTime = bpmChanges.at(headBeat).time
    if (targetTime <= headTime) return targetTime * headTimeScale

    const segment: TimeScaleSegment = {
        scaledTime: headTime * headTimeScale,
        time: headTime,
        timeScale: headTimeScale,
        ease: headEase,
        nextTime: 0,
        nextTimeScale: headTimeScale,
    }

    let next = getSpeedChangeNextWatch(headIndex)
    while (next) {
        const nextTimeScale = getSpeedChangeTimeScaleWatch(next)
        const nextBeat = getSpeedChangeBeatWatch(next)
        const nextEase = getSpeedChangeEaseWatch(next)
        const nextTime = bpmChanges.at(nextBeat).time

        segment.nextTime = nextTime
        segment.nextTimeScale = nextTimeScale

        if (targetTime <= nextTime) break

        segment.scaledTime = getScaledTime(nextTime, segment)
        segment.time = nextTime
        segment.timeScale = nextTimeScale
        segment.ease = nextEase
        next = getSpeedChangeNextWatch(next)
    }

    return getScaledTime(targetTime, segment)
}

export class TimeScaleGroup extends Archetype {
    import = this.defineImport({
        head: { name: 'head', type: Number },
        noteSpeed: { name: 'noteSpeed', type: Number },
    })

    sharedMemory = this.defineSharedMemory({
        head: TimeScaleSegment,
        tail: TimeScaleSegment,
        current: TimeScaleSegment,
        noteDuration: Number,
    })

    preprocess() {
        this.sharedMemory.noteDuration = 5 / (this.import.noteSpeed || options.noteSpeed)

        const headIndex = this.import.head

        if (headIndex) {
            const headBeat = getSpeedChangeBeatWatch(headIndex)
            const headTimeScale = getSpeedChangeTimeScaleWatch(headIndex)
            const headEase = getSpeedChangeEaseWatch(headIndex)
            const headNext = getSpeedChangeNextWatch(headIndex)

            const head = this.sharedMemory.head

            head.time = bpmChanges.at(headBeat).time
            head.timeScale = headTimeScale
            head.scaledTime = head.time * head.timeScale
            head.ease = headEase
            if (headNext) {
                const nextBeat = getSpeedChangeBeatWatch(headNext)
                const nextTimeScale = getSpeedChangeTimeScaleWatch(headNext)
                head.nextTime = bpmChanges.at(nextBeat).time
                head.nextTimeScale = nextTimeScale
            }
        }
    }
}


