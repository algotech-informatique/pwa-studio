import { SnAppDto, SnVersionDto, SnViewType } from '@algotech-ce/core';
import { MockBuilder } from './MockBuilder';

export class SnVersionDtoBuilder extends MockBuilder<SnVersionDto> {
    constructor(
        private uuid: string = 'aaa',
        private creatorUuid: string = 'bbb',
        private deleted: boolean = false,
        private view: SnViewType = null,
    ) { super(); }

    withApp(app: SnAppDto): SnVersionDtoBuilder {
        this.view = app;
        return this;
    }
}
