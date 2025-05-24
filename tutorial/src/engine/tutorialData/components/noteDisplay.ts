import {
    approachPos,
    approachSize,
    layout,
    note,
    toT,
} from '../../../../../shared/src/engine/data/note.js'
import { segment } from '../segment.js'
import { layer, skin } from '../skin.js'

type Note = 'tap' | 'flick' | 'holdStart' | 'holdTick'

enum Mode {
    None,
    Overlay,
    Fall,
    Frozen,
}

let mode = tutorialMemory(DataType<Mode>)

let id = tutorialMemory(SkinSpriteId)
let marker = tutorialMemory(Boolean)

export const noteDisplay = {
    update() {
        if (!mode) return

        if (mode === Mode.Overlay) {
            const a = Math.unlerpClamped(1, 0.75, segment.time)

            const l = -note.radius * 1.5
            const r = note.radius * 1.5

            const t = 0.25 - note.radius * 1.5
            const b = 0.25 + note.radius * 1.5

            const layout = new Rect({ l, r, t, b })

            skin.sprites.draw(id, layout, [layer.note], a)
            if (marker) skin.sprites.flickMarker.draw(layout, [layer.marker], a)
        } else {
            const t = toT(new Range(0, 2), mode === Mode.Fall ? segment.time : 2)

            const noteLayout = layout(0, approachPos(t), approachSize(t))

            skin.sprites.draw(id, noteLayout, [layer.note], 1)
            if (marker) skin.sprites.flickMarker.draw(noteLayout, [layer.marker], 1)
        }
    },

    showOverlay(type: Note) {
        mode = Mode.Overlay
        this.setType(type)
    },

    showFall(type: Note) {
        mode = Mode.Fall
        this.setType(type)
    },

    showFrozen(type: Note) {
        mode = Mode.Frozen
        this.setType(type)
    },

    clear() {
        mode = Mode.None
    },

    setType(type: Note) {
        switch (type) {
            case 'tap':
                id = skin.sprites.tapNote.id
                marker = false
                break
            case 'flick':
                if (skin.sprites.flickNoteUp.exists) {
                    id = skin.sprites.flickNoteUp.id
                    marker = false
                } else {
                    id = skin.sprites.flickNote.id
                    marker = true
                }
                break
            case 'holdStart':
                id = skin.sprites.holdStartNote.id
                marker = false
                break
            case 'holdTick':
                id = skin.sprites.holdTickNote.id
                marker = false
                break
        }
    },
}
