import { connector } from '../../components/connector'
import { effect } from '../../effect'
import { drawHand } from '../../instruction'
import { particle, playHitEffect, spawnHoldEffect } from '../../particle'

let sfxInstanceId = tutorialMemory(LoopedEffectClipInstanceId)

let effectInstanceId = tutorialMemory(ParticleEffectInstanceId)

export const holdStartNoteHit = {
    enter() {
        connector.showFrozen()

        effect.clips.perfect.play(0)
        sfxInstanceId = effect.clips.hold.loop()

        playHitEffect(particle.effects.holdCircular, 1)
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
