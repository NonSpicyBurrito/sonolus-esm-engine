import { EngineArchetypeDataName } from '@sonolus/core'

import { archetypes } from '..'
import { getScaledTimeAt } from './TimeScaleGroup'

export class TimeScaleChange extends Archetype {
    import = this.defineImport({
        group: { name: 'group', type: Number },
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        timeScale: { name: EngineArchetypeDataName.TimeScale, type: Number },
        next: { name: 'next', type: Number },
    })

    scaledTime = this.entityMemory(Number)
    time = this.entityMemory(Range)

    preprocess() {
        this.time.min = bpmChanges.at(this.import.beat).time
        this.scaledTime = getScaledTimeAt(this.import.group, this.time.min)

        if (this.import.next) {
            const nextImport = archetypes.TimeScaleChange.import.get(this.import.next)

            this.time.max = bpmChanges.at(nextImport.beat).time
        } else {
            const tail = archetypes.TimeScaleGroup.sharedMemory.get(this.import.group).tail

            tail.scaledTime = this.scaledTime
            tail.time = this.time.min
            tail.timeScale = this.import.timeScale

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
        const current = archetypes.TimeScaleGroup.sharedMemory.get(this.import.group).current

        current.scaledTime = this.scaledTime
        current.time = this.time.min
        current.timeScale = this.import.timeScale
    }
}
