import {
    SnPageBoxDto, SnPageEventDto, SnPageWidgetDto,
    SnPageWidgetGroupDto, SnPageWidgetRuleDto
} from '@algotech/core';
import { MockBuilder } from './MockBuilder';

export class SnPageWidgetDtoBuilder extends MockBuilder<SnPageWidgetDto> {
    constructor(
        private id: string = '1234',
        private typeKey = null,
        private name: string = '',
        private box: SnPageBoxDto = null,
        private group: SnPageWidgetGroupDto = null,
        private isActive: boolean = true,
        private events: SnPageEventDto[] = [],
        private rules: SnPageWidgetRuleDto[] = [],
        private css: any = null,
        private custom: any = null,
        private displayState: any = null,
    ) { super(); }

    withId(id: string): SnPageWidgetDtoBuilder {
        this.id = id;
        return this;
    }

    withName(name: string): SnPageWidgetDtoBuilder {
        this.name = name;
        return this;
    }

    withBox(box: SnPageBoxDto): SnPageWidgetDtoBuilder {
        this.box = box;
        return this;
    }

    withGroup(widgets: SnPageWidgetDto[]): SnPageWidgetDtoBuilder {
        this.group = {
            widgets,
        };
        return this;
    }
}
