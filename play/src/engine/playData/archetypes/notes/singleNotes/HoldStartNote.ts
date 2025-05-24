import { buckets } from '../../../buckets'
import { effect } from '../../../effect'
import { particle } from '../../../particle'
import { skin } from '../../../skin'
import { claim, isInLane, markAsNoEmpty, tryClaim } from '../../InputManager'
import { SingleNote } from './SingleNote'

export class HoldStartNote extends SingleNote {
    sprite = skin.sprites.holdStartNote

    clips = {
        perfect: effect.clips.perfect,
        perfect2: effect.clips.perfect2,
        perfect3: effect.clips.perfect3,
        perfect4: effect.clips.perfect4,
        great: effect.clips.great,
        good: effect.clips.good,
        miss: effect.clips.miss,
    }

    effect = particle.effects.holdCircular
    effectSize = 1

    bucket = buckets.holdStartNote

    scoreMultiplier = 2

    updateSequential() {
        if (time.now < this.inputTime.min) return

        for (const touch of touches) {
            if (!touch.started) continue
            if (!isInLane(touch.startPosition, this.import.lane, 0.9)) continue

            if (tryClaim(touch, this.sharedMemory.targetTime)) return
        }
    }

    touch() {
        if (time.now < this.inputTime.min) return

        for (const touch of touches) {
            if (!touch.started) continue
            if (!isInLane(touch.startPosition, this.import.lane, 0.9)) continue

            if (!claim(touch, this.sharedMemory.targetTime)) continue
            markAsNoEmpty(touch)

            this.complete(touch.startTime)
            return
        }
    }
}
