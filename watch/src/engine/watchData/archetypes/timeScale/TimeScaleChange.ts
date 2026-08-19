import { EngineArchetypeDataName } from '@sonolus/core'

import { archetypes } from '..'
import {
    getScaledTime,
    TimeScaleSegment,
} from '../../../../../../shared/src/engine/data/timeScaleSegment'

export class TimeScaleChange extends Archetype {
    import = this.defineImport({
        group: { name: 'group', type: Number },
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        timeScale: { name: EngineArchetypeDataName.TimeScale, type: Number },
        next: { name: 'next', type: Number },
    })

    sharedMemory = this.defineSharedMemory(TimeScaleSegment)

    preprocess() {
        this.sharedMemory.time = bpmChanges.at(this.import.beat).time
        this.sharedMemory.timeScale = this.import.timeScale
    }

    spawnTime() {
        return this.getHead() === this.info.index ? -999999 : this.sharedMemory.time
    }

    despawnTime() {
        return this.import.next ? this.sharedMemory.nextTime : 999999
    }

    updateSequential() {
        archetypes.TimeScaleGroup.sharedMemory.get(this.import.group).scaledTime = getScaledTime(
            time.now,
            this.sharedMemory,
        )
    }

    getHead(): number {
        return archetypes.TimeScaleGroup.import.get(this.import.group).head
    }
}
