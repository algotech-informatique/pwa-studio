import { LangDto } from '@algotech/core';

export class AppContextmenuActionExtension {
    filter: () => boolean;
    onClick: (event?: any) => void;
    title: string | LangDto[];
    content?: string | LangDto[];
    icon?: string;
}
