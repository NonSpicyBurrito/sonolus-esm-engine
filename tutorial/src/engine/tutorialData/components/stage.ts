import { drawArc } from '../../../../../shared/src/engine/data/arc'
import { layout } from '../../../../../shared/src/engine/data/note'
import { layer, skin } from '../skin'

export const stage = {
    update() {
        if (skin.sprites.circle.exists) {
            skin.sprites.circle.draw(
                new Rect({
                    l: -1,
                    r: 1,
                    t: -1,
                    b: 1,
                }).mul(0.09),
                [layer.judgeLine],
                1,
            )
        }

        drawArc(skin.sprites.judgeLine, -4, 4, 1, 1, [layer.judgeLine])

        for (let i = 0; i < 9; i++) {
            skin.sprites.slot.draw(layout(i - 4, 1, 1), [layer.slot], 1)
        }
    },
}
