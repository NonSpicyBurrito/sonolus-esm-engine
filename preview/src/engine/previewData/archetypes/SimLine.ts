import { options } from '../../configuration/options.js'
import { panel } from '../panel.js'
import { scaledScreen } from '../scaledScreen.js'
import { layer, skin } from '../skin.js'
import { archetypes } from './index.js'

export class SimLine extends Archetype {
    import = this.defineImport({
        l: { name: 'l', type: Number },
        r: { name: 'r', type: Number },
    })

    render() {
        if (!options.simLineEnabled) return

        let l = this.lImport.lane
        let r = this.rImport.lane
        if (l > r) [l, r] = [r, l]

        const time = bpmChanges.at(this.lImport.beat).time
        const pos = panel.getPos(time)

        skin.sprites.simLine.draw(
            new Rect({
                l,
                r,
                b: -0.5 * options.noteSize * scaledScreen.wToH,
                t: 0.5 * options.noteSize * scaledScreen.wToH,
            }).add(pos),
            [layer.simLine, -time],
            1,
        )
    }

    get lImport() {
        return archetypes.TapNote.import.get(this.import.l)
    }

    get rImport() {
        return archetypes.TapNote.import.get(this.import.r)
    }
}
