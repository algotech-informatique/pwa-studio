import { WorkflowModelDto } from '@algotech-ce/core';
import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { WatcherService } from '../../services/watcher/watcher.service';
import { DataExplorerModel } from '../data-explorer/data-explorer.model';
import * as _ from 'lodash';
import { Clipboard } from '@angular/cdk/clipboard';
import { SoUtilsService } from '@algotech-ce/business';
import { SessionsService, ToastService } from '../../services';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-data-explorer',
    templateUrl: './data-explorer.component.html',
    styleUrls: ['./data-explorer.component.scss']
})
export class DataExplorerComponent {

    @Input()
    tree: DataExplorerModel[] = [];

    @Input()
    workflow: WorkflowModelDto;

    @Input()
    actions: ('clipboard' | 'watcher')[] = [];

    @Output()
    selected = new EventEmitter<any>();

    @Output()
    clicked = new EventEmitter<any>();

    constructor(
        public watcherService: WatcherService,
        private sessionService: SessionsService,
        private soUtils: SoUtilsService,
        private clipboard: Clipboard,
        private toastService: ToastService,
        private translateService: TranslateService,
        private elementRef: ElementRef) { }

    onSelect(event) {
        this.selected.emit(event);
    }

    onClick(event) {
        this.clicked.emit(event);
    }

    clickNode(node: DataExplorerModel) {
        if (node.selectable) {
            if (node.select) {
                node.open = !node.open;
            } else {
                for (const aNode of this.tree) {
                    aNode.select = false;
                }
                node.select = true;
                if (node) {
                    this.selected.emit(node);
                }
            }
        } else {
            node.open = !node.open;
        }

        this.clicked.emit(node);
    }

    addFavorite($event, node: DataExplorerModel) {
        this.watcherService.addWatchedVariable(this.workflow.viewId, { key: node.path, type: node.data.type });
        $event.stopPropagation();
    }

    removeFavorite($event, node: DataExplorerModel) {
        this.watcherService.removeWatchedVariable(this.workflow.viewId, node.path);
        $event.stopPropagation();
    }

    clickClipboard($event, node: DataExplorerModel) {
        if (!node.data) {
            return ;
        }
        if (this.soUtils.typeIsSmartObject(node.data.type) && node.smartobjects) {
            const smartobjects = (Array.isArray(node.data.value) ? node.data.value : [node.data.value])
                .map((v) => _.isString(v) ? node.smartobjects.find((so) => so.uuid === v) : v);

            const value = this.soUtils.buildJson(smartobjects, node.smartobjects, this.sessionService.active.datas.read.smartModels, {});
            this.clipboard.copy(JSON.stringify(!Array.isArray(node.data.value) ? value[0] : value));
        } else {
            this.clipboard.copy(JSON.stringify(node.data.value));
        }

        this.toastService.addToast('info', '', this.translateService.instant('TOAST-MESSAGE.COPY-CLIPBOARD'), 2000);
        $event.stopPropagation();
    }

}
