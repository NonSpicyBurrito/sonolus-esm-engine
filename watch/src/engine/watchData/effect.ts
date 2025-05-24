import { EffectClipName } from '@sonolus/core'

export const effect = defineEffect({
    clips: {
        stage: EffectClipName.Stage,

        perfect: EffectClipName.Perfect,
        perfect2: 'ESM Perfect 2',
        perfect3: 'ESM Perfect 3',
        perfect4: 'ESM Perfect 4',
        great: EffectClipName.Great,
        good: EffectClipName.Good,
        miss: EffectClipName.Miss,

        hold: EffectClipName.Hold,
        hold2: 'ESM Hold 2',
        hold3: 'ESM Hold 3',
        hold4: 'ESM Hold 4',
        tick: 'ESM Tick',
        tick2: 'ESM Tick 2',
        tick3: 'ESM Tick 3',
        tick4: 'ESM Tick 4',

        perfectAlternative: EffectClipName.PerfectAlternative,
        perfectAlternative2: 'ESM Flick Perfect 2',
        perfectAlternative3: 'ESM Flick Perfect 3',
        perfectAlternative4: 'ESM Flick Perfect 4',
        greatAlternative: EffectClipName.GreatAlternative,
        goodAlternative: EffectClipName.GoodAlternative,
        missAlternative: EffectClipName.MissAlternative,
    },
})

export const sfxDistance = 0.02
