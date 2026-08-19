import { HoldConnector } from './HoldConnector.js'
import { Initialization } from './Initialization.js'
import { InputManager } from './InputManager.js'
import { IgnoredNote } from './notes/IgnoredNote.js'
import { FlickNote } from './notes/singleNotes/FlickNote.js'
import { HoldStartNote } from './notes/singleNotes/HoldStartNote.js'
import { HoldTickNote } from './notes/singleNotes/HoldTickNote.js'
import { TapNote } from './notes/singleNotes/TapNote.js'
import { SimLine } from './SimLine.js'
import { Stage } from './Stage.js'
import { TimeScaleChange } from './timeScale/TimeScaleChange.js'
import { TimeScaleGroup } from './timeScale/TimeScaleGroup.js'
import { TimeSkip } from './timeScale/TimeSkip.js'

export const archetypes = defineArchetypes({
    Initialization,
    InputManager,

    Stage,

    TimeScaleGroup,
    TimeScaleChange,
    TimeSkip,

    TapNote,
    FlickNote,
    HoldStartNote,
    HoldTickNote,
    IgnoredNote,

    HoldConnector,

    SimLine,
})
