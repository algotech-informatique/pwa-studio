import { SnPageWidgetDto } from '@algotech-ce/core';

export class AppTemplateCategoryDto {
    key: string;
    displayName: string;
    icon: string;
    platform: ('web' | 'mobile')[];
    subCategories: {
        closed?: boolean;
        colCount: number;
        reverseColor?: boolean;
        displayName: string;
        widgets: SnPageWidgetDto[];
    }[];
}
