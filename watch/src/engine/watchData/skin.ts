import { SkinSpriteName } from '@sonolus/core'

export const skin = defineSkin({
    sprites: {
        circle: 'ESM Circle',
        judgeLine: SkinSpriteName.JudgmentLine,
        slot: SkinSpriteName.NoteSlot,

        tapNote: SkinSpriteName.NoteHeadBlue,

        flickNoteLeft: 'ESM Flick Left',
        flickNoteRight: 'ESM Flick Right',
        flickNoteUp: 'ESM Flick Up',
        flickNoteDown: 'ESM Flick Down',
        flickNote: SkinSpriteName.NoteHeadRed,
        flickMarker: SkinSpriteName.DirectionalMarkerRed,

        holdStartNote: SkinSpriteName.NoteHeadGreen,

        holdTickNote: SkinSpriteName.NoteTickGreen,

        holdConnector: SkinSpriteName.NoteConnectionGreenSeamless,
        holdConnectorEnd: 'ESM Connector End',

        simLine: SkinSpriteName.SimultaneousConnectionNeutralSeamless,
    },
})

export const layer = {
    marker: 101,
    note: 100,
    simLine: 99,

    connector: 90,

    slot: 1,
    judgeLine: 0,
}

export const getZ = (layer: number, time: number, lane: number) =>
    layer - time / 1000 - lane / 100000
