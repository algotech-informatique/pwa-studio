import { LangDto } from '@algotech-ce/core';

export class AppContextmenuActionExtension {
    filter: () => boolean;
    onClick: (event?: any) => void;
    title: string | LangDto[];
    content?: string | LangDto[];
    icon?: string;
}
