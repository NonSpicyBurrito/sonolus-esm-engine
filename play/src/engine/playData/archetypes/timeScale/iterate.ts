import { archetypes } from '..'

export const iterateTimeScales = (index: number) => ({
    index,

    get segment() {
        return archetypes.TimeScaleChange.sharedMemory.get(this.index)
    },

    get next() {
        return archetypes.TimeScaleChange.import.get(this.index).next
    },

    get nextSegment() {
        return archetypes.TimeScaleChange.sharedMemory.get(this.next)
    },

    advance() {
        this.index = this.next
    },
})
