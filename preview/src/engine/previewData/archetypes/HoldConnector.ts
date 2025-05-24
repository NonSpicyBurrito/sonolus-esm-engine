import { options } from '../../configuration/options.js'
import { panel } from '../panel.js'
import { layer, skin } from '../skin.js'
import { archetypes } from './index.js'

export class HoldConnector extends Archetype {
    import = this.defineImport({
        head: { name: 'head', type: Number },
        tail: { name: 'tail', type: Number },
    })

    render() {
        const t = {
            min: bpmChanges.at(this.headImport.beat).time,
            max: bpmChanges.at(this.tailImport.beat).time,
        }

        const index = {
            min: Math.floor(t.min / panel.h),
            max: Math.floor(t.max / panel.h),
        }

        const lane = {
            min: this.headImport.lane,
            max: this.tailImport.lane,
        }

        for (let i = index.min; i <= index.max; i++) {
            const x = i * panel.w

            const pt = {
                min: Math.max(t.min, i * panel.h),
                max: Math.min(t.max, (i + 1) * panel.h),
            }

            const pl = {
                min: Math.lerp(lane.min, lane.max, Math.unlerp(t.min, t.max, pt.min)),
                max: Math.lerp(lane.min, lane.max, Math.unlerp(t.min, t.max, pt.max)),
            }

            const pos = {
                min: new Vec(x, pt.min - i * panel.h),
                max: new Vec(x, pt.max - i * panel.h),
            }

            const layout = new Quad({
                p1: pos.min.translate(pl.min - 0.5 * options.noteSize, 0),
                p2: pos.max.translate(pl.max - 0.5 * options.noteSize, 0),
                p3: pos.max.translate(pl.max + 0.5 * options.noteSize, 0),
                p4: pos.min.translate(pl.min + 0.5 * options.noteSize, 0),
            })

            skin.sprites.holdConnector.draw(
                layout,
                [layer.connector, -t.min, -this.headImport.lane],
                options.connectorAlpha,
            )
        }
    }

    get headImport() {
        return archetypes.TapNote.import.get(this.import.head)
    }

    get tailImport() {
        return archetypes.TapNote.import.get(this.import.tail)
    }
}
