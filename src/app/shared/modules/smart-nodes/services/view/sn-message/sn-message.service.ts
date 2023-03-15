import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SnView } from '../../../models';
import * as _ from 'lodash';

@Injectable()
export class SnMessageService {

    private semaphoreSending = 0;
    _messages = new Subject<any>();

    constructor() { }

    runPreventRecursive(action: () => void) {
        this.semaphoreSending++;
        action();
        this.semaphoreSending--;
    }

    _send(cmd: string, snView: SnView, payload: any): void {
        if (this.semaphoreSending === 0) {
            this._messages.next({ cmd, snView, payload });
        }
    }

    _getAll(): Observable<any> {
        return this._messages.asObservable();
    }

    _get(cmd: string, snView: SnView): Observable<any> {
        return this._getAll().pipe(
            filter((res) => res.snView && res.snView.id === snView.id && this._match(cmd, res.cmd)),
            map((res) => {
                if (!res.payload) {
                    return null;
                }
                return Object.assign(res.payload, { cmd: res.cmd, snView: res.snView });
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
