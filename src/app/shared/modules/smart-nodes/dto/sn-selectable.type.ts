import { SnElement, SnNode, SnConnector, SnParam } from '../models';

export type SnSelectionType = 'group' | 'box' | 'node' | 'param' | 'link' | 'flow';

export class SnSelectionEvent {
    element: SnElement | SnNode | SnConnector | SnParam;
    type: SnSelectionType;
    ignoreUnselect?: boolean;
    rightClickMode?: boolean;
}
