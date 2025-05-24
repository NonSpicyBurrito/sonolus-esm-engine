import { noteDisplay } from '../../components/noteDisplay'
import { drawHand, instruction } from '../../instruction'
import { segment } from '../../segment'

export const flickNoteFrozen = {
    enter() {
        noteDisplay.showFrozen('flick')

        instruction.texts.flick.show()
    },

    update() {
        drawHand(
            Math.PI / 3,
            Math.remapClamped(0.25, 0.75, 0, 0.5, segment.time % 1),
            Math.unlerpClamped(0.5, 0.25, Math.abs((segment.time % 1) - 0.5)),
        )
    },

    exit() {
        noteDisplay.clear()

        instruction.texts.clear()
    },
}
