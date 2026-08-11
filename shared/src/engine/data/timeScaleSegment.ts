export const TimeScaleSegment = {
    scaledTime: Number,
    time: Number,
    timeScale: Number,
    ease: Boolean,
    nextTime: Number,
    nextTimeScale: Number,
}

export type TimeScaleSegment = ContainerType<typeof TimeScaleSegment>

export const getScaledTime = (time: number, segment: TimeScaleSegment) => {
    if (time < segment.time) return segment.scaledTime + (time - segment.time) * segment.timeScale

    if (!segment.ease) {
        return segment.scaledTime + (time - segment.time) * segment.timeScale
    } else {
        return (
            segment.scaledTime +
            (time - segment.time) *
                Math.remap(
                    segment.time,
                    segment.nextTime,
                    segment.timeScale,
                    segment.nextTimeScale,
                    Math.lerp(segment.time, time, 0.5),
                )
        )
    }
}
