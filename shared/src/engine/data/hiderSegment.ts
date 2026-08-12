export const HiderSegment = {
    time: Number,
    opacity: Number,
    ease: Boolean,
    nextTime: Number,
    nextOpacity: Number,
}

export type HiderSegment = ContainerType<typeof HiderSegment>

export const getOpacity = (time: number, segment: HiderSegment) => {
    if (time < segment.time) return segment.opacity

    if (!segment.ease) {
        return Math.clamp(segment.opacity, 0, 1)
    } else {
        return Math.clamp(
            Math.remap(segment.time, segment.nextTime, segment.opacity, segment.nextOpacity, time),
            0,
            1,
        )
    }
}
