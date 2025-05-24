import { lanes } from './lanes'
import { note } from './note'

export const drawArc = (
    sprite: { draw(quad: Quad, z: [number, number?, number?, number?], a: number): void },
    min: number,
    max: number,
    pos: number,
    size: number,
    z: [number, number?, number?, number?],
) => {
    const l = -max * lanes.angle
    const r = -min * lanes.angle

    const count = Math.ceil(((r - l) * pos * 90) / Math.PI)

    for (let i = 0; i < count; i++) {
        const sMin = Math.lerp(l, r, i / count)
        const sMax = Math.lerp(l, r, (i + 1) / count)

        const pMin = Vec.t.rotate(sMin)
        const pMax = Vec.t.rotate(sMax)

        sprite.draw(
            new Quad({
                p1: pMin.mul(pos + note.radius * size),
                p2: pMin.mul(pos - note.radius * size),
                p3: pMax.mul(pos - note.radius * size),
                p4: pMax.mul(pos + note.radius * size),
            }),
            z,
            1,
        )
    }
}
