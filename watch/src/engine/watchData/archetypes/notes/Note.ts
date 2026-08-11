import { EngineArchetypeDataName } from '@sonolus/core'

import { archetypes } from '..'
import {
    getNoteSpawnTime,
    getNoteTargetScaledTime,
} from '../../../../../../shared/src/engine/data/note'
import { SFX } from '../../../../../../shared/src/engine/data/sfx'
import { options } from '../../../configuration/options'
import { iterateTimeScales } from '../timeScale/iterate'

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

    preprocessOrder = 2
    preprocess() {
        const noteDuration = archetypes.TimeScaleGroup.sharedMemory.get(
            this.import.group,
        ).noteDuration

        this.sharedMemory.targetTime = bpmChanges.at(this.import.beat).time

        this.sharedMemory.visualTime.copyFrom(
            Range.l
                .mul(noteDuration)
                .add(getNoteTargetScaledTime(this.getIterator(), this.sharedMemory.targetTime)),
        )

        this.sharedMemory.spawnTime = getNoteSpawnTime(
            this.getIterator(),
            this.sharedMemory.visualTime.max,
            noteDuration,
        )

        if (options.mirror) this.import.lane *= -1
    }

    getIterator() {
        return iterateTimeScales(archetypes.TimeScaleGroup.import.get(this.import.group).head)
    }
}
