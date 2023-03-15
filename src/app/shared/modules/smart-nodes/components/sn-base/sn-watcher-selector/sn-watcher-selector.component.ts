import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { WatcherService } from '../../../../../services';
import { SnNode, SnParam, SnSection, SnView } from '../../../models';

@Component({
    selector: 'sn-watcher-selector',
    template: `
    <div class="debug" [ngClass]="{'watch': watcherService.watchers | getWatcher: key: snView.id}">
        <div class="icons">
            <i class="fa-solid fa-video icon" (click)="watch($event)"></i>
        </div>
        <span class="indice">
            {{(watcherService.watchers | getWatcher: key: snView.id)?.indice}}
        </span>
    </div>`,
    styleUrls: ['./sn-watcher-selector.component.scss']
})

export class SnWatcherSelectorComponent {
    @Input() snView: SnView;
    @Input() node: SnNode;
    @Input() key: string;
    @Input() types: string|string[];

    constructor(public watcherService: WatcherService) { }

    watch($event) {
        const watchers = this.watcherService.getWatchersByViewId(this.snView.id);
        if (!watchers?.watchers.some((w) => w.key === this.key)) {
            this.watcherService.addWatchedVariable(this.snView.id, {
                type: Array.isArray(this.types) ? 'any' : this.types as string,
                key: this.key,
                nodeId: this.node.id,
            }, true);
        } else {
            this.watcherService.removeWatchedVariable(this.snView.id, this.key);
        }
        $event.stopPropagation();
    }
}
