import { connector } from '../../components/connector'
import { effect } from '../../effect'
import { drawHand } from '../../instruction'
import { particle, playHitEffect, spawnHoldEffect } from '../../particle'

let sfxInstanceId = tutorialMemory(LoopedEffectClipInstanceId)

let effectInstanceId = tutorialMemory(ParticleEffectInstanceId)

export const holdTickNoteHit = {
    enter() {
        connector.showFrozen()

        if (effect.clips.tick.exists) {
            effect.clips.tick.play(0)
        } else {
            effect.clips.perfect.play(0)
        }
        sfxInstanceId = effect.clips.hold.loop()

        playHitEffect(particle.effects.holdCircular, 0.6)
        effectInstanceId = spawnHoldEffect()
    },

    update() {
        drawHand(Math.PI / 3, 0, 1)
    },

    exit() {
        connector.clear()

        effect.clips.stopLoop(sfxInstanceId)

        particle.effects.destroy(effectInstanceId)
    },
}
