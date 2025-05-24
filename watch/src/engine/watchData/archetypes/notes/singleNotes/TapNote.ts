import { buckets } from '../../../buckets'
import { effect } from '../../../effect'
import { particle } from '../../../particle'
import { skin } from '../../../skin'
import { SingleNote } from './SingleNote'

export class TapNote extends SingleNote {
    sprite = skin.sprites.tapNote

    clips = {
        perfect: effect.clips.perfect,
        perfect2: effect.clips.perfect2,
        perfect3: effect.clips.perfect3,
        perfect4: effect.clips.perfect4,
        great: effect.clips.great,
        good: effect.clips.good,
        miss: effect.clips.miss,
    }

    effect = particle.effects.tapCircular
    effectSize = 1

    bucket = buckets.tapNote

    scoreMultiplier = 2
}
