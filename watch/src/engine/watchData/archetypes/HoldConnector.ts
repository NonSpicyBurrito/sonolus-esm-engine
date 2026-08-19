import { archetypes } from '.'
import { holdConnectorEndLayout, left } from '../../../../../shared/src/engine/data/holdConnector'
import {
    approachPos,
    approachSize,
    note,
    position,
    toT,
} from '../../../../../shared/src/engine/data/note'
import { SFX } from '../../../../../shared/src/engine/data/sfx'
import { options } from '../../configuration/options'
import { effect } from '../effect'
import { holdEffectLayout, particle } from '../particle'
import { layer, skin } from '../skin'
import { getCurrentConnectorOpacity, getCurrentScaledTime } from './timeScale/TimeScaleGroup'

type DataKey = 'prev' | 'min' | 'max' | 'next'

const data = <T>(type: T) => ({ prev: type, min: type, max: type, next: type })

export class HoldConnector extends Archetype {
    import = this.defineImport({
        head: { name: 'head', type: Number },
        tail: { name: 'tail', type: Number },
        prev: { name: 'prev', type: Number },
        next: { name: 'next', type: Number },
    })

    initialized = this.entityMemory(Boolean)

    group = this.entityMemory(data(Number))
    lane = this.entityMemory(data(Number))
    targetTime = this.entityMemory(data(Number))
    visualTime = this.entityMemory(data(Range))

    effectInstanceId = this.entityMemory(ParticleEffectInstanceId)

    preprocessOrder = 3
    preprocess() {
        if (options.sfxEnabled && this.headImport.holdSfx !== SFX.None) {
            if (replay.isReplay) {
                this.scheduleReplaySFX()
            } else {
                this.scheduleSFX(this.headSharedMemory.targetTime, this.tailSharedMemory.targetTime)
            }
        }
    }

    spawnTime(): number {
        return Math.min(this.headSharedMemory.spawnTime, this.tailSharedMemory.spawnTime)
    }

    despawnTime(): number {
        return Math.max(this.headSharedMemory.targetTime, this.tailSharedMemory.targetTime)
    }

    initialize() {
        if (this.initialized) return
        this.initialized = true

        this.globalInitialize()
    }

