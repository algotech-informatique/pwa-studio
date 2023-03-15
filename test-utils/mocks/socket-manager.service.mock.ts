import { WsUserDto } from '@algotech/core';
import { ReplaySubject, Observable, Subject } from 'rxjs';
import { SocketManager } from '../../src/app/shared/services';

export class SocketManagerMock extends SocketManager {
    public start(url: string, token: string, userId: string) {
        return;
    }

    public send(event: string, data: any, queue = false) {
        return;
    }

    public close() {
        return;
    }
}
