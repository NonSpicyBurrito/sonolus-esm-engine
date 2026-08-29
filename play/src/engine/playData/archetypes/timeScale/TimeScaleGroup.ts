import { archetypes } from '..'
import {
    preprocessHiders,
    preprocessTimeScales,
} from '../../../../../../shared/src/engine/data/group'
import { getOpacity } from '../../../../../../shared/src/engine/data/hiderSegment'
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

    timeScaleIndex = this.entityMemory(Number)
    noteHiderIndex = this.entityMemory(Number)
    connectorHiderIndex = this.entityMemory(Number)

    preprocessOrder = 1
    preprocess() {
        this.sharedMemory.noteDuration = 5 / (this.import.noteSpeed || options.noteSpeed)

        this.preprocessTimeScales()
        this.preprocessNoteHiders()
        this.preprocessConnectorHiders()
    }

    preprocessTimeScales() {
        if (!this.import.head) return

        this.timeScaleIndex = this.import.head

        preprocessTimeScales(iterateTimeScales(this.import.head))
    }

    preprocessNoteHiders() {
        if (!this.import.headNoteHider) {
            this.sharedMemory.noteOpacity = 1
            return
        }

        this.noteHiderIndex = this.import.headNoteHider

        preprocessHiders(iterateNoteHiders(this.import.headNoteHider))
    }

    preprocessConnectorHiders() {
        if (!this.import.headConnectorHider) {
            this.sharedMemory.connectorOpacity = 1
            return
        }

        this.connectorHiderIndex = this.import.headConnectorHider

        preprocessHiders(iterateConnectorHiders(this.import.headConnectorHider))
    }

    spawnOrder() {
        return 2
    }

    updateSequential() {
        this.updateScaledTime()
        this.updateNoteOpacity()
        this.updateConnectorOpacity()
    }

    updateScaledTime() {
        if (!this.import.head) {
            this.sharedMemory.scaledTime = time.now
            return
        }

        const iterator = iterateTimeScales(this.timeScaleIndex)

        while (iterator.next) {
            if (time.now < iterator.segment.nextTime) break

            iterator.advance()
        }

        this.timeScaleIndex = iterator.index
        this.sharedMemory.scaledTime = getScaledTime(time.now, iterator.segment)
    }

    updateNoteOpacity() {
        if (!this.noteHiderIndex) return

        const iterator = iterateNoteHiders(this.noteHiderIndex)

        while (iterator.next) {
            if (time.now < iterator.segment.nextTime) break

            iterator.advance()
        }

        this.noteHiderIndex = iterator.index
        this.sharedMemory.noteOpacity = getOpacity(time.now, iterator.segment)
    }

    updateConnectorOpacity() {
        if (!this.connectorHiderIndex) return

        const iterator = iterateConnectorHiders(this.connectorHiderIndex)

        while (iterator.next) {
            if (time.now < iterator.segment.nextTime) break

            iterator.advance()
        }

        this.connectorHiderIndex = iterator.index
        this.sharedMemory.connectorOpacity = getOpacity(time.now, iterator.segment)
    }
}
