import { SessionDto } from 'src/app/shared/dtos';
import { SessionDtoBuilder, DatasDtoBuilder, EnvironmentDtoBuilder } from 'test-utils/builders';
import { SocketManagerMock } from 'test-utils/mocks/socket-manager.service.mock';
import { environmentDtoFixture } from './EnvironmentDto.fixture';
import { machineModelFixture, civilizationModelFixture } from './smart-models';
import * as _ from 'lodash';

export class FixtureFactory {
    public static createSessionDto(): SessionDto {
        return this.clone(
            new SessionDtoBuilder()
                .withDatas(
                    new DatasDtoBuilder()
                        .withSocket(new SocketManagerMock())
                        .withEnvironment(new EnvironmentDtoBuilder().from(environmentDtoFixture).build())
                        .withSmartModels(machineModelFixture, civilizationModelFixture)
                        .build()
                ).build()
        );
    }

    /**
     * If fixtures are not cloned, sometimes tests will modify them and influence other tests results.
     * Only the top level object needs to be cloned, as it is deep cloned, sub-fixtures will be cloned as well.
     */
    private static clone<T>(fixture: T): T {
        return _.cloneDeep(fixture) as T;
    }
}
