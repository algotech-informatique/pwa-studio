import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { SnAppDto } from '@algotech-ce/core';

@Injectable()
export class AppMessageService {

    _messages = new Subject<any>();

    constructor() { }

    _send(cmd: string, app: SnAppDto, payload: any): void {
        this._messages.next({ cmd, app: _.cloneDeep(app), payload });
    }

    _getAll(): Observable<any> {
        return this._messages.asObservable();
    }

    _get(cmd: string, app: SnAppDto): Observable<any> {
        return this._getAll().pipe(
            filter((res) => res.app && res.app.id === app.id && this._match(cmd, res.cmd)),
            map((res) => {
                if (!res.payload) {
                    return null;
                }
                return Object.assign(res.payload, { cmd: res.cmd, app: res.app });
            }),
        );
    }

    _match(regex, pattern): boolean {
        const regRes = pattern.match(new RegExp(regex));
        if (regRes === null) {
            return false;
        }
        return Array.isArray(regRes) && regRes.length > 0 && regRes[0] !== '';
    }
}
