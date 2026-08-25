# Sonolus ESM Engine

A recreation of ENSEMBLE STARS Music engine in [Sonolus](https://sonolus.com).

## Links

- [Sonolus Website](https://sonolus.com)
- [Sonolus Wiki](https://wiki.sonolus.com)

## Custom Resources

### Skin Sprites

| Name                |
| ------------------- |
| `ESM Circle`        |
| `ESM Flick Left`    |
| `ESM Flick Right`   |
| `ESM Flick Up`      |
| `ESM Flick Down`    |
| `ESM Connector End` |

### Effect Clips

| Name                  |
| --------------------- |
| `ESM Perfect 2`       |
| `ESM Perfect 3`       |
| `ESM Perfect 4`       |
| `ESM Hold 2`          |
| `ESM Hold 3`          |
| `ESM Hold 4`          |
| `ESM Tick`            |
| `ESM Tick 2`          |
| `ESM Tick 3`          |
| `ESM Tick 4`          |
| `ESM Flick Perfect 2` |
| `ESM Flick Perfect 3` |
| `ESM Flick Perfect 4` |

### Particle Effects

| Name                   |
| ---------------------- |
| `ESM Flick Horizontal` |
| `ESM Flick Left`       |
| `ESM Flick Right`      |
| `ESM Flick Vertical`   |
| `ESM Flick Up`         |
| `ESM Flick Down`       |

## Level Data Archetypes

### `Initialization`

Must be the first entity in level.

- `life`: the amount of notes missed that results in failing.

### `Stage`

Must be the second entity in level.

### `#BPM_CHANGE`

- `#BEAT`.
- `#BPM`.

### `TimeScaleGroup`

- `head`: reference to the first `TimeScaleChange` or `TimeSkip` entity, omit if not exists.
- `noteSpeed`.
- `headNoteHider`: reference to the first `NoteHider` entity, omit if not exists.
- `headConnectorHider`: reference to the first `ConnectorHider` entity, omit if not exists.

### `TimeScaleChange`

- `group`: reference to the `TimeScaleGroup` entity it belongs to.
- `#BEAT`.
- `#TIMESCALE`.
- `ease`: 0 = none, 1 = linear.
- `next`: reference to the next `TimeScaleChange` or `TimeSkip` entity in the group, omit if not exists.

### `TimeSkip`

- `group`: reference to the `TimeScaleGroup` entity it belongs to.
- `#BEAT`.
- `skip`.
- `next`: reference to the next `TimeScaleChange` or `TimeSkip` entity in the group, omit if not exists.
- `prevTimeScaleChange`: reference to the previous `TimeScaleChange` entity in the group, omit if not exists.
- `nextTimeScaleChange`: reference to the next `TimeScaleChange` entity in the group, omit if not exists.

### `NoteHider`, `ConnectorHider`

- `group`: reference to the `TimeScaleGroup` entity it belongs to.
- `#BEAT`.
- `opacity`.
- `ease`: 0 = none, 1 = linear.
- `next`: reference to the next corresponding `NoteHider`/`ConnectorHider` entity in the group, omit if not exists.

### `*Note`

Common data for `FlickNote`, `HoldStartNote`, `HoldTickNote`, and `IgnoredNote`.

- `group`: reference to the `TimeScaleGroup` entity it belongs to, omit if it belongs to no group.
- `#BEAT`.
- `lane`.
- `shortenEarlyWindow`: 1 = shorten to Perfect window, 2 = shorten to Great window, 3 = shorten to Good window, 0 = none.
- `sfx`: 0 = default, 1 = none, 2/3/4 = alternate SFXs.
- `holdSfx`: 0 = default, 1 = none, 2/3/4 = alternate SFXs.

### `FlickNote`

- `direction`: 0 = left, 1 = right, 2 = up, 3 = down.

### `HoldConnector`

- `head`: reference to the head note.
- `tail`: reference to the tail note.
- `prev`: reference to the previous `HoldConnector`, omit if not exists.
- `next`: reference to the next `HoldConnector`, omit if not exists.

### `SimLine`

- `l`: reference to the left note.
- `r`: reference to the right note.
