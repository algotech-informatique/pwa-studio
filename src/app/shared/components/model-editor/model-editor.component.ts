import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { SnSettings } from '../../modules/smart-nodes/dto/sn-settings';
import { SnView, SnSelectionEvent, SnActionsService, SnZoomService, SnUtilsService } from '../../modules/smart-nodes';
import { SnModelDto, SnViewDto } from '@algotech-ce/core';
import { CheckService, ConfigService, DatasService, SessionsService, SnModelsService } from '../../services';
import * as _ from 'lodash';
import { ModelEditorService } from './model-editor.service';
import { Subscription } from 'rxjs';
import { ValidationReportDto } from '../../dtos';
import { OpenInspectorType } from '../../modules/app/dto/app-selection.dto';

@Component({
    selector: 'app-model-editor',
    styleUrls: ['./model-editor.component.scss'],
    templateUrl: './model-editor.component.html',
})
export class ModelEditorComponent implements OnChanges, OnDestroy {
    @Input()
    snModelUuid: string;

    @Input() customerKey: string;
    @Input() host: string;

    openDebug = false;
    treeDebugCLosed = false;
    report: ValidationReportDto;
    settings: SnSettings = null;
    snModel: SnModelDto = null;
    snView: SnView;
    context: {
        type: string;
        element: any;
    } = null;

    fieldOptions = null;
    updateView: Subscription;
    treeDebugSize = 300;
    openInspector: OpenInspectorType;

    constructor(
        public snZoom: SnZoomService,
        private snModelsService: SnModelsService,
        private modelEditorService: ModelEditorService,
        private sessionService: SessionsService,
        private datasService: DatasService,
        private snActions: SnActionsService,
        private snUtils: SnUtilsService,
        private checkService: CheckService,
        private configService: ConfigService,
    ) {
    }

    ngOnDestroy() {
        if (this.updateView) {
            this.updateView.unsubscribe();
        }
        this.checkService.unSubscribeView();
    }

    ngOnChanges() {
        this.openDebug = false;
        this.snModel = this.sessionService.findModel(this.host, this.customerKey, this.snModelUuid);
        const view = this.snModelsService.getActiveView(this.snModel) as SnView;
        if (!view) {
            return;
        }

        this.snView = view;
        if (this.updateView) {
            this.updateView.unsubscribe();
        }
        this.updateView = this.snActions.onUpdate(this.snView).subscribe((data) => {
            if (data.cmd !== 'sn.update') {
                return;
            }
            if (this.context?.type === 'param' && !this.snUtils.getParams(this.snView).includes(this.context?.element)) {
                this.context = null;
                this.fieldOptions = null;
            }
        });

        this.updateView.add(this.snActions.onChecked(this.snView).subscribe({
            next: () => {
                if (this.snView) {
                    this.report = this.checkService.getReport('SM', this.snModelUuid);
                    this.treeDebugCLosed = this.configService.config.
                        preferences.checkOptions.openDebug.indexOf(this.report?.checkEvent) === -1;
                    this.openDebug = this.report?.errors?.length > 0 ||
                        this.report?.warnings?.length > 0 ||
                        this.report?.infos?.length > 0;
                }
            }
        }));

        this.updateView.add(
            this.snActions.onShowInspector(this.snView).subscribe((data) => {
                this.openInspector = data.openInspector;
            })
        );

        this.checkService.subscribeView(this.snView, this.snModelUuid);
        this.datasService.notifyChangeView(this.customerKey, this.host, this.snView.id);

        if (this.snView) {
            const languages = this.sessionService.active.datas.read.customer.languages;
            this.settings = this.modelEditorService.buildSettings(this.snView, this.snModel, this.host, this.customerKey, languages);
        }
    }

    onSelected(event: SnSelectionEvent) {
        this.context = event;
        this.fieldOptions = (event && event.type === 'param') ? event.element : null;
    }

    onChanged(data?: { snView: SnView; cmd?: string }) {
        if (['sn.update.remove', 'sn.update.container.add', 'sn.update.paste'].includes(data?.cmd)) {
            this.sessionService.refreshEnv();
        }
        this.snActions.notifyCheck(data ? data.snView : this.snView, 'SM');
        this.datasService.notifySNView((data ? data.snView : this.snView) as SnViewDto, this.customerKey, this.host);
    }

    onDrawingActivate(drawing: boolean) {
        this.snActions.notifyDrawing(this.snView, drawing);
    }

    onChangedInspector() {
        this.snActions.notifyInspector(this.snView);
        this.sessionService.refreshEnv();
    }

    handCloseTabs() {
        this.treeDebugCLosed = true;
    }
}
