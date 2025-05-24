import { buckets } from '../../../buckets'
import { effect } from '../../../effect'
import { particle } from '../../../particle'
import { skin } from '../../../skin'
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
}
