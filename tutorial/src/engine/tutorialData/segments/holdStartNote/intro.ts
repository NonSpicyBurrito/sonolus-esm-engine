import { connector } from '../../components/connector'
import { noteDisplay } from '../../components/noteDisplay'

export const holdStartNoteIntro = {
    enter() {
        noteDisplay.showOverlay('holdStart')
        connector.showOverlayIn()
    },

    exit() {
        noteDisplay.clear()
        connector.clear()
    },
}
