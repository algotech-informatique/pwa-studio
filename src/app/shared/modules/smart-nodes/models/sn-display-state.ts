import { SnInputItem } from './sn-input-item';
import { SnItem } from './sn-pair';

export class SnDisplayState {
    placeHolder?: string;
    headerColor?: string;
    hidden?: boolean;
    active?: boolean;
    bringToFront?: boolean;
    dragHover?: boolean;
    droppable?: boolean;
    error?: any;
    search?: boolean;
    searchActive?: boolean;
    warning?: boolean;
    info?: boolean;
    selected?: boolean;
    selectedLink?: boolean;
    connected?: boolean;
    edit?: boolean;
    items?: SnItem[];
    icons?: {
        position?: 'left' | 'right';
        color?: string;
        icon: string;
    }[];
    style?: string;
    listItems?: SnInputItem[];
}
