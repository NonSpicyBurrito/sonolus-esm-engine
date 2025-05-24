import { EngineArchetypeDataName } from '@sonolus/core'

import { archetypes } from '..'
import { SFX } from '../../../../../../shared/src/engine/data/note'
import {
    getScaledTime,
    TimeScaleSegment,
} from '../../../../../../shared/src/engine/data/timeScaleSegment'
import { options } from '../../../configuration/options'
import { getHeadImport, getScaledTimeAt } from '../timeScale/TimeScaleGroup'

export abstract class Note extends Archetype {
    import = this.defineImport({
        group: { name: 'group', type: Number },
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        lane: { name: 'lane', type: Number },
        sfx: { name: 'sfx', type: DataType<SFX> },
        holdSfx: { name: 'holdSfx', type: DataType<SFX> },
    })

    sharedMemory = this.defineSharedMemory({
        targetTime: Number,
        spawnTime: Number,
        visualTime: Range,
    })

    preprocessOrder = 1
    preprocess() {
        const noteDuration = archetypes.TimeScaleGroup.sharedMemory.get(
            this.import.group,
        ).noteDuration

        this.sharedMemory.targetTime = bpmChanges.at(this.import.beat).time

        this.sharedMemory.visualTime.copyFrom(
            Range.l
                .mul(noteDuration)
                .add(getScaledTimeAt(this.import.group, this.sharedMemory.targetTime)),
        )

        this.sharedMemory.spawnTime = this.getSpawnTime(noteDuration)

        if (options.mirror) this.import.lane *= -1
    }

    getSpawnTime(noteDuration: number) {
        const headImport = getHeadImport(this.import.group)

        const headTime = bpmChanges.at(headImport.beat).time

        if (headImport.timeScale) {
            const minTime =
                this.sharedMemory.visualTime.max - noteDuration * Math.sign(headImport.timeScale)
            const delta = minTime / headImport.timeScale
            if (delta <= headTime) return delta
        } else if (this.sharedMemory.visualTime.max >= 0 && this.sharedMemory.visualTime.min <= 0) {
            return -2
        }

        const segment: TimeScaleSegment = {
            scaledTime: headTime * headImport.timeScale,
            time: headTime,
            timeScale: headImport.timeScale,
        }

        let next = headImport.next
        while (next) {
            const nextImport = archetypes.TimeScaleChange.import.get(next)

            const nextTime = bpmChanges.at(nextImport.beat).time
            const minTime =
                this.sharedMemory.visualTime.max - noteDuration * Math.sign(segment.timeScale)
            const delta = (minTime - segment.scaledTime) / segment.timeScale
            if (delta >= 0 && delta <= nextTime - segment.time) break

            segment.scaledTime = getScaledTime(nextTime, segment)
            segment.time = nextTime
            segment.timeScale = nextImport.timeScale
            next = nextImport.next
        }

        const minTime =
            this.sharedMemory.visualTime.max - noteDuration * Math.sign(segment.timeScale)
        const delta = (minTime - segment.scaledTime) / segment.timeScale
        return segment.time + delta
    }
}
