import { archetypes } from '..'
import {
    preprocessHiders,
    preprocessTimeScales,
} from '../../../../../../shared/src/engine/data/group'
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
        if (!this.import.head) return

        preprocessTimeScales(iterateTimeScales(this.import.head))
    }

    preprocessNoteHiders() {
        if (!this.import.headNoteHider) {
            this.sharedMemory.noteOpacity = 1
            return
        }

        preprocessHiders(iterateNoteHiders(this.import.headNoteHider))
    }

    preprocessConnectorHiders() {
        if (!this.import.headConnectorHider) {
            this.sharedMemory.connectorOpacity = 1
            return
        }

        preprocessHiders(iterateConnectorHiders(this.import.headConnectorHider))
    }

    spawnTime() {
        return this.import.head ? 0 : -999999
    }

    despawnTime() {
        return this.import.head ? 0 : 999999
    }

    updateSequential() {
        this.sharedMemory.scaledTime = time.now
    }
}
