import { SnPageWidgetDto } from "@algotech-ce/core";

export class ListItem {
    key: string;
    value: string;
    icon?: string;
    order?: number;
    color?: string;
    element?: SnPageWidgetDto;
}
