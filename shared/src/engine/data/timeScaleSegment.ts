export const TimeScaleSegment = {
    scaledTime: Number,
    time: Number,
    timeScale: Number,
    ease: Number,
    nextTime: Number,
    nextTimeScale: Number,
}

export type TimeScaleSegment = ContainerType<typeof TimeScaleSegment>

export type SpeedChangeData = {
    group: number
    beat: number
    timeScale: number
    ease: number
    next: number
}


export const getScaledTime = (time: number, segment: TimeScaleSegment) => {
    if (segment.ease === 1 && segment.nextTime > segment.time) {
        if (time <= segment.time) {
            return segment.scaledTime + (time - segment.time) * segment.timeScale
        }
        if (time >= segment.nextTime) {
            const duration = segment.nextTime - segment.time
            const avgSpeed = (segment.timeScale + segment.nextTimeScale) / 2
            const lerpScaledTime = segment.scaledTime + duration * avgSpeed
            return lerpScaledTime + (time - segment.nextTime) * segment.nextTimeScale
        }
        const ratio = (time - segment.time) / (segment.nextTime - segment.time)
        const currentSpeed = segment.timeScale + ratio * (segment.nextTimeScale - segment.timeScale)
        const avgSpeed = (segment.timeScale + currentSpeed) / 2
        return segment.scaledTime + (time - segment.time) * avgSpeed
    }
    return segment.scaledTime + (time - segment.time) * segment.timeScale
}

