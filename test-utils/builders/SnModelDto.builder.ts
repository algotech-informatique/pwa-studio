import { SnModelDto, SnPageDto, SnVersionDto } from '@algotech/core';
import { MockBuilder } from './MockBuilder';
import { SnAppDtoBuilder } from './SnAppDto.builder';
import { SnVersionDtoBuilder } from './SnVersionDto.builder';

export class SnModelDtoBuilder extends MockBuilder<SnModelDto> {
    constructor(
        private key: string = 'test',
        private displayName: string[] = [],
        private type: string = 'app',
        private versions: SnVersionDto[] = [],
    ) { super(); }

    withVersions(versions: SnVersionDto[]): SnModelDtoBuilder {
        this.versions = versions;
        return this;
    }

    withPage(page: SnPageDto): SnModelDtoBuilder {
        this.withVersions([new SnVersionDtoBuilder()
            .withApp(
                new SnAppDtoBuilder().withPages([
                    page
                ]).build()
            ).build()
        ]).build();

        return this;
    }
}
