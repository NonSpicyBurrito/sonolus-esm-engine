import { archetypes } from '..'
import {
    TimeScaleSegment,
    getScaledTime,
} from '../../../../../../shared/src/engine/data/timeScaleSegment.js'
import { options } from '../../../configuration/options'
import {
    getSpeedChangeBeat,
    getSpeedChangeTimeScale,
    getSpeedChangeEase,
    getSpeedChangeNext,
} from './TimeScaleChange.js'

export const getHeadIndex = (group: number): number => {
    const groupImport = archetypes.TimeScaleGroup.import.get(group || 0)
    return (groupImport && groupImport.head) || 0
}

export const getCurrentScaledTime = (group: number) =>
    getScaledTime(time.now, archetypes.TimeScaleGroup.sharedMemory.get(group || 0))

export const getScaledTimeAt = (group: number, targetTime: number) => {
    const headIndex = getHeadIndex(group)
    if (!headIndex) return targetTime

    const headBeat = getSpeedChangeBeat(headIndex)
    const headTimeScale = getSpeedChangeTimeScale(headIndex)
    const headEase = getSpeedChangeEase(headIndex)

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

    let next = getSpeedChangeNext(headIndex)
    while (next) {
        const nextTimeScale = getSpeedChangeTimeScale(next)
        const nextBeat = getSpeedChangeBeat(next)
        const nextEase = getSpeedChangeEase(next)
        const nextTime = bpmChanges.at(nextBeat).time

        segment.nextTime = nextTime
        segment.nextTimeScale = nextTimeScale

        if (targetTime <= nextTime) break

        segment.scaledTime = getScaledTime(nextTime, segment)
        segment.time = nextTime
        segment.timeScale = nextTimeScale
        segment.ease = nextEase
        next = getSpeedChangeNext(next)
    }

    return getScaledTime(targetTime, segment)
}

export class TimeScaleGroup extends Archetype {
    import = this.defineImport({
        head: { name: 'head', type: Number },
        noteSpeed: { name: 'noteSpeed', type: Number },
    })

    sharedMemory = this.defineSharedMemory({
        ...TimeScaleSegment,
        noteDuration: Number,
    })

    preprocess() {
        this.sharedMemory.noteDuration = 5 / (this.import.noteSpeed || options.noteSpeed)

        const headIndex = this.import.head
        if (headIndex) {
            const headBeat = getSpeedChangeBeat(headIndex)
            const headTimeScale = getSpeedChangeTimeScale(headIndex)
            const headEase = getSpeedChangeEase(headIndex)
            const headNext = getSpeedChangeNext(headIndex)

            this.sharedMemory.timeScale = headTimeScale
            this.sharedMemory.ease = headEase
            this.sharedMemory.time = bpmChanges.at(headBeat).time
            this.sharedMemory.scaledTime = this.sharedMemory.time * headTimeScale
            if (headNext) {
                const nextBeat = getSpeedChangeBeat(headNext)
                const nextTimeScale = getSpeedChangeTimeScale(headNext)
                this.sharedMemory.nextTime = bpmChanges.at(nextBeat).time
                this.sharedMemory.nextTimeScale = nextTimeScale
            }
        }
    }

    spawnOrder() {
        return 999999
    }
}


