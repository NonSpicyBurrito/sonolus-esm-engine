import { connector } from '../../components/connector'
import { noteDisplay } from '../../components/noteDisplay'

export const holdStartNoteFall = {
    enter() {
        noteDisplay.showFall('holdStart')
        connector.showFallIn()
    },

    exit() {
        noteDisplay.clear()
        connector.clear()
    },
}
