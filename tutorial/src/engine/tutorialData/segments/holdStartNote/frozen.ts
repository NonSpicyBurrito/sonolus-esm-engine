import { connector } from '../../components/connector'
import { noteDisplay } from '../../components/noteDisplay'
import { drawHand, instruction } from '../../instruction'
import { segment } from '../../segment'

export const holdStartNoteFrozen = {
    enter() {
        noteDisplay.showFrozen('holdStart')
        connector.showFrozen()

        instruction.texts.tapAndHold.show()
    },

    update() {
        drawHand(
            Math.remapClamped(0.25, 0.75, Math.PI / 6, Math.PI / 3, segment.time % 1),
            0,
            Math.unlerpClamped(0, 0.25, segment.time % 1),
        )
    },

    exit() {
        noteDisplay.clear()
        connector.clear()

        instruction.texts.clear()
    },
}
