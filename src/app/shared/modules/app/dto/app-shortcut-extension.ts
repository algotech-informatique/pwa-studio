import { LangDto } from '@algotech-ce/core';

export class AppShortCutExtension {
    filter: () => boolean;
    onShortCut: () => void;
    key: string;
    altKey?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
}
