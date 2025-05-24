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

    group = this.entityMemory(Number)
    lane = this.entityMemory(Range)
    targetTime = this.entityMemory(Number)
    spawnTime = this.entityMemory(Number)
    visualTime = this.entityMemory(Range)

    preprocessOrder = 2
    preprocess() {
        if (!options.simLineEnabled) return

        this.spawnTime = this.lSharedMemory.spawnTime
    }

    spawnOrder() {
        if (!options.simLineEnabled) return 999999

        return 1000 + this.spawnTime
    }

    shouldSpawn() {
        if (!options.simLineEnabled) return false

        return time.now >= this.spawnTime
    }

    initialize() {
        this.group = this.lImport.group

        this.lane.min = this.lImport.lane
        this.lane.max = this.rImport.lane
        if (this.lane.min > this.lane.max)
            [this.lane.min, this.lane.max] = [this.lane.max, this.lane.min]

        this.targetTime = this.lSharedMemory.targetTime

        this.visualTime.copyFrom(this.lSharedMemory.visualTime)
    }

    updateParallel() {
        if (
            time.now > this.targetTime ||
            this.lInfo.state === EntityState.Despawned ||
            this.rInfo.state === EntityState.Despawned
        ) {
            this.despawn = true
            return
        }

        const t = toT(this.visualTime, getCurrentScaledTime(this.group))
        if (t < -1) return

        drawArc(
            skin.sprites.simLine,
            this.lane.min,
            this.lane.max,
            approachPos(t),
            approachSize(t),
            [layer.simLine, -this.targetTime],
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

    get lInfo() {
        return entityInfos.get(this.import.l)
    }

    get rInfo() {
        return entityInfos.get(this.import.r)
    }
}
