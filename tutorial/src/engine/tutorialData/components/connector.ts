import { holdConnectorEndLayout } from '../../../../../shared/src/engine/data/holdConnector.js'
import { approachPos, approachSize, note, toT } from '../../../../../shared/src/engine/data/note.js'
import { segment } from '../segment.js'
import { layer, skin } from '../skin.js'

enum Mode {
    None,
    OverlayIn,
    OverlayMid,
    FallIn,
    Frozen,
}

let mode = tutorialMemory(DataType<Mode>)

const lr = (t: number) => {
    const size = approachSize(t) * note.radius
    const pos = approachPos(t)

    return [Vec.t.mul(pos).add(Vec.l.mul(size)), Vec.t.mul(pos).add(Vec.r.mul(size))]
}

export const connector = {
    update() {
        if (!mode) return

        if (mode === Mode.OverlayIn || mode === Mode.OverlayMid) {
            const a = 0.5 * Math.unlerpClamped(1, 0.75, segment.time)

            const l = -note.radius * 1.5
            const r = note.radius * 1.5

            const t = 0.25 - note.radius * 3
            const b = 0.25 + (mode === Mode.OverlayMid ? note.radius * 3 : 0)

            const layout = new Rect({ l, r, t, b })

            skin.sprites.holdConnector.draw(layout, [layer.connector], a)

            if (skin.sprites.holdConnectorEnd.exists && mode === Mode.OverlayIn) {
                skin.sprites.holdConnectorEnd.draw(
                    holdConnectorEndLayout(layout.rb, layout.lb),
                    [layer.connector],
                    a,
                )
            }
        } else {
            const tT = toT(new Range(0, 2), 0)
            const tB = toT(new Range(0, 2), mode === Mode.FallIn ? segment.time : 2)

            const [lT, rT] = lr(tT)
            const [lB, rB] = lr(tB)

            skin.sprites.holdConnector.draw(
                new Quad({
                    p1: lB,
                    p2: lT,
                    p3: rT,
                    p4: rB,
                }),
                [layer.connector],
                0.5,
            )

            if (skin.sprites.holdConnectorEnd.exists) {
                skin.sprites.holdConnectorEnd.draw(
                    holdConnectorEndLayout(lT, rT),
                    [layer.connector],
                    0.5,
                )
                skin.sprites.holdConnectorEnd.draw(
                    holdConnectorEndLayout(rB, lB),
                    [layer.connector],
                    0.5,
                )
            }
        }
    },

    showOverlayIn() {
        mode = Mode.OverlayIn
    },

    showOverlayMid() {
        mode = Mode.OverlayMid
    },

    showFallIn() {
        mode = Mode.FallIn
    },

    showFrozen() {
        mode = Mode.Frozen
    },

    clear() {
        mode = Mode.None
    },
}
