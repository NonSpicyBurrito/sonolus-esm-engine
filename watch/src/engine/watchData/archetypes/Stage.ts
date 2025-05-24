import { drawArc } from '../../../../../shared/src/engine/data/arc'
import { layout } from '../../../../../shared/src/engine/data/note'
import { effect, sfxDistance } from '../effect'
import { layer, skin } from '../skin'

export class Stage extends Archetype {
    spawnTime() {
        return -999999
    }

    despawnTime() {
        return 999999
    }

    preprocess() {
        let t = -999999
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const nt = streams.getNextKey(0, t)
            if (nt === t) break

            t = nt
            effect.clips.stage.schedule(t, sfxDistance)
        }
    }

    updateParallel() {
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
    }
}
