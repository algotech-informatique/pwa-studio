import { Component, Input, OnChanges, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SnView, SnSelectionEvent, SnActionsService, SnParam, SnZoomService, SnNode } from '../../modules/smart-nodes';
import * as _ from 'lodash';
import { SnSettings } from '../../modules/smart-nodes/dto/sn-settings';
import { SnModelDto, WorkflowModelDto, SnViewDto } from '@algotech-ce/core';
import { DatasService, SessionsService, MessageService, SnModelsService, ToastService,
    ConfigService, WatcherService } from '../../services';
import {
    SmartflowEntryComponentsService, SnDebugService, SnPublishFlowService,
    SnCustomSmartConnectionsService
} from '../../modules/smart-nodes-custom';
import { ResourceType, ValidationReportDto } from '../../dtos';
import { Subscription } from 'rxjs';
import { WorkflowSubjectService, InterpretorSubjectDto } from '@algotech-ce/business';
import { TranslateService } from '@ngx-translate/core';
import { DocGenerateService } from '../../modules/smart-nodes-custom/documentation/doc-generate/doc-generate.service';
import { EnvService } from '@algotech-ce/angular';
import { CheckService } from '../../services/check/check-service';
import { OpenInspectorType } from '../../modules/app/dto/app-selection.dto';

@Component({
    selector: 'app-flow-editor',
    styleUrls: ['./flow-editor.component.scss'],
    templateUrl: './flow-editor.component.html',
})
export class FlowEditorComponent implements OnChanges, OnDestroy {
    @Input()
    snModelUuid: string;

    @Input() customerKey: string;
    @Input() host: string;

    @Output()
    changeView = new EventEmitter();

    snModel: SnModelDto = null;
    snView: SnView = null;
    context: {
        type: string;
        element: any;
    } = null;

    smartflowToDebug: WorkflowModelDto;
    openDebug = false;
    treeDebugCLosed = false;
    report: ValidationReportDto;
    debuggerSize = 600;
    treeDebugSize = 300;

    settings: SnSettings = null;
    subscription: Subscription;
    subscribeCheck: Subscription;

    nodesDocumentation = false;
    openInspector: OpenInspectorType;

    constructor(
        public snZoom: SnZoomService,
        public sessionsService: SessionsService,
        private workflowSubjectService: WorkflowSubjectService,
        private snDebug: SnDebugService,
        private snPublish: SnPublishFlowService,
        private snActions: SnActionsService,
        private entryComponentsService: SmartflowEntryComponentsService,
        private datasService: DatasService,
        private messageService: MessageService,
        private snModelsService: SnModelsService,
        private snCustomSmartConections: SnCustomSmartConnectionsService,
        private toastService: ToastService,
        private translate: TranslateService,
        private docGenerateService: DocGenerateService,
        private env: EnvService,
        private checkService: CheckService,
        private configService: ConfigService,
        private watcherService: WatcherService,
    ) {
        this.subscription = this.workflowSubjectService.subject.subscribe((data: InterpretorSubjectDto) => {
            if (!this.snView) {
                return;
            }
            this.snDebug.receiveAction(this.snView, data);
            this.snActions.notifyRefresh(this.snView);
        });
        this.subscription.add(this.messageService.get('connector-parameters.save').subscribe(() => {
            this.changed({ snView: this.snView });
        }));
        this.subscription.add(
            this.env.environment.subscribe((e) => {
                this.nodesDocumentation = !!e.NODES_DOCUMENTATION;
            })
        );
        this.subscription.add(this.watcherService.onUpdate().subscribe(() => {
            this.snActions.notifyRefresh(this.snView);
        }));
    }

