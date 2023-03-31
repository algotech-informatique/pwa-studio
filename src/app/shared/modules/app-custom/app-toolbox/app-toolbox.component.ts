import { SnAppDto, SnModelDto, ThemeDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnDestroy, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { DatasService, CheckService, ToastService, UndoRedoService } from '../../../services';
import { AppActionsService, AppLinksService } from '../../app/services';
import { SnToolbox } from '../../smart-nodes';
import { AppDebugService, AppPublishService } from '../services';
import { PolylineDrawService } from '../widgets';

@Component({
    selector: 'app-toolbox',
    templateUrl: './app-toolbox.component.html',
    styleUrls: ['./app-toolbox.component.scss'],
})
export class AppToolboxComponent implements OnDestroy, OnChanges {

    @Input() snModel: SnModelDto;
    @Input() snApp: SnAppDto;
    @Input() customerKey: string;
    @Input() host: string;

    @Output() appChanged = new EventEmitter<SnAppDto>();
    @Output() shared = new EventEmitter();

    loaded = false;
    canUndo = false;
    canRedo = false;

    history: SnToolbox[] = [];
    subscription: Subscription;

    showWidgetsSelector = false;

    activeDrawPolyline = false;

    constructor(
        private appLinks: AppLinksService,
        private datasService: DatasService,
        private undoRedoService: UndoRedoService,
        private appActions: AppActionsService,
        private debugService: AppDebugService,
        private publishService: AppPublishService,
        private checkService: CheckService,
        private toastService: ToastService,
        private translateService: TranslateService,
        private ref: ChangeDetectorRef,
        private drawingService: PolylineDrawService,
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
    }

    ngOnChanges() {
        this.loaded = false;
        this.ref.detectChanges();

        this.showWidgetsSelector = false;
        this.canUndo = this.undoRedoService.canUndo(this.snModel, this.host, this.customerKey);
        this.canRedo = this.undoRedoService.canRedo(this.snModel, this.host, this.customerKey);
        this.subscription.add(this.appActions.onShowWidgetSelector(this.snApp).subscribe((data: any) => {
            this.showWidgetsSelector = data.show;
        }));
        this.subscription.add(this.appActions.onUpdate(this.snApp).subscribe(() => {
            this.activeDrawPolyline = false;
        }));

        this.loaded = true;
        this.ref.detectChanges();
    }

    onViewChanged(snView: SnAppDto) {
        this.appChanged.emit(snView);
    }

    launchEvent(event) {
        event.onClick(event);
    }

    onChanged() {
        this.appActions.notifyUpdate(this.snApp);
    }

    onUndo() {
        this.datasService.undo(this.snModel, this.customerKey, this.host);
    }
    onRedo() {
        this.datasService.redo(this.snModel, this.customerKey, this.host);
    }

    onDebug() {
        this.debugService.run(this.snModel, this.snApp);
    }

    onPublish() {
        this.checkService.dosnAppCheck('onPublish').subscribe((errors) => {
            if (errors) {
                this.toastService.addToast('error', '',
                    this.translateService.instant('INSPECTOR.APP.CHECK.ERROR-MESSAGE',
                        { number: this.checkService.getReport('APP', this.snModel.uuid).errors.length }), 2500);

            } else {
                this.publishService.publish(this.snApp, this.snModel, this.host, this.customerKey);
            }
        });

    }

    onActiveLink() {
        this.snApp.displayState.linked = !this.snApp?.displayState?.linked;
        this.appLinks.drawTransitions(this.snApp);
    }

    onCheck() {
        this.checkService.dosnAppCheck('onCheck').subscribe(() => {
            const report = this.checkService.getReport('APP', this.snModel.uuid);
            if (report.errors.length === 0 && report.warnings.length === 0) {
                this.toastService.addToast('success', '',
                    this.translateService.instant('INSPECTOR.APP.CHECK.OK-MESSAGE'), 2000);
            }
            if (report.errors.length !== 0) {
                this.toastService.addToast('error', '',
                    this.translateService.instant('INSPECTOR.APP.CHECK.ERROR-MESSAGE',
                        { number: report.errors.length }), 2500);
            }
            if (report.warnings.length !== 0) {
                this.toastService.addToast('info', '',
                    this.translateService.instant('INSPECTOR.APP.CHECK.WARNING-MESSAGE',
                        { number: report.errors.length }), 1500);
            }
        });


    }

    onShare(event) {
        this.shared.emit(event);
    }

    onDrawPolyline() {
        this.activeDrawPolyline = !this.activeDrawPolyline;
        if (this.activeDrawPolyline) {
            this.drawingService.initialize(this.snApp);
            return;
        }
        this.appActions.notifyUpdate(this.snApp);
    }

}
