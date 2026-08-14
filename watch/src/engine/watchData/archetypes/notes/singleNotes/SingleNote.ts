import { EngineArchetypeDataName } from '@sonolus/core'

import {
    approachPos,
    approachSize,
    layout,
    toT,
} from '../../../../../../../shared/src/engine/data/note'
import { SFX } from '../../../../../../../shared/src/engine/data/sfx'
import { bucketWindows } from '../../../../../../../shared/src/engine/data/windows'
import { options } from '../../../../configuration/options'
import { effect, sfxDistance } from '../../../effect'
import { hitEffectLayout } from '../../../particle'
import { layer } from '../../../skin'
import { scoreSystem } from '../../Initialization'
import { getCurrentScaledTime } from '../../timeScale/TimeScaleGroup'
import { Note } from '../Note'

export abstract class SingleNote extends Note {
    hasInput = true

    abstract sprite: SkinSprite

    abstract clips: {
        perfect: EffectClip
        perfect2: EffectClip
        perfect3: EffectClip
        perfect4: EffectClip
        great: EffectClip
        good: EffectClip
        miss: EffectClip
    }

    abstract effect: ParticleEffect
    abstract effectSize: number

    abstract bucket: Bucket

    abstract scoreMultiplier: number

    singleImport = this.defineImport({
        judgment: { name: EngineArchetypeDataName.Judgment, type: DataType<Judgment> },
        accuracy: { name: EngineArchetypeDataName.Accuracy, type: Number },
        accuracyDiff: { name: 'accuracyDiff', type: Number },
    })

    singleSharedMemory = this.defineSharedMemory({
        despawnTime: Number,
    })

    globalPreprocess() {
        this.bucket.set(bucketWindows)

        this.archetypeScore.set({
            multiplier: this.scoreMultiplier,
        })

        this.archetypeLife.miss = -1
    }

    preprocess() {
        super.preprocess()

        scoreSystem.noteCount++

        this.singleSharedMemory.despawnTime = this.hitTime

        if (this.shouldScheduleSFX) {
            if (replay.isReplay) {
                this.scheduleReplaySFX()
            } else {
                this.scheduleSFX()
            }
        }

        this.result.time = this.sharedMemory.targetTime

        if (!replay.isReplay) {
            this.result.bucket.index = this.bucket.index
        } else if (this.singleImport.judgment) {
            this.result.bucket.index = this.bucket.index
            this.result.bucket.value = this.singleImport.accuracy * 1000
        }
    }

    spawnTime() {
        return this.sharedMemory.spawnTime
    }

    despawnTime() {
        return this.singleSharedMemory.despawnTime
    }

    updateParallel() {
        const t = toT(this.sharedMemory.visualTime, getCurrentScaledTime(this.import.group))
        if (t < -1) return

        this.render(layout(this.import.lane, approachPos(t), approachSize(t) * options.noteSize))
    }

    terminate() {
        if (time.skip) return

        this.despawnTerminate()
    }

    get hitTime() {
        return (
            this.sharedMemory.targetTime +
            (replay.isReplay ? this.singleImport.accuracy + this.singleImport.accuracyDiff : 0)
        )
    }

    get shouldScheduleSFX() {
        return options.sfxEnabled && this.import.sfx !== SFX.None
    }

    getSFX(judgment: Judgment) {
        switch (this.import.sfx) {
            case SFX.Alt2:
                if (this.clips.perfect2.exists) return this.clips.perfect2.id
                break
            case SFX.Alt3:
                if (this.clips.perfect3.exists) return this.clips.perfect3.id
                break
            case SFX.Alt4:
                if (this.clips.perfect4.exists) return this.clips.perfect4.id
                break
        }

        switch (judgment) {
            case Judgment.Perfect:
                return this.clips.perfect.exists ? this.clips.perfect.id : effect.clips.perfect.id
            case Judgment.Great:
                return this.clips.great.exists ? this.clips.great.id : effect.clips.great.id
            case Judgment.Good:
                return this.clips.good.exists ? this.clips.good.id : effect.clips.good.id
            default:
                return this.clips.miss.exists ? this.clips.miss.id : effect.clips.miss.id
        }
    }

    scheduleSFX() {
        effect.clips.schedule(this.getSFX(Judgment.Perfect), this.hitTime, sfxDistance)
    }

    scheduleReplaySFX() {
        if (this.singleImport.judgment === Judgment.Miss && !this.singleImport.accuracyDiff) return

        effect.clips.schedule(this.getSFX(this.singleImport.judgment), this.hitTime, sfxDistance)
    }

    render(layout: Rect) {
        this.sprite.draw(layout, [layer.note, -this.sharedMemory.targetTime, -this.import.lane], 1)
    }

    despawnTerminate() {
        if (replay.isReplay && !this.singleImport.judgment && !this.singleImport.accuracyDiff)
            return

        if (options.noteEffectEnabled) this.playNoteEffect()
    }

    playNoteEffect() {
        const layout = hitEffectLayout(this.import.lane, this.effectSize)

        this.effect.spawn(layout, 0.25, false)
    }
}
