import { noteDisplay } from '../../components/noteDisplay'

export const flickNoteIntro = {
    enter() {
        noteDisplay.showOverlay('flick')
    },

    exit() {
        noteDisplay.clear()
    },
}
