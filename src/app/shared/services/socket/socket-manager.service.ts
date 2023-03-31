import websocketConnect from 'rxjs-websockets';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import * as _ from 'lodash';
import { PairDto, WsUserDto } from '@algotech-ce/core';
import { ObservableQueue } from '../rxjs/observable-queue';
import { catchError, timeout } from 'rxjs/operators';

export class SocketManager {


    public input: ReplaySubject<string>;
    public messages: Observable<string>;
    public messageListeners: { pattern: string; executor: (data) => any }[] = [];
    public uniqueUsers = new Subject<WsUserDto[]>();
    public onDisconnect = new Subject();
    public onConnect = new Subject();

    private connectionStatusSubscription;
    private messagesSubscription;
    private _users: WsUserDto[] = [];
    private userId: string;
    private timeout;
    private connect = false;

    private cbKey = '.ack';
    private queue = new ObservableQueue();
    private read: PairDto[] = [];

    constructor() {
        this.queue.asObservable().subscribe();
    }

    //
    get users(): WsUserDto[] {
        return this._users;
    }

    public start(url: string, token: string, userId: string) {
        this.queue.reset();
        this.userId = userId;
        if (this.connect) {
            return;
        }

        this.input = new ReplaySubject<string>();
        const { messages, connectionStatus } = websocketConnect(`${url}?jwt=${token}`, this.input);
        this.messages = messages;

        // the connectionStatus stream will provides the current number of websocket
        // connections immediately to each new observer and updates as it changes
        this.connectionStatusSubscription = connectionStatus.subscribe(numberConnected => {
            if (numberConnected === 1) {
                this.setTimeout();
                this.onConnect.next(null);
                this.connect = true;
            }

            if (this.connect && numberConnected === 0) {
                this.onDisconnect.next(null);
                this.close();
            }
        });

        // try to reconnect every second
        this.messagesSubscription = messages.subscribe(message => {
                let json = JSON.parse(message);
                if (json._isScalar) {
                    json = json.value;
                }

                // receipt
                const read = this.read.find((p) => `${p.key}${this.cbKey}` === json.event);
                if (read) {
                    read.value.next({});
                    read.value.complete();
                }

                if (json && json.event && json.data) {
                    // Récupération users
                    if (json.event === 'ws.initialize') {
                        this._users.splice(0, this._users.length);
                        Array.from(json.data).forEach(
                            (user: WsUserDto) => {
                                this._users.push(user);
                            });
                        this.uniqueUsers.next(this.getUniqueUsers());
                    } else if (json.event === 'ws.user.add') {
                        this._users.push(json.data);
                        this.uniqueUsers.next(this.getUniqueUsers());
                    } else if (json.event === 'ws.user.rm' && json.data && json.data.color) {
                        const index = _.findIndex(this._users, (user) => user.color === json.data.color);
                        if (index > -1) {
                            this._users.splice(index, 1);
                            this.uniqueUsers.next(this.getUniqueUsers());
                        }
                    } else {
                        _.forEach(this.messageListeners, (ml) => {
                            if (json.event === ml.pattern) {

                                ml.executor(json.data);
                            }
                        });
                    }
                }
            }, () => {
                this.onDisconnect.next(null);
                this.close();
            });

    }

    public send(event: string, data: any, queue = false) {
        if (!queue) {
            this.input.next(JSON.stringify({ event, data }));
            return;
        }

        this.queue.add(
            new Observable((observer) => {
                this.input.next(JSON.stringify({ event, data }));
                const read = this.read.find((p) => p.key === event);
                if (!read) {
                    this.read.push({
                        key: event,
                        value: observer, // complete when socket return
                    });
                } else {
                    read.value = observer;
                }
            }).pipe(
                timeout(20000), // no response after 20s without cb,
                catchError(error => {
                    this.queue.reset();
                    this.onDisconnect.next(null);
                    this.close();
                    return error;
                })
            )
        );
    }

    public getUniqueUsers(): WsUserDto[] {
        const _wsUsers = _.filter(this._users, u => u.uuid !== this.userId);
        return _.uniqBy(_wsUsers, 'uuid');
    }

    private setTimeout() {
        // send a message (each 5 minutes) to force the user to stay active
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.input.next(JSON.stringify({ event: `event.message`, data: {} }));
            this.setTimeout();
        }, 300000);
    }

    public close() {
        if (!this.connect) {
            return;
        }

        clearTimeout(this.timeout);
        this.connect = false;

        this._users.splice(0, this._users.length);
        this.messagesSubscription.unsubscribe();
        this.connectionStatusSubscription.unsubscribe();
    }
}
