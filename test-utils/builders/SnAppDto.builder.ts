import { SnAppDto, SnPageDto } from '@algotech/core';
import { MockBuilder } from './MockBuilder';

export class SnAppDtoBuilder extends MockBuilder<SnAppDto> {
    constructor(
        private id: string = 'aaa',
        private environment: 'web' | 'mobile' = 'web',
        private pages: SnPageDto[] = [],
        private icon: string = 'fa-solid fa-cube',
        private pageHeight: number = 800,
        private pageWidth: number = 800,
        private securityGroups: string[] = [],
        ) { super(); }

    withPages(pages: SnPageDto[]): SnAppDtoBuilder {
        this.pages = pages;
        return this;
    }
}
