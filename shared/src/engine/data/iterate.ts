export type Iterator<T> = {
    readonly index: number
    readonly segment: T
    readonly next: number
    readonly nextSegment: T
    advance: () => void
}
