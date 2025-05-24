import { effect } from '../../effect'
import { particle, playHitEffect } from '../../particle'

export const tapNoteHit = {
    enter() {
        effect.clips.perfect.play(0)

        playHitEffect(particle.effects.tapCircular, 1)
    },
}
