import { archetypes } from '..'
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

        const iterator = iterateTimeScales(this.import.head)

        let scaledTime = iterator.segment.time * iterator.segment.timeScale
        iterator.segment.scaledTime = scaledTime

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

        this.noteHiderIndex = this.import.headNoteHider

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

        this.connectorHiderIndex = this.import.headConnectorHider

        const iterator = iterateConnectorHiders(this.import.headConnectorHider)

        while (iterator.next) {
            iterator.segment.nextTime = iterator.nextSegment.time
            iterator.segment.nextOpacity = iterator.nextSegment.opacity

            iterator.advance()
        }
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
