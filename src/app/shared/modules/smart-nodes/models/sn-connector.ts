import { SnLang } from './sn-lang';
import { SnDisplayState } from './sn-display-state';

export class SnConnector {
    id?: string;
    key?: string;
    displayName?: SnLang[] | string;
    direction?: 'in' | 'out';
    toward?: string;
    displayState?: SnDisplayState;
    custom?: any;
}
