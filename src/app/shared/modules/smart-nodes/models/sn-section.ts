import { SnLang } from './sn-lang';
import { SnParam } from './sn-param';

export class SnSection {
    id?: string;
    displayName: SnLang[] | string;
    key: string;
    editable: boolean;
    open: boolean;
    hidden?: boolean;
    params: SnParam[];
}
