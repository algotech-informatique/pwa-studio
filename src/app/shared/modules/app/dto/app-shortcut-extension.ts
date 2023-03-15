import { LangDto } from '@algotech/core';

export class AppShortCutExtension {
    filter: () => boolean;
    onShortCut: () => void;
    key: string;
    altKey?: boolean;
    ctrlKey?: boolean;
    shiftKey?: boolean;
}
