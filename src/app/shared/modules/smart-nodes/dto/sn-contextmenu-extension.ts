import { SnSelectionEvent } from './sn-selectable.type';
import { SnLang } from '../models';

export class SnContextmenuActionExtension {
    filter: (selections: SnSelectionEvent[]) => boolean;
    onClick: (selections: SnSelectionEvent[]) => void;
    title: string | SnLang[];
    icon?: string;
}
