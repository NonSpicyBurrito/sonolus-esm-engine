import { archetypes } from '..'
import { getOpacity } from '../../../../../../shared/src/engine/data/hiderSegment'
import { Hider } from './Hider'

export class NoteHider extends Hider {
    getHead() {
        return archetypes.TimeScaleGroup.import.get(this.import.group).headNoteHider
    }

    updateSequential() {
        archetypes.TimeScaleGroup.sharedMemory.get(this.import.group).noteOpacity = getOpacity(
            time.now,
            this.sharedMemory,
        )
    }
}
