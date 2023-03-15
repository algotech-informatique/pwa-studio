import { Injectable } from '@angular/core';
import { WorkflowDataDto } from '@algotech/core';
import * as _ from 'lodash';
import { MessageService } from '../message/message.service';
import { Subject } from 'rxjs';
import { WatchersCollectionDto } from '../../dtos/watchers-collection.dto';
import { WatcherDto } from '../../dtos/watchers.dto';

@Injectable()
export class WatcherService {

    watchers: WatchersCollectionDto[] = [];
    private subject = new Subject();

    constructor(
        private messageService: MessageService,
    ) { }

    addWatchedVariable(viewId: string, watcher: WatcherDto, withIndice?: boolean) {
        const find = this.getWatchersByViewId(viewId);
        if (find) {
            if (withIndice) {
                Object.assign(watcher, { indice: this.findIndice(find.watchers) });
            }
            find.watchers.push(watcher);
        } else {
            if (withIndice) {
                Object.assign(watcher, { indice: 0 });
            }
            this.watchers.push({
                viewId,
                watchers: [watcher]
            });
        }

        this.watchers = [...this.watchers];
        this.notify();
    }

    findIndice(watchers: WatcherDto[]) {
        const filter = watchers.filter((w) => w.indice != null);
        return filter.length === 0 ? 0 : _.max(filter.map((w) => w.indice)) + 1;
    }

    getWatchersByViewId(uuid: string) {
        return this.watchers.find((w) => w.viewId === uuid);
    }

    removeWatchedVariable(viewId: string, path) {
        const find = this.getWatchersByViewId(viewId);
        if (!find) {
            throw new Error('workflow not found');
        }
        _.remove(find.watchers, (v) => v.key === path);

        this.watchers = [...this.watchers];
        this.notify();
    }

    onUpdate() {
        return this.subject.asObservable();
    }

    notify() {
        this.subject.next(null);
        this.messageService.send('save.preferences', {});
    }
}
