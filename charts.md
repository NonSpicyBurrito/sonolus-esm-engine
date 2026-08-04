# MikuMikuWorld for Aurora (MMW4A) - Project & Chart Specification

## 1. Project Overview

**MikuMikuWorld for Aurora (MMW4A)** is an open-source, feature-packed rhythm game chart editor designed for **Project SEKAI / Proseka** style charting and compatible with the **Sonolus engine ecosystem**.

- **Current Version**: `4.8.0.0`
- **Language & Frameworks**: C++20, OpenGL 3.3+, GLFW, Dear ImGui, miniaudio, nlohmann/json.
- **Target OS**: Windows (x64)

---

## 2. Core Features of MMW4A

### 🎵 Note Types & Mechanics
- **Tap Notes**: Standard hit notes placed on lane lines.
- **Hold Notes**:
  - **Hold Start**: Beginning node of a hold note.
  - **Hold Mid (Steps)**: Intermediate nodes supporting three step modes:
    - `Normal`: Standard visible step node.
    - `Hidden`: Invisible step node (`IgnoredNote` archetype) used to shape connectors without rendering a note head.
    - `Skip`: Guideline node (`skip` attribute) interpolating position in time between non-skipped neighbors.
  - **Hold End**: Termination node of a hold note.
- **Flick Notes**: Directional flick notes (`Up`, `Down`, `Left`, `Right`).
- **Ease Curves**: Connector interpolation curves (`Linear`, `Ease In`, `Ease Out`, `Ease In-Out`, `Ease Out-In`).

### 🎚️ Layer & Sublayer Architecture
- **Multi-Layer Support**: Create, rename, hide, lock, reorder, and delete chart layers.
- **Sublayers (`sublayer_id`)**: Group related notes into sublayers under a parent layer for granular organization.

### ⏱️ Tempo & Speed Controls
- **BPM Events**: Dynamic tempo changes throughout the chart.
- **Time Signature Events**: Supports custom time signatures (e.g. 4/4, 3/4, 6/8, 7/8).
- **Speed Change Events**: HI-SPEED scroll multipliers for dynamic timeline velocity manipulation.

### 🔊 Soundpacks & Custom SFX
- **Dynamic Soundpacks**: Auto-discovers and loads custom soundpacks from `res/sound/<pack_id>/`.
- **Per-Note Custom SFX (`sfx`)**: Assign individual hit sounds (`Default`, `Alt2`, `Alt3`, `Alt4`, `Mute`).
- **Per-Segment Connector SFX (`holdSfx`)**: Assign custom loop/connect sounds for hold segments across all hold step types (including hidden nodes).

### 🎨 Customization & Noteskins
- **Dynamic Noteskins**: Auto-discovers noteskins from `res/textures/timeline/<noteskin_id>/` (supports `Aurora`, `Legacy`, `TRIsparence`, `TranspARROWS`, `Transparence`).
- **Configurable Snap Modes**:
  - `Absolute Snap` (Default): Grid snapping relative to absolute measure ticks.
  - `Relative Snap`: Grid snapping relative to selected note offset.
  - `Individual Absolute Snap`: Individual snapping per note in multi-selection.
- **Audio Waveform**: Dual-channel stereo audio waveform visualization on the timeline.

---

## 3. Chart File Format Specification

MMW4A exports and imports Sonolus-compatible JSON level files as well as native `.mmws` project charts.

### 3.1 Sonolus Entity Archetypes

| Entity Archetype | Description | Primary Attributes / Fields |
|---|---|---|
| `Initialization` | Chart initialization metadata | `bgmOffset` |
| `Stage` | Background and stage parameters | Stage boundaries |
| `TapNote` | Standard tap note | `#BEAT`, `lane`, `width`, `sfx`, `group`, `parent_layer` |
| `FlickNote` | Directional flick note | `#BEAT`, `lane`, `width`, `direction`, `sfx`, `group` |
| `HoldStartNote` | Start node of a hold connector | `#BEAT`, `lane`, `width`, `holdSfx`, `sfx`, `group` |
| `HoldTickNote` | Middle node / step of a hold note | `#BEAT`, `lane`, `width`, `holdSfx`, `skip`, `sfx`, `group` |
| `HoldEndNote` | End node of a hold connector | `#BEAT`, `lane`, `width`, `sfx`, `group` |
| `HoldConnector` | Connector line connecting 2 hold nodes | `head`, `tail`, `ease` |
| `IgnoredNote` | Hidden hold step (no visible note head) | `#BEAT`, `lane`, `width`, `holdSfx`, `origin` |
| `BPM` | Tempo change event | `#BEAT`, `bpm` |
| `TimeSignature` | Time signature change event | `#BEAT`, `numerator`, `denominator` |
| `SpeedChange` | Scroll speed change multiplier | `#BEAT`, `speed` |
| `Waypoint` | Bookmark / annotation marker | `#BEAT`, `name` |

