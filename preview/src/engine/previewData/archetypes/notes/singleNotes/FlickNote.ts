import { FlickDirection } from '../../../../../../../shared/src/engine/data/flick'
import { options } from '../../../../configuration/options'
import { layer, skin } from '../../../skin'
import { SingleNote } from './SingleNote'

export class FlickNote extends SingleNote {
    flickImport = this.defineImport({
        direction: { name: 'direction', type: DataType<FlickDirection> },
    })

    sprite = skin.sprites.flickNote

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

    render() {
        if (this.useMarker) {
            super.render()

            const { layout, time } = this.getRender()

            switch (this.flickImport.direction) {
                case FlickDirection.Left:
                    skin.sprites.flickMarker.draw(
                        layout.toQuad().swapRotate270(),
                        [layer.marker, -time, -this.import.lane],
                        1,
                    )
                    break
                case FlickDirection.Right:
                    skin.sprites.flickMarker.draw(
                        layout.toQuad().swapRotate90(),
                        [layer.marker, -time, -this.import.lane],
                        1,
                    )
                    break
                case FlickDirection.Up:
                    skin.sprites.flickMarker.draw(
                        layout,
                        [layer.marker, -time, -this.import.lane],
                        1,
                    )
                    break
                case FlickDirection.Down:
                    skin.sprites.flickMarker.draw(
                        layout.toQuad().swapRotate180(),
                        [layer.marker, -time, -this.import.lane],
                        1,
                    )
                    break
            }
        } else {
            const { layout, time } = this.getRender()

            switch (this.flickImport.direction) {
                case FlickDirection.Left:
                    skin.sprites.flickNoteLeft.draw(
                        layout,
                        [layer.note, -time, -this.import.lane],
                        1,
                    )
                    break
                case FlickDirection.Right:
                    skin.sprites.flickNoteRight.draw(
                        layout,
                        [layer.note, -time, -this.import.lane],
                        1,
                    )
                    break
                case FlickDirection.Up:
                    skin.sprites.flickNoteUp.draw(layout, [layer.note, -time, -this.import.lane], 1)
                    break
                case FlickDirection.Down:
                    skin.sprites.flickNoteDown.draw(
                        layout,
                        [layer.note, -time, -this.import.lane],
                        1,
                    )
                    break
            }
        }
    }
}
