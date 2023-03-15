import { SnVersionDto, SnViewType } from '@algotech/core';

export class VersionEventDto {
    type: 'select' | 'add' | 'remove';
    version: SnVersionDto | SnViewType;
}
