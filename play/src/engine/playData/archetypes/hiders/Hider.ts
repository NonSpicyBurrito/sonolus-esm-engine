import { EngineArchetypeDataName } from '@sonolus/core'

import { HiderSegment } from '../../../../../../shared/src/engine/data/hiderSegment'

export abstract class Hider extends Archetype {
    import = this.defineImport({
        group: { name: 'group', type: Number },
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        opacity: { name: 'opacity', type: Number },
        ease: { name: 'ease', type: Boolean },
        next: { name: 'next', type: Number },
    })

    sharedMemory = this.defineSharedMemory(HiderSegment)

    preprocess() {
        this.sharedMemory.time = bpmChanges.at(this.import.beat).time
        this.sharedMemory.opacity = this.import.opacity
        this.sharedMemory.ease = !!this.import.next && this.import.ease
    }

    spawnOrder() {
        return 999999
    }

    shouldSpawn() {
        return false
    }
}
