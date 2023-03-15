import { BehaviorSubject, Observable, ObservableInput, Subject } from 'rxjs';
import {concatMap, switchMap} from 'rxjs/operators';

enum QueueActions {
    RESET = 'RESET',
    ADD = 'ADD',
}

interface QueueCommand {
    action: QueueActions;
    payload?: any;
}

export class ObservableQueue<T> {
    private _commands: Subject<QueueCommand> = new Subject<QueueCommand>();
    private _queues: BehaviorSubject<Subject<ObservableInput<T>>> =
        new BehaviorSubject<Subject<ObservableInput<T>>>(new Subject<ObservableInput<T>>());

    constructor() {
        this._commands.asObservable()
            .subscribe((command) => {
                switch (command && command.action) {
                    case QueueActions.RESET:
                        this._queues.next(new Subject<ObservableInput<T>>());
                        break;
                    case QueueActions.ADD:
                        this._queues.value.next(command.payload);
                        break;
                    default:
                        this._queues.value.error(`[ObservableQueue] unknown command: ${JSON.stringify(command)}`);
                }
            });
    }

    add(item: ObservableInput<T>): this {
        this._commands.next({action: QueueActions.ADD, payload: item});
        return this;
    }

    reset(): this {
        this._commands.next({action: QueueActions.RESET});
        return this;
    }

    asObservable(): Observable<T> {
        return this._queues.asObservable().pipe(
            switchMap(queue =>
                queue.pipe(
                    concatMap(item => item)
                )
            )
        );
    }
}
