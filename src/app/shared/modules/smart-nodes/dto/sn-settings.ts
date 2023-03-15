import { SnFlow, SnParam, SnLang, SnView } from '../models';
import { SnEntryComponents } from './sn-entry-components';
import { SnCustomFilterConnector } from './sn-custom-filter-connector';
import { SnToolbox } from './sn-toolbox';
import { SnContextmenuActionExtension } from './sn-contextmenu-extension';
import { SnContextmenuAction } from './sn-contextmenu-action';
import { SnRemoveConfirmation } from './sn-remove-confirmation';

export class SnSettings {
    module: string;
    lang?: string;
    languages?: SnLang[];
    theme?: string;
    entryComponents: (snView: SnView) => SnEntryComponents;
    toolBox?: SnToolbox[];
    contextmenus: {
        default?: (SnContextmenuAction|string)[]
        extended: SnContextmenuActionExtension[];
    };
    removeConfirmation?: SnRemoveConfirmation;
    filterFlows?: SnCustomFilterConnector<SnFlow>;
    filterParams?: SnCustomFilterConnector<SnParam>;
    undo?: () => void;
    redo?: () => void;
}
