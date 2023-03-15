import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class MessageService {

    _messages = new Subject<any>();

    constructor() { }

    send(cmd: string, payload: any): void {
        this._messages.next({ cmd, payload });
    }

    getAll(): Observable<any> {
        return this._messages.asObservable();
    }

    get(cmd: string): Observable<any> {
        return this.getAll().pipe(
            filter((res) => this._match(cmd, res.cmd)),
            map((res) => res.payload),
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
