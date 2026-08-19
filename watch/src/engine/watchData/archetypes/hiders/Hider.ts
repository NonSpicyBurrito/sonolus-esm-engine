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

    spawnTime() {
        return this.getHead() === this.info.index ? -999999 : this.sharedMemory.time
    }

    despawnTime() {
        return this.import.next ? this.sharedMemory.nextTime : 999999
    }

    abstract getHead(): number
}
