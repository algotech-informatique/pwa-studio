import { SnFlow, SnParam, SnSection, SnLang } from '../models';

export class SnNodeSchema {
    key?: string;
    displayName: SnLang[] | string;
    icon: string;
    type: string;
    flowsEditable?: boolean;
    flows: SnFlow[];
    params: SnParam[];
    sections: SnSection[];
    custom?: any;
    deprecated?: boolean;
}