    updateParallel() {
        const t = {
            min: toT(this.visualTime.min, getCurrentScaledTime(this.group.min)),
            max: toT(this.visualTime.max, getCurrentScaledTime(this.group.max)),
        }
        if (t.min <= -1 && t.max <= -1) return

        const vt = {
            min: time.now >= this.targetTime.min ? 0 : Math.max(-1, t.min),
            max: time.now >= this.targetTime.max ? 0 : Math.max(-1, t.max),
        }

        const opacity = options.connectorAlpha * getCurrentConnectorOpacity(this.group.min)

        const a =
            this.targetTime.max - this.targetTime.min >= 1
                ? 0.5 + Math.abs(0.5 - Math.unlerp(t.min, t.max, vt.max))
                : 1

        const joint = {
            min: this.getJoint('prev', 'min', 'max'),
            max: this.getJoint('min', 'max', 'next'),
        }

        for (let i = 0; i < 20; i++) {
            const st = {
                prev: Math.lerp(vt.min, vt.max, (i - 1) / 20),
                min: Math.lerp(vt.min, vt.max, i / 20),
                max: Math.lerp(vt.min, vt.max, (i + 1) / 20),
                next: Math.lerp(vt.min, vt.max, (i + 2) / 20),
            }

            const lane = {
                prev: Math.remap(t.min, t.max, this.lane.min, this.lane.max, st.prev),
                min: Math.remap(t.min, t.max, this.lane.min, this.lane.max, st.min),
                max: Math.remap(t.min, t.max, this.lane.min, this.lane.max, st.max),
                next: Math.remap(t.min, t.max, this.lane.min, this.lane.max, st.next),
            }

            const center = {
                prev: position(lane.prev, approachPos(st.prev)),
                min: position(lane.min, approachPos(st.min)),
                max: position(lane.max, approachPos(st.max)),
                next: position(lane.next, approachPos(st.next)),
            }

            const offset = {
                min: left(
                    center.prev,
                    center.min,
                    center.max,
                    approachSize(st.min) * options.noteSize,
                ),
                max: left(
                    center.min,
                    center.max,
                    center.next,
                    approachSize(st.max) * options.noteSize,
                ),
            }

            const p1 = center.min.add(offset.min)
            const p2 = center.max.add(offset.max)
            const p3 = center.max.sub(offset.max)
            const p4 = center.min.sub(offset.min)

            if (this.import.prev && time.now < this.targetTime.min) {
                if (i < 4) {
                    if (p2.sub(joint.min.mid).dot(joint.min.direction) < 0) p2.copyFrom(joint.min.l)
                    if (p3.sub(joint.min.mid).dot(joint.min.direction) < 0) p3.copyFrom(joint.min.r)
                }

                if (i === 0) {
                    p1.copyFrom(joint.min.l)
                    p4.copyFrom(joint.min.r)
                } else if (i <= 4) {
                    if (p1.sub(joint.min.mid).dot(joint.min.direction) < 0) p1.copyFrom(joint.min.l)
                    if (p4.sub(joint.min.mid).dot(joint.min.direction) < 0) p4.copyFrom(joint.min.r)
                }
            }

            if (this.import.next && t.max > -1) {
                if (i > 15) {
                    if (joint.max.mid.sub(p1).dot(joint.max.direction) < 0) p1.copyFrom(joint.max.l)
                    if (joint.max.mid.sub(p4).dot(joint.max.direction) < 0) p4.copyFrom(joint.max.r)
                }

                if (i === 19) {
                    p2.copyFrom(joint.max.l)
                    p3.copyFrom(joint.max.r)
                } else if (i >= 15) {
                    if (joint.max.mid.sub(p2).dot(joint.max.direction) < 0) p2.copyFrom(joint.max.l)
                    if (joint.max.mid.sub(p3).dot(joint.max.direction) < 0) p3.copyFrom(joint.max.r)
                }
            }

            skin.sprites.holdConnector.draw(
                new Quad({ p1, p2, p3, p4 }),
                [layer.connector, -this.targetTime.min, -this.lane.min],
                opacity * Math.lerp(1, a, (i + 0.5) / 20),
            )

            if (skin.sprites.holdConnectorEnd.exists) {
                if (i === 0 && (!this.import.prev || time.now >= this.targetTime.min))
                    skin.sprites.holdConnectorEnd.draw(
                        holdConnectorEndLayout(p4, p1),
                        [layer.connector, -this.targetTime.min, -this.lane.min],
                        opacity,
                    )

                if (i === 19 && (!this.import.next || t.max <= -1))
                    skin.sprites.holdConnectorEnd.draw(
                        holdConnectorEndLayout(p2, p3),
                        [layer.connector, -this.targetTime.min, -this.lane.min],
                        opacity * a,
                    )
            }
        }

        if (time.now < this.targetTime.min) return

        if (this.isActive) {
            if (this.shouldSpawnHoldEffect) {
                if (!this.effectInstanceId)
                    this.effectInstanceId = particle.effects.holdLinear.spawn(Quad.zero, 1, true)

                const lane = Math.remap(t.min, t.max, this.lane.min, this.lane.max, vt.min)
                particle.effects.move(this.effectInstanceId, holdEffectLayout(lane))
            }
        } else {
            if (this.shouldSpawnHoldEffect && this.effectInstanceId) {
                particle.effects.destroy(this.effectInstanceId)

                this.effectInstanceId = 0
            }
        }
    }

    terminate() {
        if (this.shouldSpawnHoldEffect && this.effectInstanceId) {
            particle.effects.destroy(this.effectInstanceId)

            this.effectInstanceId = 0
        }
    }

    get prevImport() {
        return archetypes.HoldConnector.import.get(this.import.prev)
    }

    get nextImport() {
        return archetypes.HoldConnector.import.get(this.import.next)
    }

    get headImport() {
        return archetypes.TapNote.import.get(this.import.head)
    }

    get tailImport() {
        return archetypes.TapNote.import.get(this.import.tail)
    }

    get prevHeadImport() {
        return archetypes.TapNote.import.get(this.prevImport.head)
    }

    get nextTailImport() {
        return archetypes.TapNote.import.get(this.nextImport.tail)
    }

    get headSharedMemory() {
        return archetypes.TapNote.sharedMemory.get(this.import.head)
    }

