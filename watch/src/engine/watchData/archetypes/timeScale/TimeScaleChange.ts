import { EngineArchetypeDataName } from '@sonolus/core'

import { archetypes } from '..'
import { getScaledTimeAt } from './TimeScaleGroup.js'
import { SpeedChangeData } from '../../../../../../shared/src/engine/data/timeScaleSegment.js'

export const getSpeedChangeBeatWatch = (index: number) =>
    archetypes.TimeScaleChange.import.get(index).beat

export const getSpeedChangeTimeScaleWatch = (index: number) => {
    const imp = archetypes.TimeScaleChange.import.get(index)
    return imp.speed || (imp.timeScale ? imp.timeScale : 0)
}

export const getSpeedChangeEaseWatch = (index: number) => {
    const imp = archetypes.TimeScaleChange.import.get(index)
    return imp.ease || imp.interpolation || 0
}

export const getSpeedChangeNextWatch = (index: number) =>
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

    scaledTime = this.entityMemory(Number)
    time = this.entityMemory(Range)

    get speedValue() {
        return this.import.speed || (this.import.timeScale ? this.import.timeScale : 0)
    }

    get easeValue() {
        return this.import.ease || this.import.interpolation || 0
    }

    preprocess() {
        const group = this.import.group || 0
        this.time.min = bpmChanges.at(this.import.beat).time
        this.scaledTime = getScaledTimeAt(group, this.time.min)

        if (this.import.next) {
            const nextBeat = getSpeedChangeBeatWatch(this.import.next)
            this.time.max = bpmChanges.at(nextBeat).time
        } else {
            const tail = archetypes.TimeScaleGroup.sharedMemory.get(group).tail

            tail.scaledTime = this.scaledTime
            tail.time = this.time.min
            tail.timeScale = this.speedValue
            tail.ease = this.easeValue
            tail.nextTime = 0
            tail.nextTimeScale = this.speedValue

            this.time.max = this.time.min
        }
    }

    spawnTime() {
        return this.time.min
    }

    despawnTime() {
        return this.time.max
    }

    updateSequential() {
        const group = this.import.group || 0
        const current = archetypes.TimeScaleGroup.sharedMemory.get(group).current

        current.scaledTime = this.scaledTime
        current.time = this.time.min
        current.timeScale = this.speedValue
        current.ease = this.easeValue

        if (this.import.next) {
            const nextBeat = getSpeedChangeBeatWatch(this.import.next)
            const nextTimeScale = getSpeedChangeTimeScaleWatch(this.import.next)
            current.nextTime = bpmChanges.at(nextBeat).time
            current.nextTimeScale = nextTimeScale
        } else {
            current.nextTime = 0
            current.nextTimeScale = this.speedValue
        }
    }
}

