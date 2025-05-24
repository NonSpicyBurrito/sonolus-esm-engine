import { note } from './note'

export const left = (min: Vec, mid: Vec, max: Vec, size: number) => {
    const direction = max.sub(mid).normalize().sub(min.sub(mid).normalize()).normalize()

    return new Vec(direction.y, -direction.x).mul(size * note.radius)
}

export const holdConnectorEndLayout = (l: Vec, r: Vec) => {
    const right = r.sub(l)
    const up = new Vec(right.y, -right.x).div(2)

    return new Quad({
        p1: l,
        p2: l.add(up),
        p3: r.add(up),
        p4: r,
    })
}
