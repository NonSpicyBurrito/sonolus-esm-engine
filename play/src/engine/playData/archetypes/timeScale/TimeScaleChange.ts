import { EngineArchetypeDataName } from '@sonolus/core'

import { archetypes } from '..'
import { getScaledTime } from '../../../../../../shared/src/engine/data/timeScaleSegment'

export class TimeScaleChange extends Archetype {
    import = this.defineImport({
        group: { name: 'group', type: Number },
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        timeScale: { name: EngineArchetypeDataName.TimeScale, type: Number },
        next: { name: 'next', type: Number },
    })

    time = this.entityMemory(Number)

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
        const segment = archetypes.TimeScaleGroup.sharedMemory.get(this.import.group)

        segment.scaledTime = getScaledTime(this.time, segment)
        segment.time = this.time
        segment.timeScale = this.import.timeScale

        this.despawn = true
    }
}
