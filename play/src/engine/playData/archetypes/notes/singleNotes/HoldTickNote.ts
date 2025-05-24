import { buckets } from '../../../buckets'
import { effect } from '../../../effect'
import { particle } from '../../../particle'
import { skin } from '../../../skin'
import { isInLane } from '../../InputManager'
import { SingleNote } from './SingleNote'

export class HoldTickNote extends SingleNote {
    sprite = skin.sprites.holdTickNote

    clips = {
        perfect: effect.clips.tick,
        perfect2: effect.clips.tick2,
        perfect3: effect.clips.tick3,
        perfect4: effect.clips.tick4,
        great: effect.clips.tick,
        good: effect.clips.tick,
        miss: effect.clips.miss,
    }

    effect = particle.effects.holdCircular
    effectSize = 0.6

    bucket = buckets.holdTickNote

    scoreMultiplier = 1

    hasEarlyHit = this.entityMemory(Boolean)
    earlyHitTime = this.entityMemory(Number)

    updateSequential() {
        if (time.now < this.inputTime.min) return

        const hitTime = time.now - input.offset
        if (hitTime < this.sharedMemory.targetTime) {
            for (const touch of touches) {
                if (!isInLane(touch.position, this.import.lane, 0.9)) continue

                this.hasEarlyHit = true
                this.earlyHitTime = hitTime
            }
        } else {
            for (const touch of touches) {
                if (!isInLane(touch.position, this.import.lane, 0.9)) continue

                this.complete(Math.max(touch.t, this.sharedMemory.targetTime))
                return
            }

            if (this.hasEarlyHit) {
                this.complete(this.earlyHitTime)
            }
        }
    }
}
