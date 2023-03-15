import { SnLang } from './sn-lang';
import { SnCanvas } from './sn-canvas';
import { SnDisplayState } from './sn-display-state';

export class SnElement {
    id: string;
    displayName: SnLang[] | string;
    open: boolean;
    canvas: SnCanvas;
    displayState?: SnDisplayState;
    custom?: any;
}
