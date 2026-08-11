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

    preprocessOrder = 1
    preprocess() {
        this.sharedMemory.noteDuration = 5 / (this.import.noteSpeed || options.noteSpeed)

        const iterator = iterateTimeScales(this.import.head)

        let scaledTime = 0
        while (iterator.next) {
            iterator.segment.nextTime = iterator.nextSegment.time
            iterator.segment.nextTimeScale = iterator.nextSegment.timeScale
            scaledTime = getScaledTime(iterator.segment.nextTime, iterator.segment)

            iterator.advance()

            iterator.segment.scaledTime = scaledTime
        }
    }
}
