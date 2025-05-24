import { options } from '../../../../configuration/options'
import { panel } from '../../../panel'
import { scaledScreen } from '../../../scaledScreen'
import { layer } from '../../../skin'
import { Note } from '../Note'

export abstract class SingleNote extends Note {
    abstract sprite: SkinSprite

    render() {
        const { layout, time } = this.getRender()

        this.sprite.draw(layout, [layer.note, -time, -this.import.lane], 1)
    }

    getRender() {
        const time = bpmChanges.at(this.import.beat).time
        const pos = panel.getPos(time)

        return {
            layout: new Rect({
                l: this.import.lane - 0.5 * options.noteSize,
                r: this.import.lane + 0.5 * options.noteSize,
                b: -0.5 * options.noteSize * scaledScreen.wToH,
                t: 0.5 * options.noteSize * scaledScreen.wToH,
            }).add(pos),

            time,
        }
    }
}
