import { archetypes } from '.'
import { drawArc } from '../../../../../shared/src/engine/data/arc'
import { approachPos, approachSize, toT } from '../../../../../shared/src/engine/data/note'
import { options } from '../../configuration/options'
import { layer, skin } from '../skin'
import { getCurrentScaledTime } from './timeScale/TimeScaleGroup'

export class SimLine extends Archetype {
    import = this.defineImport({
        l: { name: 'l', type: Number },
        r: { name: 'r', type: Number },
    })

    initialized = this.entityMemory(Boolean)

    group = this.entityMemory(Number)
    lane = this.entityMemory(Range)
    visualTime = this.entityMemory(Range)

    spawnTime(): number {
        if (!options.simLineEnabled) return 0

        return this.lSharedMemory.spawnTime
    }

    despawnTime(): number {
        if (!options.simLineEnabled) return 0

        return Math.min(
            this.lSharedMemory.targetTime,
            this.lSingleSharedMemory.despawnTime,
            this.rSingleSharedMemory.despawnTime,
        )
    }

    initialize() {
        if (this.initialized) return
        this.initialized = true

        this.globalInitialize()
    }

    updateParallel() {
        const t = toT(this.visualTime, getCurrentScaledTime(this.group))
        if (t < -1) return

        drawArc(
            skin.sprites.simLine,
            this.lane.min,
            this.lane.max,
            approachPos(t),
            approachSize(t),
            [layer.simLine, -this.lSharedMemory.targetTime, -this.lane.min],
        )
    }

    get lImport() {
        return archetypes.TapNote.import.get(this.import.l)
    }

    get rImport() {
        return archetypes.TapNote.import.get(this.import.r)
    }

    get lSharedMemory() {
        return archetypes.TapNote.sharedMemory.get(this.import.l)
    }

    get rSharedMemory() {
        return archetypes.TapNote.sharedMemory.get(this.import.r)
    }

    get lSingleSharedMemory() {
        return archetypes.TapNote.singleSharedMemory.get(this.import.l)
    }

    get rSingleSharedMemory() {
        return archetypes.TapNote.singleSharedMemory.get(this.import.r)
    }

    get lInfo() {
        return entityInfos.get(this.import.l)
    }

    get rInfo() {
        return entityInfos.get(this.import.r)
    }

    globalInitialize() {
        this.group = this.lImport.group

        this.lane.min = this.lImport.lane
        this.lane.max = this.rImport.lane
        if (this.lane.min > this.lane.max)
            [this.lane.min, this.lane.max] = [this.lane.max, this.lane.min]

        this.visualTime.copyFrom(this.lSharedMemory.visualTime)
    }
}
