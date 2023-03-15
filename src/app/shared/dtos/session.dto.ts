import { ConnectionDto } from './connection.dto';
import { EnvironmentDisplayDto } from './environment.dto';
import { DatasDto } from './datas.dto';

export class SessionDto {
    connection: ConnectionDto;
    environment: EnvironmentDisplayDto;
    datas: DatasDto;
}
