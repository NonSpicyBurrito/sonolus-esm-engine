import { noteDisplay } from '../../components/noteDisplay'

export const tapNoteIntro = {
    enter() {
        noteDisplay.showOverlay('tap')
    },

    exit() {
        noteDisplay.clear()
    },
}
