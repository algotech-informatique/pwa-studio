import { LangDto } from '@algotech-ce/core';
import { AppContextmenuActionExtension } from './app-contextmenu-extension';
import { AppShortCutExtension } from './app-shortcut-extension';
export class AppSettings {
    languages: LangDto[];
    undo: () => void;
    redo: () => void;
    search: () => void;
    contextmenus: {
        extended: AppContextmenuActionExtension[];
    };
    shortcut: {
        extended: AppShortCutExtension[];
    };
}
