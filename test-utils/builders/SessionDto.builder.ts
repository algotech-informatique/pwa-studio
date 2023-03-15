import { ConnectionDto, DatasDto, EnvironmentDisplayDto, SessionDto } from 'src/app/shared/dtos';
import { MockBuilder } from 'test-utils/builders/MockBuilder';
import { ConnectionDtoBuilder, EnvironmentDisplayDtoBuilder } from '.';

export class SessionDtoBuilder extends MockBuilder<SessionDto> {
    constructor(
        private connection: ConnectionDto = new ConnectionDtoBuilder().build(),
        private environment: EnvironmentDisplayDto = new EnvironmentDisplayDtoBuilder().build(),
        private datas: DatasDto = null
    ) { super(); }

    withDatas(datas: DatasDto): SessionDtoBuilder {
        this.datas = datas;
        return this;
    }
}
