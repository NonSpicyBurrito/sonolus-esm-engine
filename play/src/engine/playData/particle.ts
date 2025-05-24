import { ParticleEffectName } from '@sonolus/core'

import {
    hitEffectLayout as _hitEffectLayout,
    holdEffectLayout as _holdEffectLayout,
} from '../../../../shared/src/engine/data/particle'
import { options } from '../configuration/options'

export const particle = defineParticle({
    effects: {
        tapCircular: ParticleEffectName.NoteCircularTapBlue,

        flickCircular: ParticleEffectName.NoteCircularAlternativeRed,
        flickCircularHorizontal: 'ESM Flick Horizontal',
        flickCircularLeft: 'ESM Flick Left',
        flickCircularRight: 'ESM Flick Right',
        flickCircularVertical: 'ESM Flick Vertical',
        flickCircularUp: 'ESM Flick Up',
        flickCircularDown: 'ESM Flick Down',

        holdCircular: ParticleEffectName.NoteCircularTapGreen,
        holdLinear: ParticleEffectName.NoteLinearHoldGreen,
    },
})

export const hitEffectLayout = (lane: number, size: number) =>
    _hitEffectLayout(lane, size * options.noteEffectSize)

export const holdEffectLayout = (lane: number) => _holdEffectLayout(lane, options.noteEffectSize)
