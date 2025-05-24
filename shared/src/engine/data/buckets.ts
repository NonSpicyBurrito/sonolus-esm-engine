import { EngineDataBucket, Text } from '@sonolus/core'

export const createBucketDefinition = (
    sprites: Record<
        'tapNote' | 'flickNote' | 'flickNoteUp' | 'holdStartNote' | 'holdTickNote',
        { id: number }
    >,
) =>
    ({
        tapNote: {
            sprites: [
                {
                    id: sprites.tapNote.id,
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
            ],
            unit: Text.MillisecondUnit,
        },
        flickNote: {
            sprites: [
                {
                    id: sprites.flickNoteUp.id,
                    fallbackId: sprites.flickNote.id,
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
            ],
            unit: Text.MillisecondUnit,
        },
        holdStartNote: {
            sprites: [
                {
                    id: sprites.holdStartNote.id,
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
            ],
            unit: Text.MillisecondUnit,
        },
        holdTickNote: {
            sprites: [
                {
                    id: sprites.holdTickNote.id,
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    rotation: 0,
                },
            ],
            unit: Text.MillisecondUnit,
        },
    }) as const satisfies Record<string, EngineDataBucket>