---

### 3.2 Attribute Definitions

- **`#BEAT`**: Time position expressed in fractional beats from chart start (`tick / 480.0`).
- **`lane`**: Horizontal center position on the 12-lane grid (mapped from `-NUM_LANES/2` to `+NUM_LANES/2`).
- **`width`**: Note width in lane units.
- **`sfx`**: Integer encoding the hit sound effect:
  - `0`: Default
  - `1`: Alt2
  - `2`: Alt3
  - `3`: Alt4
  - `4`: Mute
- **`holdSfx`**: Integer encoding the hold connector loop sound effect for the segment extending to the next node.
- **`direction`**: Flick direction integer:
  - `0`: Left
  - `1`: Right
  - `2`: Up
  - `3`: Down
- **`origin`**: Note origin type for `IgnoredNote` hidden elements:
  - `0`: HoldMid
  - `1`: HoldStart
  - `2`: HoldEnd
- **`skip`**: Calculated lane position for Skip steps interpolated between non-skipped neighbors.
- **`group` / `parent_layer`**: Reference string to layer (`g<layer_name>`) or sublayer (`s<sublayer_id>`).
- **`marker` & `comment`**: Editor annotations associated with specific notes.

---

### 3.3 Speed Change & Interpolation Engine

Speed changes (`SpeedChange` entities / HI-SPEED multipliers) control the visual timeline scroll velocity and note approach speeds in both the MMW4A editor and the Sonolus runtime engine.

#### 1. SpeedChange Attributes
- **`#BEAT` / `tick`**: The starting beat / tick position of the speed event.
- **`speed`**: The target HI-SPEED multiplier value at that position (e.g. `1.0` = 100% normal speed, `2.0` = 200% speed, `0.5` = 50% speed, negative values for reverse scroll).
- **`interpolation` / `ease`**: Boolean flag specifying the transition mode to the next speed change.

#### 2. Transition Modes

##### A. Constant / Step Mode (`interpolation = false`)
- The scroll speed remains constant at `active.speed` starting from `active.tick` up until the next speed change node.
- At `next.tick`, the speed instantly jumps to `next.speed`.
- **Speed Function**:
  $$\text{speed}(t) = v_{\text{active}}$$

##### B. Linear Interpolation / Lerp Mode (`interpolation = true`)
- The scroll speed continuously ramps from `active.speed` at `active.tick` to `next.speed` at `next.tick`.
- **Interpolation Ratio**:
  $$r = \frac{t - t_{\text{start}}}{t_{\text{end}} - t_{\text{start}}}, \quad r \in [0, 1]$$
- **Speed Function**:
  $$\text{speed}(t) = \text{lerp}(v_{\text{start}}, v_{\text{end}}, r) = v_{\text{start}} + r \times (v_{\text{end}} - v_{\text{start}})$$

#### 3. Timeline Distance & Scroll Position Calculation
The visual distance / position $Y(T)$ of a note or timeline tick $T$ is computed by integrating the speed function over time/ticks from the chart origin:

- **For Step Segments**:
  $$\Delta Y = v_{\text{step}} \times (t_{\text{end}} - t_{\text{start}})$$
- **For Linear Interpolated (Lerp) Segments**:
  $$\Delta Y = \left(\frac{v_{\text{start}} + v_{\text{end}}}{2}\right) \times (t_{\text{end}} - t_{\text{start}})$$
*(Trapezoidal integration representing the exact area under the linear speed curve).*

---

## 4. Building & Running MMW4A

### Prerequisites
- Visual Studio 2022 (with C++ Desktop Workload and MSBuild)
- CMake 3.20+

### Build Command
```powershell
cmake --build build --config Release
```

### Output Executable Path
`x64\Release\MikuMikuWorld.exe`

