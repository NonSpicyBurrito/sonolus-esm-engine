import { connector } from '../../components/connector'
import { noteDisplay } from '../../components/noteDisplay'
import { drawHand, instruction } from '../../instruction'

export const holdTickNoteFrozen = {
    enter() {
        noteDisplay.showFrozen('holdTick')
        connector.showFrozen()

        instruction.texts.hold.show()
    },

    update() {
        drawHand(Math.PI / 3, 0, 1)
    },

    exit() {
        noteDisplay.clear()
        connector.clear()

        instruction.texts.clear()
    },
}
