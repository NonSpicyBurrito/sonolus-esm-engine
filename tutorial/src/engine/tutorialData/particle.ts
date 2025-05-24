import { ParticleEffectName } from '@sonolus/core'

import {
    hitEffectLayout as _hitEffectLayout,
    holdEffectLayout as _holdEffectLayout,
} from '../../../../shared/src/engine/data/particle'

export const particle = defineParticle({
    effects: {
        tapCircular: ParticleEffectName.NoteCircularTapBlue,

        flickCircular: ParticleEffectName.NoteCircularAlternativeRed,
        flickCircularVertical: 'ESM Flick Vertical',
        flickCircularUp: 'ESM Flick Up',

        holdCircular: ParticleEffectName.NoteCircularTapGreen,
        holdLinear: ParticleEffectName.NoteLinearHoldGreen,
    },
})

export const hitEffectLayout = (size: number) => _hitEffectLayout(0, size)

export const holdEffectLayout = () => _holdEffectLayout(0, 1)

export const playHitEffect = (effect: ParticleEffect, size: number) =>
    effect.spawn(hitEffectLayout(size), 0.25, false)

export const spawnHoldEffect = () => particle.effects.holdLinear.spawn(holdEffectLayout(), 1, true)