    get tailSharedMemory() {
        return archetypes.TapNote.sharedMemory.get(this.import.tail)
    }

    get prevHeadSharedMemory() {
        return archetypes.TapNote.sharedMemory.get(this.prevImport.head)
    }

    get nextTailSharedMemory() {
        return archetypes.TapNote.sharedMemory.get(this.nextImport.tail)
    }

    get shouldSpawnHoldEffect() {
        return options.noteEffectEnabled && particle.effects.holdLinear.exists
    }

    get isActive() {
        if (!replay.isReplay) return time.now >= this.targetTime.min

        const startTime = streams.getPreviousKey(this.info.index, time.now)
        if (startTime < time.now) {
            const endTime = streams.getValue(this.info.index, startTime)
            if (time.now < endTime) return true
        }

        return false
    }

    globalInitialize() {
        this.group.prev = this.prevHeadImport.group
        this.group.min = this.headImport.group
        this.group.max = this.tailImport.group
        this.group.next = this.nextTailImport.group

        this.lane.prev = this.prevHeadImport.lane
        this.lane.min = this.headImport.lane
        this.lane.max = this.tailImport.lane
        this.lane.next = this.nextTailImport.lane

        this.targetTime.prev = this.prevHeadSharedMemory.targetTime
        this.targetTime.min = this.headSharedMemory.targetTime
        this.targetTime.max = this.tailSharedMemory.targetTime
        this.targetTime.next = this.nextTailSharedMemory.targetTime

        this.visualTime.prev.copyFrom(this.prevHeadSharedMemory.visualTime)
        this.visualTime.min.copyFrom(this.headSharedMemory.visualTime)
        this.visualTime.max.copyFrom(this.tailSharedMemory.visualTime)
        this.visualTime.next.copyFrom(this.nextTailSharedMemory.visualTime)
    }

    getSFX() {
        switch (this.headImport.holdSfx) {
            case SFX.Alt2:
                if (effect.clips.hold2.exists) return effect.clips.hold2.id
                break
            case SFX.Alt3:
                if (effect.clips.hold3.exists) return effect.clips.hold3.id
                break
            case SFX.Alt4:
                if (effect.clips.hold4.exists) return effect.clips.hold4.id
                break
        }

        return effect.clips.hold.id
    }

    scheduleReplaySFX() {
        let key = -999999
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const startTime = streams.getNextKey(this.info.index, key)
            if (startTime === key) break

            const endTime = streams.getValue(this.info.index, startTime)
            this.scheduleSFX(startTime, Math.min(endTime, this.tailSharedMemory.targetTime))

            key = startTime
        }
    }

    scheduleSFX(startTime: number, endTime: number) {
        const id = effect.clips.scheduleLoop(this.getSFX(), startTime)
        effect.clips.scheduleStopLoop(id, endTime)
    }

    getJoint(minKey: DataKey, midKey: DataKey, maxKey: DataKey) {
        const t = {
            min: toT(this.visualTime[minKey], getCurrentScaledTime(this.group[minKey])),
            mid: toT(this.visualTime[midKey], getCurrentScaledTime(this.group[midKey])),
            max: toT(this.visualTime[maxKey], getCurrentScaledTime(this.group[maxKey])),
        }

        const st = {
            min: t.mid + 0.01,
            max: t.mid - 0.01,
        }

        const lane = {
            min: Math.remap(t.min, t.mid, this.lane[minKey], this.lane[midKey], st.min),
            max: Math.remap(t.mid, t.max, this.lane[midKey], this.lane[maxKey], st.max),
        }

        const min = position(lane.min, approachPos(st.min))
        const mid = position(this.lane[midKey], approachPos(t.mid))
        const max = position(lane.max, approachPos(st.max))

        const next = max.sub(mid).normalize()
        const prev = min.sub(mid).normalize()

        const direction = next.sub(prev).normalize()
        const offset = new Vec(direction.y, -direction.x)

        const cos = next.dot(offset)
        const l = cos > 0 ? 1 / next.dot(direction) : 1
        const r = cos < 0 ? 1 / next.dot(direction) : 1

        const size = offset.mul(approachSize(t.mid) * options.noteSize * note.radius)

        return {
            direction,
            mid,
            l: mid.add(size.mul(l)),
            r: mid.sub(size.mul(r)),
        }
    }
}
