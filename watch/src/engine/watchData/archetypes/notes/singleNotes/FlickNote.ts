import { FlickDirection } from '../../../../../../../shared/src/engine/data/flick'
import { options } from '../../../../configuration/options'
import { buckets } from '../../../buckets'
import { effect } from '../../../effect'
import { hitEffectLayout, particle } from '../../../particle'
import { layer, skin } from '../../../skin'
import { SingleNote } from './SingleNote'

export class FlickNote extends SingleNote {
    flickImport = this.defineImport({
        direction: { name: 'direction', type: DataType<FlickDirection> },
    })

    sprite = skin.sprites.flickNote

    clips = {
        perfect: effect.clips.perfectAlternative,
        perfect2: effect.clips.perfectAlternative2,
        perfect3: effect.clips.perfectAlternative3,
        perfect4: effect.clips.perfectAlternative4,
        great: effect.clips.greatAlternative,
        good: effect.clips.goodAlternative,
        miss: effect.clips.missAlternative,
    }

    effect = particle.effects.flickCircular
    effectSize = 1

    bucket = buckets.flickNote

    scoreMultiplier = 2

    preprocess() {
        super.preprocess()

        if (options.mirror) {
            switch (this.flickImport.direction) {
                case FlickDirection.Left:
                    this.flickImport.direction = FlickDirection.Right
                    break
                case FlickDirection.Right:
                    this.flickImport.direction = FlickDirection.Left
                    break
            }
        }
    }

    get useMarker() {
        return (
            !skin.sprites.flickNoteLeft.exists ||
            !skin.sprites.flickNoteRight.exists ||
            !skin.sprites.flickNoteUp.exists ||
            !skin.sprites.flickNoteDown.exists
        )
    }

    render(layout: Rect) {
        if (this.useMarker) {
            super.render(layout)

            switch (this.flickImport.direction) {
                case FlickDirection.Left:
                    skin.sprites.flickMarker.draw(
                        layout.toQuad().swapRotate270(),
                        [layer.marker, -this.sharedMemory.targetTime, -this.import.lane],
                        1,
                    )
                    break
                case FlickDirection.Right:
                    skin.sprites.flickMarker.draw(
                        layout.toQuad().swapRotate90(),
                        [layer.marker, -this.sharedMemory.targetTime, -this.import.lane],
                        1,
                    )
                    break
                case FlickDirection.Up:
                    skin.sprites.flickMarker.draw(
                        layout,
                        [layer.marker, -this.sharedMemory.targetTime, -this.import.lane],
                        1,
                    )
                    break
                case FlickDirection.Down:
                    skin.sprites.flickMarker.draw(
                        layout.toQuad().swapRotate180(),
                        [layer.marker, -this.sharedMemory.targetTime, -this.import.lane],
                        1,
                    )
                    break
            }
        } else {
            switch (this.flickImport.direction) {
                case FlickDirection.Left:
                    skin.sprites.flickNoteLeft.draw(
                        layout,
                        [layer.note, -this.sharedMemory.targetTime, -this.import.lane],
                        1,
                    )
                    break
                case FlickDirection.Right:
                    skin.sprites.flickNoteRight.draw(
                        layout,
                        [layer.note, -this.sharedMemory.targetTime, -this.import.lane],
                        1,
                    )
                    break
                case FlickDirection.Up:
                    skin.sprites.flickNoteUp.draw(
                        layout,
                        [layer.note, -this.sharedMemory.targetTime, -this.import.lane],
                        1,
                    )
                    break
                case FlickDirection.Down:
                    skin.sprites.flickNoteDown.draw(
                        layout,
                        [layer.note, -this.sharedMemory.targetTime, -this.import.lane],
                        1,
                    )
                    break
            }
        }
    }

    playNoteEffect() {
        let id = this.effect.id
        switch (this.flickImport.direction) {
            case FlickDirection.Left:
                if (particle.effects.flickCircularLeft.exists) {
                    id = particle.effects.flickCircularLeft.id
                } else if (particle.effects.flickCircularHorizontal.exists) {
                    id = particle.effects.flickCircularHorizontal.id
                }
                break
            case FlickDirection.Right:
                if (particle.effects.flickCircularRight.exists) {
                    id = particle.effects.flickCircularRight.id
                } else if (particle.effects.flickCircularHorizontal.exists) {
                    id = particle.effects.flickCircularHorizontal.id
                }
                break
            case FlickDirection.Up:
                if (particle.effects.flickCircularUp.exists) {
                    id = particle.effects.flickCircularUp.id
                } else if (particle.effects.flickCircularVertical.exists) {
                    id = particle.effects.flickCircularVertical.id
                }
                break
            case FlickDirection.Down:
                if (particle.effects.flickCircularDown.exists) {
                    id = particle.effects.flickCircularDown.id
                } else if (particle.effects.flickCircularVertical.exists) {
                    id = particle.effects.flickCircularVertical.id
                }
                break
        }

        const layout = hitEffectLayout(this.import.lane, this.effectSize)

        particle.effects.spawn(id, layout, 0.25, false)
    }
}
