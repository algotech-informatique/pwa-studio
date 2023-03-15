import { SnLang } from '../models';

export class SnToolbox {
    id: string;
    icon: string;
    color?: string;
    displayName: string | SnLang[];
    description?: string | SnLang[];
    type: 'direct' | 'svg';
    subItems?: SnToolbox[];
    disabled?: boolean;
    separator?: boolean;
    onClick?: (event?: any) => void;

    item?: {
        deletable?: boolean;
        icons?: {
            position: 'top' | 'bottom';
            color: string;
            iconName: string;
        }[],
        noHideOnClick?: boolean;
        onDelete?: (event?: any) => void;
    };
}
