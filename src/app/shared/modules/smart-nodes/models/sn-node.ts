import { SnElement } from './sn-element';
import { SnFlow } from './sn-flow';
import { SnParam } from './sn-param';
import { SnSection } from './sn-section';

export class SnNode extends SnElement {
    key?: string;
    parentId?: string;
    icon: string;
    type: string;
    flowsEditable?: boolean;
    flows: SnFlow[];
    params: SnParam[];
    sections: SnSection[];
    expanded?: boolean;
}
