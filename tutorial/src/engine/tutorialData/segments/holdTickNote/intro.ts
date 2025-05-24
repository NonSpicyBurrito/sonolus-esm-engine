import { connector } from '../../components/connector'
import { noteDisplay } from '../../components/noteDisplay'

export const holdTickNoteIntro = {
    enter() {
        noteDisplay.showOverlay('holdTick')
        connector.showOverlayMid()
    },

    exit() {
        noteDisplay.clear()
        connector.clear()
    },
}
