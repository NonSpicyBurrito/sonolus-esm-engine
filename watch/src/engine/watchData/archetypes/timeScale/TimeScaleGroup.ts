import { archetypes } from '..'
import { getScaledTime } from '../../../../../../shared/src/engine/data/timeScaleSegment'
import { options } from '../../../configuration/options'
import { iterateConnectorHiders, iterateNoteHiders } from '../hiders/iterate'
import { iterateTimeScales } from './iterate'

export const getCurrentScaledTime = (group: number) =>
    archetypes.TimeScaleGroup.sharedMemory.get(group).scaledTime

export const getCurrentNoteOpacity = (group: number) =>
    archetypes.TimeScaleGroup.sharedMemory.get(group).noteOpacity

export const getCurrentConnectorOpacity = (group: number) =>
    archetypes.TimeScaleGroup.sharedMemory.get(group).connectorOpacity

export class TimeScaleGroup extends Archetype {
    import = this.defineImport({
        head: { name: 'head', type: Number },
        noteSpeed: { name: 'noteSpeed', type: Number },
        headNoteHider: { name: 'headNoteHider', type: Number },
        headConnectorHider: { name: 'headConnectorHider', type: Number },
    })

    sharedMemory = this.defineSharedMemory({
        noteDuration: Number,
        scaledTime: Number,
        noteOpacity: Number,
        connectorOpacity: Number,
    })

    preprocessOrder = 1
    preprocess() {
        this.sharedMemory.noteDuration = 5 / (this.import.noteSpeed || options.noteSpeed)

        this.preprocessTimeScales()
        this.preprocessNoteHiders()
        this.preprocessConnectorHiders()
    }

    preprocessTimeScales() {
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

    preprocessNoteHiders() {
        if (!this.import.headNoteHider) {
            this.sharedMemory.noteOpacity = 1
            return
        }

        const iterator = iterateNoteHiders(this.import.headNoteHider)

        while (iterator.next) {
            iterator.segment.nextTime = iterator.nextSegment.time
            iterator.segment.nextOpacity = iterator.nextSegment.opacity

            iterator.advance()
        }
    }

    preprocessConnectorHiders() {
        if (!this.import.headConnectorHider) {
            this.sharedMemory.connectorOpacity = 1
            return
        }

        const iterator = iterateConnectorHiders(this.import.headConnectorHider)

        while (iterator.next) {
            iterator.segment.nextTime = iterator.nextSegment.time
            iterator.segment.nextOpacity = iterator.nextSegment.opacity

            iterator.advance()
        }
    }
}
