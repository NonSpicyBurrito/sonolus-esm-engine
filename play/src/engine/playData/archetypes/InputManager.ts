import { lanes } from '../../../../../shared/src/engine/data/lanes.js'
import { stage } from '../stage.js'

const claimedTouches = levelMemory(Dictionary(16, TouchId, Number))

export const tryClaim = (touch: Touch, targetTime: number) => {
    const index = claimedTouches.indexOf(touch.id)
    if (index !== -1 && claimedTouches.getValue(index) <= targetTime) return false

    claimedTouches.set(touch.id, targetTime)
    return true
}

export const claim = (touch: Touch, targetTime: number) => {
    const index = claimedTouches.indexOf(touch.id)
    if (index === -1 || claimedTouches.getValue(index) !== targetTime) return false

    claimedTouches.set(touch.id, -999999)
    return true
}

const noEmptyTouchIds = levelMemory(Collection(16, TouchId))

export const isNoEmpty = (touch: Touch) => noEmptyTouchIds.has(touch.id)

export const markAsNoEmpty = (touch: Touch) => {
    noEmptyTouchIds.add(touch.id)
}

export const isInLane = (position: Vec, lane: number, leniency: number) => {
    const x = position.x
    const y = stage.center - position.y

    const l = -Math.atan2(-x, y) / lanes.angle

    return Math.abs(l - lane) <= leniency
}

export class InputManager extends SpawnableArchetype({}) {
    touchOrder = 2
    touch() {
        claimedTouches.clear()
        noEmptyTouchIds.clear()
    }
}
