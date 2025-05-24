import { archetypes } from '..'
import {
    TimeScaleSegment,
    getScaledTime,
} from '../../../../../../shared/src/engine/data/timeScaleSegment'
import { options } from '../../../configuration/options'

export const getHeadImport = (group: number) =>
    archetypes.TimeScaleChange.import.get(archetypes.TimeScaleGroup.import.get(group).head)

export const getCurrentScaledTime = (group: number) => {
    const groupSharedMemory = archetypes.TimeScaleGroup.sharedMemory.get(group)

    if (time.now <= groupSharedMemory.head.time)
        return getScaledTime(time.now, groupSharedMemory.head)

    if (time.now >= groupSharedMemory.tail.time)
        return getScaledTime(time.now, groupSharedMemory.tail)

    return getScaledTime(time.now, groupSharedMemory.current)
}

export const getScaledTimeAt = (group: number, targetTime: number) => {
    const headImport = getHeadImport(group)

    const headTime = bpmChanges.at(headImport.beat).time
    if (targetTime <= headTime) return targetTime * headImport.timeScale

    const segment: TimeScaleSegment = {
        scaledTime: headTime * headImport.timeScale,
        time: headTime,
        timeScale: headImport.timeScale,
    }

    let next = headImport.next
    while (next) {
        const nextImport = archetypes.TimeScaleChange.import.get(next)

        const nextTime = bpmChanges.at(nextImport.beat).time
        if (targetTime <= nextTime) break

        segment.scaledTime = getScaledTime(nextTime, segment)
        segment.time = nextTime
        segment.timeScale = nextImport.timeScale
        next = nextImport.next
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

        const headImport = archetypes.TimeScaleChange.import.get(this.import.head)

        const head = this.sharedMemory.head

        head.time = bpmChanges.at(headImport.beat).time
        head.timeScale = headImport.timeScale
        head.scaledTime = head.time * head.timeScale
    }
}
