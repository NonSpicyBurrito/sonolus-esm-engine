import { createBucketDefinition } from '../../../../shared/src/engine/data/buckets'
import { skin } from './skin'

export const buckets = defineBuckets(createBucketDefinition(skin.sprites))
