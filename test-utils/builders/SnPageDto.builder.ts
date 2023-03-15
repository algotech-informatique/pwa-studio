import {
    LangDto, SnCanvasDto, SnPageDto,
    SnPageEventDto, SnPageEventPipeDto,
    SnPageVariableDto, SnPageWidgetDto
} from '@algotech/core';
import { MockBuilder } from './MockBuilder';

export class SnPageDtoBuilder extends MockBuilder<SnPageDto> {
    constructor(
        private id: string = '1234',
        private css: any = {},
        private icon: string = 'home',
        private displayName: LangDto[] = [{ lang: 'fr', value: 'Page A' }],
        private canvas: SnCanvasDto = { x: 0, y: 0 },
        private securityGroups: string[] = ['admin'],
        private widgets: SnPageWidgetDto[] = [],
        private variables: SnPageVariableDto[] = [],
        private dataSources: SnPageEventPipeDto[] = [],
        private events: SnPageEventDto[] = [],
        private main: boolean = true,
        private displayState: any = {},
        private custom: any = {},
        private pageHeight: number = 800,
        private pageWidth: number = 800
    ) { super(); }

    withId(id: string): SnPageDtoBuilder {
        this.id = id;
        return this;
    }

    withWidgets(widgets: SnPageWidgetDto[]): SnPageDtoBuilder {
        this.widgets = widgets;
        return this;
    }

    withCanvas(canvas: SnCanvasDto): SnPageDtoBuilder {
        this.canvas = canvas;
        return this;
    }

    withDimensions(dimensions: { width: number; height: number}): SnPageDtoBuilder {
        this.pageHeight = dimensions.height;
        this.pageWidth = dimensions.width;
        return this;
    }
}
