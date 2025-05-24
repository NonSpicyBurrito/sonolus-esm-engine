import { archetypes } from '.'
import { particle } from '../particle'
import { skin } from '../skin'
import { stage } from '../stage'

export const scoreSystem = levelData({
    noteCount: Number,
})

export class Initialization extends Archetype {
    import = this.defineImport({
        life: { name: 'life', type: Number },
    })

    preprocessOrder = 3
    preprocess() {
        const targetAspectRatio = 16 / 9

        const h =
            screen.aspectRatio >= targetAspectRatio
                ? screen.h
                : (screen.h * screen.aspectRatio) / targetAspectRatio

        stage.radius = h * 0.825

        const b = -h * 0.5 + stage.radius * 0.095
        const t = b + stage.radius

        stage.center = t

        const transform = Mat.identity.scale(t - b, b - t).translate(0, t)
        skin.transform.set(transform)
        particle.transform.set(transform)

        const step = Math.floor((scoreSystem.noteCount / this.import.life) * 0.4)
        score.base.set({
            perfect: 1,
            great: 0.5,
            good: 0.25,
        })
        score.consecutive.good.set({
            multiplier: 1,
            step,
            cap: step * 5,
        })

        life.initial = this.import.life
        life.max = life.initial

        const gap = 0.05
        const uiRect = safeArea.rect.shrink(gap, gap)

        ui.menu.set({
            anchor: uiRect.rt,
            pivot: { x: 1, y: 1 },
            size: Vec.one.mul(stage.radius * 0.13).mul(ui.configuration.menu.scale),
            rotation: 0,
            alpha: ui.configuration.menu.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: true,
        })

        ui.metric.primary.bar.set({
            anchor: uiRect.rt
                .sub(new Vec(gap, 0))
                .sub(new Vec(stage.radius * 0.13, 0).mul(ui.configuration.menu.scale)),
            pivot: { x: 1, y: 1 },
            size: new Vec(stage.radius * 1.2, 0.15).mul(ui.configuration.metric.primary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.primary.alpha,
            horizontalAlign: HorizontalAlign.Left,
            background: true,
        })
        ui.metric.primary.value.set({
            anchor: uiRect.rt
                .sub(new Vec(gap, 0))
                .sub(new Vec(stage.radius * 0.13, 0).mul(ui.configuration.menu.scale))
                .sub(new Vec(0.035, 0.035).mul(ui.configuration.metric.primary.scale)),
            pivot: { x: 1, y: 1 },
            size: new Vec(0, 0.08).mul(ui.configuration.metric.primary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.primary.alpha,
            horizontalAlign: HorizontalAlign.Right,
            background: false,
        })

        ui.metric.secondary.bar.set({
            anchor: uiRect.lt,
            pivot: { x: 0, y: 1 },
            size: new Vec(stage.radius * 0.65, 0.15).mul(ui.configuration.metric.secondary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.secondary.alpha,
            horizontalAlign: HorizontalAlign.Left,
            background: true,
        })
        ui.metric.secondary.value.set({
            anchor: uiRect.lt.add(
                new Vec(stage.radius * 0.65 - 0.035, -0.035).mul(
                    ui.configuration.metric.secondary.scale,
                ),
            ),
            pivot: { x: 1, y: 1 },
            size: new Vec(0, 0.08).mul(ui.configuration.metric.secondary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.secondary.alpha,
            horizontalAlign: HorizontalAlign.Right,
            background: false,
        })

        ui.combo.value.set({
            anchor: { x: stage.radius * 0.825, y: Math.lerp(t, b, 0.14) },
            pivot: { x: 0.5, y: 0.15 },
            size: new Vec(0, stage.radius * 0.09).mul(ui.configuration.combo.scale),
            rotation: 0,
            alpha: ui.configuration.combo.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: false,
        })
        ui.combo.text.set({
            anchor: { x: stage.radius * 0.825, y: Math.lerp(t, b, 0.14) },
            pivot: { x: 0.5, y: 2.15 },
            size: new Vec(0, stage.radius * 0.03).mul(ui.configuration.combo.scale),
            rotation: 0,
            alpha: ui.configuration.combo.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: false,
        })

        ui.judgment.set({
            anchor: { x: 0, y: Math.lerp(t, b, 0.62) },
            pivot: { x: 0.5, y: 0.5 },
            size: new Vec(0, stage.radius * 0.06).mul(ui.configuration.judgment.scale),
            rotation: 0,
            alpha: ui.configuration.judgment.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: false,
        })

        ui.progress.bar.set({
            anchor: uiRect.lb,
            pivot: { x: 0, y: 0 },
            size: { x: uiRect.w, y: 0.15 * ui.configuration.progress.scale },
            rotation: 0,
            alpha: ui.configuration.progress.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: true,
        })
        ui.progress.graph.set({
            anchor: uiRect.lb
                .add(new Vec(0, gap))
                .add(new Vec(0, 0.15 * ui.configuration.progress.scale)),
            pivot: { x: 0, y: 0 },
            size: { x: uiRect.w, y: 0.3 * ui.configuration.progress.scale },
            rotation: 0,
            alpha: ui.configuration.progress.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: true,
        })

        for (const archetype of Object.values(archetypes)) {
            if (!('globalPreprocess' in archetype)) continue

            archetype.globalPreprocess()
        }
    }
}
