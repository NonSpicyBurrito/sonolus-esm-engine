import { SkinSpriteName } from '@sonolus/core'

export const skin = defineSkin({
    renderMode: 'lightweight',
    sprites: {
        circle: 'ESM Circle',
        judgeLine: SkinSpriteName.JudgmentLine,
        slot: SkinSpriteName.NoteSlot,

        tapNote: SkinSpriteName.NoteHeadBlue,

        flickNoteUp: 'ESM Flick Up',
        flickNote: SkinSpriteName.NoteHeadRed,
        flickMarker: SkinSpriteName.DirectionalMarkerRed,

        holdStartNote: SkinSpriteName.NoteHeadGreen,

        holdTickNote: SkinSpriteName.NoteTickGreen,

        holdConnector: SkinSpriteName.NoteConnectionGreenSeamless,
        holdConnectorEnd: 'ESM Connector End',
    },
})

export const layer = {
    marker: 101,
    note: 100,

    connector: 90,

    slot: 1,
    judgeLine: 0,
}
