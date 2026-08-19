import { archetypes } from '..'
import { getOpacity } from '../../../../../../shared/src/engine/data/hiderSegment'
import { Hider } from './Hider'

export class ConnectorHider extends Hider {
    getHead() {
        return archetypes.TimeScaleGroup.import.get(this.import.group).headConnectorHider
    }

    updateSequential() {
        archetypes.TimeScaleGroup.sharedMemory.get(this.import.group).connectorOpacity = getOpacity(
            time.now,
            this.sharedMemory,
        )
    }
}
