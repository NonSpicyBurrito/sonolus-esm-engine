import { EngineArchetypeDataName } from '@sonolus/core'

import { archetypes } from '..'
import { getScaledTime } from '../../../../../../shared/src/engine/data/timeScaleSegment.js'

export const getSpeedChangeBeat = (index: number) =>
    archetypes.TimeScaleChange.import.get(index).beat

export const getSpeedChangeTimeScale = (index: number) => {
    const imp = archetypes.TimeScaleChange.import.get(index)
    return imp.speed || (imp.timeScale ? imp.timeScale : 0)
}

export const getSpeedChangeEase = (index: number) => {
    const imp = archetypes.TimeScaleChange.import.get(index)
    return imp.ease || imp.interpolation || 0
}

export const getSpeedChangeNext = (index: number) =>
    archetypes.TimeScaleChange.import.get(index).next || 0


export class TimeScaleChange extends Archetype {
    import = this.defineImport({
        group: { name: 'group', type: Number },
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        timeScale: { name: EngineArchetypeDataName.TimeScale, type: Number },
        speed: { name: 'speed', type: Number },
        ease: { name: 'ease', type: Number },
        interpolation: { name: 'interpolation', type: Number },
        next: { name: 'next', type: Number },
    })

    time = this.entityMemory(Number)

    get speedValue() {
        return this.import.speed || (this.import.timeScale ? this.import.timeScale : 0)
    }

    get easeValue() {
        return this.import.ease || this.import.interpolation || 0
    }

    preprocess() {
        this.time = bpmChanges.at(this.import.beat).time
    }

    spawnOrder() {
        return 1000 + this.time
    }

    shouldSpawn() {
        return time.now >= this.time
    }

    updateSequential() {
        const segment = archetypes.TimeScaleGroup.sharedMemory.get(this.import.group || 0)

        segment.scaledTime = getScaledTime(this.time, segment)
        segment.time = this.time
        segment.timeScale = this.speedValue
        segment.ease = this.easeValue

        if (this.import.next) {
            const nextTimeScale = getSpeedChangeTimeScale(this.import.next)
            const nextBeat = getSpeedChangeBeat(this.import.next)
            segment.nextTime = bpmChanges.at(nextBeat).time
            segment.nextTimeScale = nextTimeScale
        } else {
            segment.nextTime = 0
            segment.nextTimeScale = this.speedValue
        }

        this.despawn = true
    }
}



