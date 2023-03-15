import { SnCanvas } from './sn-canvas';
import { SnDisplayState } from './sn-display-state';
import { LangDto } from '@algotech/core';

export class SnComment {
    id: string;
    parentId?: string;
    open: boolean;
    comment?: LangDto[] | string;
    canvas: SnCanvas;
    displayState?: SnDisplayState;
}
