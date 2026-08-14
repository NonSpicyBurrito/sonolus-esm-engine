import { Note } from './Note'

export class IgnoredNote extends Note {
    spawnOrder() {
        return 999999
    }

    shouldSpawn() {
        return false
    }
}
