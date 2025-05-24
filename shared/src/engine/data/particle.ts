import { lanes } from './lanes'
import { layout, note } from './note'

export const hitEffectLayout = (lane: number, size: number) => layout(lane, 1, size)

export const holdEffectLayout = (lane: number, size: number) =>
    new Rect({
        l: -1,
        r: 1,
        t: -2,
        b: 0,
    })
        .mul(note.radius * size)
        .add(Vec.t)
        .toQuad()
        .rotate(-lane * lanes.angle)
