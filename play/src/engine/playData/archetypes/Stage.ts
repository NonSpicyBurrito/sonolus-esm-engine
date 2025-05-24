import { drawArc } from '../../../../../shared/src/engine/data/arc'
import { layout } from '../../../../../shared/src/engine/data/note'
import { options } from '../../configuration/options'
import { effect, sfxDistance } from '../effect'
import { layer, skin } from '../skin'
import { isNoEmpty } from './InputManager'

export class Stage extends Archetype {
    spawnOrder() {
        return 1
    }

    shouldSpawn() {
        return entityInfos.get(0).state === EntityState.Despawned
    }

    touchOrder = 1
    touch() {
        for (const touch of touches) {
            if (!touch.started) continue
            if (isNoEmpty(touch)) continue

            streams.set(0, time.now, 0)

            if (options.sfxEnabled) effect.clips.stage.play(sfxDistance)
            return
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
