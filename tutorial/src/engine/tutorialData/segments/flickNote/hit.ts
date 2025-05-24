import { effect } from '../../effect'
import { particle, playHitEffect } from '../../particle'

export const flickNoteHit = {
    enter() {
        effect.clips.perfectAlternative.play(0)

        if (particle.effects.flickCircularUp.exists) {
            playHitEffect(particle.effects.flickCircularUp, 1)
        } else if (particle.effects.flickCircularVertical.exists) {
            playHitEffect(particle.effects.flickCircularVertical, 1)
        } else {
            playHitEffect(particle.effects.flickCircular, 1)
        }
    },
}
