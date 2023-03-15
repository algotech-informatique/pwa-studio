import { SnPageWidgetTypeReturnDto } from '@algotech/core';

export class WidgetTypeDto {
    typeKey: string;
    displayName: string;
    isActive: boolean;
    minHeight: number;
    minWidth: number;
    defaultHeight?: number;
    defaultWidth?: number;
    icon?: string;
    strictParents?: string[];
    returnData?: SnPageWidgetTypeReturnDto[];
    lockAxis?: string[];
    disabledBox?: boolean;
    single?: boolean;
    display: string[];
    unstrictGroup?: boolean;
    hidden?: boolean;
    ungroupable?: boolean;
}
