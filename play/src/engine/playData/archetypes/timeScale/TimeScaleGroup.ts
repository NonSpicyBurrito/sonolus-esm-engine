import { archetypes } from '..'
import { getScaledTime } from '../../../../../../shared/src/engine/data/timeScaleSegment'
import { options } from '../../../configuration/options'
import { iterateTimeScales } from './iterate'

export const getCurrentScaledTime = (group: number) =>
    archetypes.TimeScaleGroup.sharedMemory.get(group).scaledTime

export class TimeScaleGroup extends Archetype {
    import = this.defineImport({
        head: { name: 'head', type: Number },
        noteSpeed: { name: 'noteSpeed', type: Number },
    })

    sharedMemory = this.defineSharedMemory({
        noteDuration: Number,
        scaledTime: Number,
    })

    timeScaleIndex = this.entityMemory(Number)

    preprocessOrder = 1
    preprocess() {
        this.sharedMemory.noteDuration = 5 / (this.import.noteSpeed || options.noteSpeed)

        this.timeScaleIndex = this.import.head

        const iterator = iterateTimeScales(this.import.head)

        let scaledTime = 0
        while (iterator.next) {
            iterator.segment.nextTime = iterator.nextSegment.time
            scaledTime = getScaledTime(iterator.segment.nextTime, iterator.segment)

            iterator.advance()

            iterator.segment.scaledTime = scaledTime
        }
    }

    spawnOrder() {
        return 2
    }

    updateSequential() {
        const iterator = iterateTimeScales(this.timeScaleIndex)

        while (iterator.next) {
            if (time.now < iterator.segment.nextTime) break

            iterator.advance()
        }

        this.timeScaleIndex = iterator.index
        this.sharedMemory.scaledTime = getScaledTime(time.now, iterator.segment)
    }
}
