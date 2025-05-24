import { lanes } from './lanes'

export enum SFX {
    Default,
    None,
    Alt2,
    Alt3,
    Alt4,
}

export const note = {
    radius: 0.1125,
}

export const toT = (visualTime: Range, scaledTime: number) =>
    Math.remap(visualTime.min, visualTime.max, -1, 0, scaledTime)

export const approachPos = (t: number) => approach(t, 0.6444, 1.6294, 1.8924)

export const approachSize = (t: number) => approach(t, 0.601, 1.4536, 1.6396)

const approach = (t: number, a: number, b: number, c: number) => a * t ** 3 + b * t ** 2 + c * t + 1

export const layout = (lane: number, pos: number, size: number) =>
    new Rect({
        l: -1,
        r: 1,
        t: -1,
        b: 1,
    })
        .mul(size * note.radius)
        .add(position(lane, pos))

export const position = (lane: number, pos: number) => Vec.t.mul(pos).rotate(-lane * lanes.angle)
