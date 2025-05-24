import { EngineArchetypeName } from '@sonolus/core'

import { BpmChange } from './BpmChange.js'
import { HoldConnector } from './HoldConnector.js'
import { Initialization } from './Initialization.js'
import { IgnoredNote } from './notes/IgnoredNote.js'
import { FlickNote } from './notes/singleNotes/FlickNote.js'
import { HoldStartNote } from './notes/singleNotes/HoldStartNote.js'
import { HoldTickNote } from './notes/singleNotes/HoldTickNote.js'
import { TapNote } from './notes/singleNotes/TapNote.js'
import { SimLine } from './SimLine.js'
import { Stage } from './Stage.js'

export const archetypes = defineArchetypes({
    Initialization,

    [EngineArchetypeName.BpmChange]: BpmChange,

    Stage,

    TapNote,
    FlickNote,
    HoldStartNote,
    HoldTickNote,
    IgnoredNote,

    HoldConnector,

    SimLine,
})
