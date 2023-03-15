import { EnvironmentDisplayDto, ModuleTreeLineDto } from 'src/app/shared/dtos';
import { MockBuilder } from './MockBuilder';

export class EnvironmentDisplayDtoBuilder extends MockBuilder<EnvironmentDisplayDto> {
    constructor(
        private host: string = 'host',
        private customerKey: string = 'customerKey',
        private name: string = 'my-env',
        private modules: ModuleTreeLineDto[] = [],
        private state: boolean = true
    ){ super(); }
}
