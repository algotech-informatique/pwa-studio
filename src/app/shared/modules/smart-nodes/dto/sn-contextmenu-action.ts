import { SnContextmenu } from './sn-contextmenu';
import { SnLang } from '../models/sn-lang';

export class SnContextmenuAction {
    id: string;
    title: string | SnLang[];
    icon?: string;
    content?: string | SnLang[];
    subActions?: SnContextmenu;
    selected?: boolean;
    disabled?: boolean;
    onClick?: (event?: any) => void;
}
