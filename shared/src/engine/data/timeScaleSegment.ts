export const TimeScaleSegment = {
    scaledTime: Number,
    time: Number,
    timeScale: Number,
}

export type TimeScaleSegment = ContainerType<typeof TimeScaleSegment>

export const getScaledTime = (time: number, segment: TimeScaleSegment) =>
    segment.scaledTime + (time - segment.time) * segment.timeScale
