export const windows = {
    perfect: Range.one.mul(3 / 60),
    great: Range.one.mul(5 / 60),
    good: Range.one.mul(7 / 60),
    bad: Range.one.mul(10 / 60),
}

const toMs = ({ min, max }: Range) => new Range(Math.round(min * 1000), Math.round(max * 1000))

export const bucketWindows = {
    perfect: toMs(windows.perfect),
    great: toMs(windows.great),
    good: toMs(windows.good),
}
