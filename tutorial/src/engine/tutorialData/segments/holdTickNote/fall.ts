import { connector } from '../../components/connector'
import { noteDisplay } from '../../components/noteDisplay'
import { effect } from '../../effect'
import { drawHand } from '../../instruction'
import { particle, spawnHoldEffect } from '../../particle'

let sfxInstanceId = tutorialMemory(LoopedEffectClipInstanceId)

let effectInstanceId = tutorialMemory(ParticleEffectInstanceId)

export const holdTickNoteFall = {
    enter() {
        noteDisplay.showFall('holdTick')
        connector.showFrozen()

        sfxInstanceId = effect.clips.hold.loop()

        effectInstanceId = spawnHoldEffect()
    },

    update() {
        drawHand(Math.PI / 3, 0, 1)
    },

    exit() {
        noteDisplay.clear()
        connector.clear()

        effect.clips.stopLoop(sfxInstanceId)

        particle.effects.destroy(effectInstanceId)
    },
}
