import { ConnectionDto } from '../../src/app/shared/dtos';
import { MockBuilder } from './MockBuilder';

export class ConnectionDtoBuilder extends MockBuilder<ConnectionDto> {
    constructor(
        private host: string = 'host',
        private customerKey: string = 'customerKey',
        private login: string = 'testuser',
        private uuid: string = '0001',
        private name: string = 'connection name',
        private socketHost: string = 'ws://websocket.com',
        private password: string = 'azerty',
        private apiKey: string = 'jwtstring',
        private color: string = '#111111'
    ) { super(); }
}
