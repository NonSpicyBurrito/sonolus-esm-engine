import {
    approachPos,
    approachSize,
    layout,
    SFX,
    toT,
} from '../../../../../../../shared/src/engine/data/note'
import { bucketWindows, windows } from '../../../../../../../shared/src/engine/data/windows'
import { options } from '../../../../configuration/options'
import { effect, sfxDistance } from '../../../effect'
import { hitEffectLayout } from '../../../particle'
import { layer } from '../../../skin'
import { scoreSystem } from '../../Initialization'
import { getCurrentScaledTime } from '../../timeScale/TimeScaleGroup'
import { Note } from '../Note'

export abstract class SingleNote extends Note {
    hasInput = true

    singleImport = this.defineImport({
        shortenEarlyWindow: { name: 'shortenEarlyWindow', type: DataType<Judgment> },
    })

    export = this.defineExport({
        accuracyDiff: { name: 'accuracyDiff', type: Number },
    })

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

    inputTime = this.entityMemory(Range)
    spawnTime = this.entityMemory(Number)

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

        switch (this.singleImport.shortenEarlyWindow) {
            case Judgment.Perfect:
                this.inputTime.min = windows.perfect.min
                break
            case Judgment.Great:
                this.inputTime.min = windows.great.min
                break
            case Judgment.Good:
                this.inputTime.min = windows.good.min
                break
            default:
                this.inputTime.min = windows.bad.min
                break
        }
        this.inputTime.min += this.sharedMemory.targetTime + input.offset
        this.inputTime.max = windows.bad.max + this.sharedMemory.targetTime + input.offset

        this.spawnTime = Math.min(this.sharedMemory.spawnTime, this.inputTime.min)

        if (this.shouldScheduleSFX) this.scheduleSFX()
    }

    spawnOrder() {
        return 1000 + this.spawnTime
    }

    shouldSpawn() {
        return time.now >= this.spawnTime
    }

    initialize() {
        this.result.accuracy = windows.bad.max
    }

    updateParallel() {
        if (time.now > this.inputTime.max) this.despawn = true
        if (this.despawn) return

        const t = toT(this.sharedMemory.visualTime, getCurrentScaledTime(this.import.group))
        if (t < -1) return

        this.render(layout(this.import.lane, approachPos(t), approachSize(t) * options.noteSize))
    }

    get shouldScheduleSFX() {
        return options.sfxEnabled && options.autoSFX && this.import.sfx !== SFX.None
    }

    get shouldPlaySFX() {
        return options.sfxEnabled && !options.autoSFX && this.import.sfx !== SFX.None
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
        effect.clips.schedule(
            this.getSFX(Judgment.Perfect),
            this.sharedMemory.targetTime,
            sfxDistance,
        )
    }

    render(layout: Rect) {
        this.sprite.draw(layout, [layer.note, -this.sharedMemory.targetTime, -this.import.lane], 1)
    }

    complete(hitTime: number) {
        this.result.judgment = input.judge(hitTime, this.sharedMemory.targetTime, windows)

        if (this.result.judgment) {
            this.result.accuracy = hitTime - this.sharedMemory.targetTime

            this.result.bucket.index = this.bucket.index
            this.result.bucket.value = this.result.accuracy * 1000
        } else {
            this.export(
                'accuracyDiff',
                hitTime - this.result.accuracy - this.sharedMemory.targetTime,
            )
        }

        this.playHitEffects()

        this.despawn = true
    }

    playSFX() {
        effect.clips.play(this.getSFX(this.result.judgment), sfxDistance)
    }

    playHitEffects() {
        if (this.shouldPlaySFX) this.playSFX()
        if (options.noteEffectEnabled) this.playNoteEffect()
    }

    playNoteEffect() {
        const layout = hitEffectLayout(this.import.lane, this.effectSize)

        this.effect.spawn(layout, 0.25, false)
    }
}
