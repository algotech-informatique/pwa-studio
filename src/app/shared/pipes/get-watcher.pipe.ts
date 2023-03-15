import { Pipe, PipeTransform } from '@angular/core';
import { WatchersCollectionDto } from '../dtos/watchers-collection.dto';

@Pipe({
    name: 'getWatcher'
})

export class GetWatcherPipe implements PipeTransform {
    constructor() {
    }

    transform(watchers: WatchersCollectionDto[], path: string, viewId: string): any {
        const find = watchers.find((w) => w.viewId === viewId);
        if (!find) {
            return null;
        }
        return find.watchers.find((w) => w.key === path);
    }
}
