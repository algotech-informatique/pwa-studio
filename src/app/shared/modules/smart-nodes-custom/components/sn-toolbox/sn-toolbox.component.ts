import { SnModelDto, SnViewDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnDestroy, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { DatasService, CheckService, SessionsService, SnModelsService, ToastService, UndoRedoService } from '../../../../services';
import { SnToolbox } from '../../../smart-nodes/dto';
import { SnBox, SnElement, SnNode, SnView } from '../../../smart-nodes/models';
import { SnActionsService, SnSelectionService, SnUtilsService } from '../../../smart-nodes/services';
import { StudioHelper } from '../../helper/helper.service';
import { SnPublishFlowService } from '../../service/sn-publish/sn-publish-flow/sn-publish-flow.service';
import { SnPublishModelService } from '../../service/sn-publish/sn-publish-model/sn-publish-model.service';

@Component({
    selector: 'sn-toolbox',
    templateUrl: './sn-toolbox.component.html',
    styleUrls: ['./sn-toolbox.component.scss'],
})
export class SnToolboxComponent implements OnDestroy, OnChanges {

    @Input() snModel: SnModelDto;
    @Input() snView: SnView;
    @Input() customerKey: string;
    @Input() host: string;

    @Output()
    runDebug = new EventEmitter();
    @Output()
    stopDebug = new EventEmitter();
    @Output()
    shared = new EventEmitter();

    @Output()
    viewChanged = new EventEmitter<SnView>();

    @Output()
    runHelper = new EventEmitter(); // TODO to be removed when helper development is done

    loaded = false;
    canUndo = false;
    canRedo = false;
    canPublish = true;
    debug = false;
    collapse = false;

    history: SnToolbox[] = [];

    subscription: Subscription;
    selection: Subscription;

    constructor(
        private snModelsService: SnModelsService,
        private sessionsService: SessionsService,
        private datasService: DatasService,
        private undoRedoService: UndoRedoService,
        private toastService: ToastService,
        private translateService: TranslateService,
        private checkService: CheckService,
        private snActions: SnActionsService,
        private snPublishModel: SnPublishModelService,
        private snPublishFlow: SnPublishFlowService,
        private snUtils: SnUtilsService,
        private ref: ChangeDetectorRef,
        public helper: StudioHelper
    ) {
        this.subscription = this.undoRedoService.stackChange.subscribe((data: { uuid: string; host: string; customerKey: string }) => {
            if (this.snModel.uuid === data.uuid && this.host === data.host && this.customerKey === data.customerKey) {
                this.canUndo = this.undoRedoService.canUndo(this.snModel, this.host, this.customerKey);
                this.canRedo = this.undoRedoService.canRedo(this.snModel, this.host, this.customerKey);
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if (this.selection) {
            this.selection.unsubscribe();
        }
    }

    ngOnChanges() {
        this.loaded = false;
        this.ref.detectChanges();

        this.debug = false;
        this.canUndo = this.undoRedoService.canUndo(this.snModel, this.host, this.customerKey);
        this.canRedo = this.undoRedoService.canRedo(this.snModel, this.host, this.customerKey);
        this.collapse = this.snUtils.nodesExpanded(this.snView.nodes as SnNode[]);

        this.loaded = true;
        this.ref.detectChanges();
    }

    onViewChanged(snView: SnView) {
        this.viewChanged.emit(snView);
    }

    launchEvent(event) {
        event.onClick(event);
    }

    onUndo() {
        this.datasService.undo(this.snModel, this.customerKey, this.host);
    }

    onRedo() {
        this.datasService.redo(this.snModel, this.customerKey, this.host);
    }

    onRunDebug() {
        this.debug = true;
        this.runDebug.emit();
    }

    onStopDebug() {
        this.debug = false;
        this.stopDebug.emit();
    }

    onPublish() {
        // Check graph validity
        this.checkService.dosnViewCheck((this.snModel.type === 'smartflow') ? 'SF' :
            (this.snModel.type === 'workflow') ? 'WF' : 'SM', 'onPublish').subscribe((errors) => {
                if (!errors) {
                    this.canPublish = false;

                    const publish$: Observable<any> = this.snModel.type === 'smartmodel' ?
                        this.snPublishModel.publish(this.snView, this.customerKey, this.host) :
                        this.snPublishFlow.publish(this.snView, this.snModel, this.host, this.customerKey,
                            this.sessionsService.active.datas.read.customer.languages);

                    publish$.subscribe((res: boolean) => {
                        if (res === false) {
                            this.toastService.addToast('info', this.translateService.instant('NOTHING-TO-PUBLISH'), null, 2000);
                        }

                        if (res) {
                            const title = `${this.snModel.type.toUpperCase()}-PUBLISHED`;
                            this.toastService.addToast('success', this.translateService.instant(title), null, 2000);
                            this.sessionsService.refreshEnv();
                        }
                        this.canPublish = true;
                    }, (e) => {
                        this.toastService.addToast('error',
                            this.translateService.instant('ERROR-MESSAGE', { error: e.message }), null, 2000);
                        this.canPublish = true;
                    });
                } else {
                    this.addToastError(this.snModel, this.checkService.getReport((this.snModel.type === 'smartflow') ? 'SF' :
                        (this.snModel.type === 'workflow') ? 'WF' : 'SM', this.snModel.uuid));
                }
            });
    }

    onCheck() {
        // Check graph validity
        this.checkService.dosnViewCheck((this.snModel.type === 'smartflow') ? 'SF' :
            (this.snModel.type === 'workflow') ? 'WF' : 'SM', 'onCheck').subscribe((errors) => {
                if (!errors) {
                    const title = `${this.snModel.type.toUpperCase()}-CORRECT`;
                    this.toastService.addToast('success', this.translateService.instant(title), null, 2000);
                } else {
                    this.addToastError(this.snModel, this.checkService.getReport((this.snModel.type === 'smartflow') ? 'SF' :
                        (this.snModel.type === 'workflow') ? 'WF' : 'SM', this.snModel.uuid));
                }
            });
    }

    onCollapse() {
        this.snActions.expandNodes(this.snView);
        this.collapse = this.snUtils.nodesExpanded(this.snView.nodes as SnNode[]);
    }

    onShare() {
        this.shared.emit();
    }

    onAddNode() {
        this.snActions.notifyClickEvent(this.snView, {
            onClick: (coordinates) => {
                const mainObject: SnElement = this.getParent(this.snView, coordinates, 'node');
                this.snActions.createNewNodeFromScratch(this.snView, mainObject, coordinates);
            }
        });
    }

    onAddGroup() {
        this.snActions.notifyClickEvent(this.snView, {
            onClick: (coordinates) => {
                this.snActions.createNewGroup(this.snView, coordinates,
                    this.sessionsService.active.datas.read.customer.languages);
            }
        });
    }

    onAddBox() {
        this.snActions.notifyClickEvent(this.snView, {
            onClick: (coordinates) => {
                const mainObject: SnElement = this.getParent(this.snView, coordinates, 'box');
                this.snActions.createNewBox(this.snView, mainObject, coordinates,
                    this.sessionsService.active.datas.read.customer.languages);
            }
        });
    }

    onRunHelper() { // TODO to be removed when helper development is done
        this.runHelper.emit();
    }

    private addToastError(snModel: SnModelDto, report) {
        const title = `${snModel.type.toUpperCase()}-ERROR`;
        this.toastService.addToast('error', this.translateService.instant(title, {
            errors: report.errors.length
        }), null, 3000);
    }

    private getParent(snView: SnView, coord: { x: number; y: number }, type: 'node' | 'box'): SnElement {
        const mainObject: SnElement = this.snUtils.getEndpointContainer(coord.x, coord.y, snView);
        if (!mainObject) {
            return null;
        }
        if (type === 'box') {
            const box = _.find(snView.box, (bx: SnBox) => bx.id === mainObject.id);
            return (box) ? null : mainObject;
        } else {
            return mainObject;
        }
    }
}
