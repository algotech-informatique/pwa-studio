import { SnGroup } from './sn-group';
import { SnBox } from './sn-box';
import { SnNode } from './sn-node';
import { SnComment } from './sn-comment';

export class SnView {
    id: string;
    groups: SnGroup[];
    box: SnBox[];
    nodes: SnNode[];
    comments: SnComment[];
    drawing: any;
    options?: any;
    displayState?: any;
}
