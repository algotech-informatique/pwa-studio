import { SmartObjectDto } from '@algotech-ce/core';

export class DataExplorerModel {
    key: string;
    caption: string;
    value?: string;
    icons: string[];
    hasChilds?: boolean;
    childs: DataExplorerModel[];
    selectable?: boolean;
    error?: boolean;
    select?: boolean;
    open?: boolean;
    information?: string;
    link?: string;
    style?: {
        color?: string;
        fontSize?: number;
        bold?: boolean;
    };
    smartobjects?: SmartObjectDto[];
    data?: any;
    path?: string;
}
