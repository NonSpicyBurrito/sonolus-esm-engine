import { noteDisplay } from '../../components/noteDisplay'

export const tapNoteFall = {
    enter() {
        noteDisplay.showFall('tap')
    },

    exit() {
        noteDisplay.clear()
    },
}
