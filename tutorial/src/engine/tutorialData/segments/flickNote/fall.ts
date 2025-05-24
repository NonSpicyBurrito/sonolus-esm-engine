import { noteDisplay } from '../../components/noteDisplay'

export const flickNoteFall = {
    enter() {
        noteDisplay.showFall('flick')
    },

    exit() {
        noteDisplay.clear()
    },
}