    ngOnChanges() {
        this.context = null;
        if (this.snView && this.smartflowToDebug) {
            this.stopDebug({ redraw: false });
        }

        this.snModel = this.sessionsService.findModel(this.host, this.customerKey, this.snModelUuid);
        this.snView = this.snModelsService.getActiveView(this.snModel) as SnView;
        if (!this.snView) {
            return;
        }

        this.subscribeToCheck();
        this.subscription.add(
            this.snActions.onShowInspector(this.snView).subscribe((data) => {
                this.openInspector = data.openInspector;
            })
        );

        this.datasService.notifyChangeView(this.customerKey, this.host, this.snView.id);

        const languages = this.sessionsService.active.datas.read.customer.languages;
        this.settings = {
            module: 'smartflow',
            languages,
            theme: 'dark',
            filterParams: ((connectorIn: SnParam, connectorOut: SnParam) =>
                this.snCustomSmartConections.filterParam(connectorIn, connectorOut, this.snView)
            ),
            contextmenus: {
                extended: this.nodesDocumentation ? [{
                    filter: (selections: SnSelectionEvent[]) => true,
                    icon: 'fa-solid fa-circle',
                    title: 'NODES_DOCUMENTATION',
                    onClick: (selections: SnSelectionEvent[]) => {
                        this.docGenerateService.generate(this.snView,
                            selections.filter((s) => s.type === 'node').map((e) => e.element as SnNode),
                            this.sessionsService.active.datas.read.customer.languages);
                    },
                }] : [],
            },
            entryComponents: this.entryComponentsService.getEntryComponents(languages,
                this.customerKey, this.host, this.snModel.dirUuid),
            undo: () => {
                this.datasService.undo(this.snModel, this.customerKey, this.host);
            },
            redo: () => {
                this.datasService.redo(this.snModel, this.customerKey, this.host);
            },
        };
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.checkService.unSubscribeView();
        this.stopDebug({ redraw: false });
    }

    onSelected(event: SnSelectionEvent) {
        if (!event) {
            this.context = null;
        } else {
            this.context = (event.element.displayName && _.isArray(event.element.displayName)) ? event : null;
        }
    }

    subscribeToCheck() {
        if (this.subscribeCheck) {
            this.subscribeCheck.unsubscribe();
        }
        this.subscribeCheck = this.snActions.onChecked(this.snView).subscribe({
            next: () => {

                if (this.snView) {
                    this.report = this.checkService.getReport('SF', this.snModelUuid);
                    this.treeDebugCLosed = !this.smartflowToDebug && this.configService.config.
                        preferences.checkOptions.openDebug.indexOf(this.report?.checkEvent) === -1;
                    this.openDebug = this.report?.errors?.length > 0 ||
                        this.report?.warnings?.length > 0 ||
                        this.report?.infos?.length > 0;
                }
            }
        });
        this.checkService.subscribeView(this.snView, this.snModelUuid);
    }

    changed(data: { snView: SnView }) {
        this.snActions.notifyCheck(data?.snView ? data.snView : this.snView, 'SF');
        this.datasService.notifySNView(data.snView as SnViewDto, this.customerKey, this.host);
    }

    runDebug() {
        try {
            this.treeDebugCLosed = false;
            this.smartflowToDebug = this.snPublish.getFlow(this.snView, this.snModel, 0, this.settings.languages,
                this.snModel.type as ResourceType, this.host, this.customerKey, true);
            this.messageService.send('debugger-change-state', 'start');
            this.snDebug.resetDebug(this.snView);

            this.snView.displayState.debug = true;
            this.snActions.notifyRefresh(this.snView);
        } catch (e) {
            this.toastService.addToast('error', this.translate.instant('ERROR-MESSAGE', { error: e.message }), null, 2000);
            return false;
        }

        return true;
    }

    stopDebug(options: { redraw: boolean }) {
        if (options.redraw) {
            this.messageService.send('debugger-change-state', 'stop');
        }
        this.snDebug.resetDebug(this.snView, options);
        if (!this.treeDebugCLosed) {
            this.treeDebugCLosed = this.configService.config.preferences.checkOptions.openDebug.indexOf(this.report?.checkEvent) === -1;
        }

        this.smartflowToDebug = null;

        this.snView.displayState.debug = false;
        this.snActions.notifyRefresh(this.snView);
    }

    onDrawingActivate(drawing: boolean) {
        this.snActions.notifyDrawing(this.snView, drawing);
    }

    onChanged(data: { snView: SnView }) {
        this.changed(data ? data : { snView: this.snView });
    }

    onChangedInspector() {
        this.snActions.notifyInspector(this.snView);
        this.sessionsService.refreshEnv();
    }

    onViewChanged(snView: SnView) {
        this.snView = snView;
        this.subscribeToCheck();
    }

    handCloseTabs() {
        this.treeDebugCLosed = true;
    }
}
