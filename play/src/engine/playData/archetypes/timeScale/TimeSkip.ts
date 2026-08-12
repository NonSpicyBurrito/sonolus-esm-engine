import { archetypes } from '..'
import { TimeScaleChange } from './TimeScaleChange'

export class TimeSkip extends TimeScaleChange {
    skipImport = this.defineImport({
        skip: { name: 'skip', type: Number },
        prev: { name: 'prevTimeScaleChange', type: Number },
        next: { name: 'nextTimeScaleChange', type: Number },
    })

    preprocess() {
        const prevImport = archetypes.TimeScaleChange.import.get(this.skipImport.prev)
        const nextImport = archetypes.TimeScaleChange.import.get(this.skipImport.next)

        if (this.skipImport.prev && this.skipImport.next) {
            this.import.timeScale = !prevImport.ease
                ? prevImport.timeScale
                : Math.remap(
                      bpmChanges.at(prevImport.beat).time,
                      bpmChanges.at(nextImport.beat).time,
                      prevImport.timeScale,
                      nextImport.timeScale,
                      bpmChanges.at(this.import.beat).time,
                  )
            this.import.ease = prevImport.ease
        } else if (this.skipImport.prev) {
            this.import.timeScale = prevImport.timeScale
        } else if (this.skipImport.next) {
            this.import.timeScale = nextImport.timeScale
        } else {
            this.import.timeScale = 1
        }

        this.sharedMemory.skip = (this.skipImport.skip * 60) / bpmChanges.at(this.import.beat).bpm
        super.preprocess()
    }
}
