import { SkinSpriteName } from '@sonolus/core'

import { panel } from './panel'

export const skin = defineSkin({
    sprites: {
        lane: SkinSpriteName.Lane,
        laneAlternative: SkinSpriteName.LaneAlternative,
        stageLeftBorder: SkinSpriteName.StageLeftBorder,
        stageRightBorder: SkinSpriteName.StageRightBorder,

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

        simLine: SkinSpriteName.SimultaneousConnectionNeutralSeamless,

        beatLine: SkinSpriteName.GridNeutral,
        bpmChangeLine: SkinSpriteName.GridPurple,
    },
})

export const layer = {
    marker: 101,
    note: 100,
    connector: 99,

    simLine: 90,

    line: 10,

    stage: 0,
}

export const line = (sprite: SkinSprite, beat: number, a: number) => {
    const pos = panel.getPos(bpmChanges.at(beat).time)

    sprite.draw(
        new Rect({
            l: -4.5,
            r: 4.5,
            b: -panel.h * 0.0025,
            t: panel.h * 0.0025,
        }).add(pos),
        [layer.line],
        a,
    )
}

export const getZ = (layer: number, time: number, lane: number) =>
    layer - time / 1000 - lane / 100000
