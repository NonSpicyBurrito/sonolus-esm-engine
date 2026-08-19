import { archetypes } from '..'

export const iterateNoteHiders = (index: number) => ({
    index,

    get segment() {
        return archetypes.NoteHider.sharedMemory.get(this.index)
    },

    get next() {
        return archetypes.NoteHider.import.get(this.index).next
    },

    get nextSegment() {
        return archetypes.NoteHider.sharedMemory.get(this.next)
    },

    advance() {
        this.index = this.next
    },
})

export const iterateConnectorHiders = (index: number) => ({
    index,

    get segment() {
        return archetypes.ConnectorHider.sharedMemory.get(this.index)
    },

    get next() {
        return archetypes.ConnectorHider.import.get(this.index).next
    },

    get nextSegment() {
        return archetypes.ConnectorHider.sharedMemory.get(this.next)
    },

    advance() {
        this.index = this.next
    },
})
