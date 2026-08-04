import { EngineArchetypeDataName } from '@sonolus/core'

import { archetypes } from '..'
import { SFX } from '../../../../../../shared/src/engine/data/note'
import {
    getScaledTime,
    TimeScaleSegment,
} from '../../../../../../shared/src/engine/data/timeScaleSegment'
import { options } from '../../../configuration/options'
import { getHeadIndexWatch, getScaledTimeAt } from '../timeScale/TimeScaleGroup.js'
import {
    getSpeedChangeBeatWatch,
    getSpeedChangeTimeScaleWatch,
    getSpeedChangeEaseWatch,
    getSpeedChangeNextWatch,
} from '../timeScale/TimeScaleChange.js'

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
        const group = this.import.group || 0
        const noteDuration = archetypes.TimeScaleGroup.sharedMemory.get(group).noteDuration || 1.5

        this.sharedMemory.targetTime = bpmChanges.at(this.import.beat).time

        this.sharedMemory.visualTime.copyFrom(
            Range.l
                .mul(noteDuration)
                .add(getScaledTimeAt(group, this.sharedMemory.targetTime)),
        )

        this.sharedMemory.spawnTime = this.getSpawnTime(noteDuration)

        if (options.mirror) this.import.lane *= -1
    }

    getSpawnTime(noteDuration: number) {
        const group = this.import.group || 0
        const headIndex = getHeadIndexWatch(group)
        const targetScaledTime = this.sharedMemory.visualTime.max - noteDuration

        if (!headIndex) {
            return this.sharedMemory.targetTime - noteDuration
        }

        const headBeat = getSpeedChangeBeatWatch(headIndex)
        const headTimeScale = getSpeedChangeTimeScaleWatch(headIndex)
        const headEase = getSpeedChangeEaseWatch(headIndex)

        const headTime = bpmChanges.at(headBeat).time
        if (targetScaledTime <= headTime * headTimeScale) {
            if (headTimeScale) return targetScaledTime / headTimeScale
            return headTime
        }

        let segment: TimeScaleSegment = {
            scaledTime: headTime * headTimeScale,
            time: headTime,
            timeScale: headTimeScale,
            ease: headEase,
            nextTime: 0,
            nextTimeScale: headTimeScale,
        }

        let next = getSpeedChangeNextWatch(headIndex)
        while (next) {
            const nextTimeScale = getSpeedChangeTimeScaleWatch(next)
            const nextBeat = getSpeedChangeBeatWatch(next)
            const nextEase = getSpeedChangeEaseWatch(next)
            const nextTime = bpmChanges.at(nextBeat).time

            segment.nextTime = nextTime
            segment.nextTimeScale = nextTimeScale

            const nextScaledTime = getScaledTime(nextTime, segment)
            if (targetScaledTime <= nextScaledTime) break

            segment.scaledTime = nextScaledTime
            segment.time = nextTime
            segment.timeScale = nextTimeScale
            segment.ease = nextEase
            next = getSpeedChangeNextWatch(next)
        }


        const deltaS = targetScaledTime - segment.scaledTime

        if (
            segment.ease === 1 &&
            segment.nextTime > segment.time &&
            segment.nextTimeScale !== segment.timeScale
        ) {
            const accel =
                (segment.nextTimeScale - segment.timeScale) / (segment.nextTime - segment.time)
            const disc = segment.timeScale * segment.timeScale + 2 * accel * deltaS
            if (disc >= 0 && Math.abs(accel) > 1e-6) {
                const deltaT = (-segment.timeScale + Math.sqrt(disc)) / accel
                return segment.time + deltaT
            }
        }

        if (segment.timeScale) {
            return segment.time + deltaS / segment.timeScale
        }
        return segment.time
    }
}

