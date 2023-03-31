import { SnVersionDto, SnViewType } from '@algotech-ce/core';

export class VersionEventDto {
    type: 'select' | 'add' | 'remove';
    version: SnVersionDto | SnViewType;
}
