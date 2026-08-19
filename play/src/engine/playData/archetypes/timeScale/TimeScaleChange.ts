import { EngineArchetypeDataName } from '@sonolus/core'

import { TimeScaleSegment } from '../../../../../../shared/src/engine/data/timeScaleSegment'

export class TimeScaleChange extends Archetype {
    import = this.defineImport({
        group: { name: 'group', type: Number },
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        timeScale: { name: EngineArchetypeDataName.TimeScale, type: Number },
        ease: { name: 'ease', type: Boolean },
        next: { name: 'next', type: Number },
    })

    sharedMemory = this.defineSharedMemory(TimeScaleSegment)

    preprocess() {
        this.sharedMemory.time = bpmChanges.at(this.import.beat).time
        this.sharedMemory.timeScale = this.import.timeScale
        this.sharedMemory.ease = !!this.import.next && this.import.ease
    }

    spawnOrder() {
        return 999999
    }

    shouldSpawn() {
        return false
    }
}
