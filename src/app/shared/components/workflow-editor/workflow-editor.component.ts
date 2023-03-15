import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import {
    SnView, SnSelectionEvent, SnActionsService, SnParam, SnZoomService, SnUtilsService,
    SnContextmenuActionExtension, SnNode
} from '../../modules/smart-nodes';
import { SnSettings } from '../../modules/smart-nodes/dto/sn-settings';
import { SessionsService } from '../../services/sessions/sessions.service';
import { SnModelDto, WorkflowModelDto, SmartModelDto, SnViewDto } from '@algotech/core';
import {
    DatasService,
    SmartModelsService, MessageService, SnModelsService,
    ToastService, CheckService, ConfigService, WatcherService
} from '../../services';
import * as _ from 'lodash';
import {
    WorkflowEntryComponentsService, SnCustomSmartConnectionsService,
    SnPublishFlowService, SnDebugService
} from '../../modules/smart-nodes-custom';
import { ResourceType, ValidationReportDto } from '../../dtos';
import { ParamEditorDto } from '../../modules/inspector/dto/param-editor.dto';
import { ParamEditorService } from '../../modules/inspector/services/param-editor.service';
import { WorkflowSubjectService, InterpretorSubjectDto } from '@algotech/business';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DocGenerateService } from '../../modules/smart-nodes-custom/documentation/doc-generate/doc-generate.service';
import { EnvService } from '@algotech/angular';
import { StudioHelper } from '../../modules/smart-nodes-custom/helper/helper.service';
import {
    SnAlertNodeHelper, SnDataNodeHelper, SnFormulaNodeHelper,
    SnLauncherNodeHelper
} from '../../modules/smart-nodes-custom/index-helper';
import { SnFinisherNodeHelper } from '../../modules/smart-nodes-custom/workflow/lifecycle/sn-finisher-node/sn-finisher-node.helper';
import HelperUtils from '../../modules/smart-nodes-custom/helper/helper.utils';
import { OpenInspectorType } from '../../modules/app/dto/app-selection.dto';
import { TreeDebugComponent } from '../tree-debug/tree-debug.component';

@Component({
    selector: 'app-workflow-editor',
    styleUrls: ['./workflow-editor.component.scss'],
    templateUrl: './workflow-editor.component.html',
})
export class WorkflowEditorComponent implements OnChanges, OnDestroy {
    @Input()
    snModelUuid: string;

    @Input() customerKey: string;
    @Input() host: string;

    context: {
        type: string;
        element: any;
    } = null;
    param: ParamEditorDto = null;

    settings: SnSettings = null;
    snModel: SnModelDto = null;
    snView: SnView;
    smartModel: SmartModelDto | SmartModelDto[];

    debuggerSize = 600;
    treeDebugSize = 300;
    workflowToDebug: WorkflowModelDto;
    openDebug = false;
    treeDebugCLosed = false;
    report: ValidationReportDto;
    subscription: Subscription;
    subscribeCheck: Subscription;
    updateView: Subscription;

    openSmartLink = false;
    workFlow: WorkflowModelDto;

    nodesDocumentation = false;
    openInspector: OpenInspectorType;

    constructor(
        public snZoom: SnZoomService,
        public sessionsService: SessionsService,
        private snDebug: SnDebugService,
        private snPublish: SnPublishFlowService,
        private snActions: SnActionsService,
        private snUtils: SnUtilsService,
        private datasService: DatasService,
        private workflowSubjectService: WorkflowSubjectService,
        private entryComponentsService: WorkflowEntryComponentsService,
        private snCustomSmartConections: SnCustomSmartConnectionsService,
        private paramEditorService: ParamEditorService,
        private smartModelsService: SmartModelsService,
        private messageService: MessageService,
        private snModelsService: SnModelsService,
        private toastService: ToastService,
        private translate: TranslateService,
        private docGenerateService: DocGenerateService,
        private env: EnvService,
        private helper: StudioHelper,
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
        this.subscription.add(
            this.env.environment.subscribe((e) => {
                this.nodesDocumentation = !!e.NODES_DOCUMENTATION;
            })
        );
    }

    ngOnDestroy() {
        this.stopDebug({ redraw: false });
        this.subscription.unsubscribe();
        if (this.updateView) {
            this.updateView.unsubscribe();
        }
        this.checkService.unSubscribeView();
    }

    ngOnChanges() {
        this.param = null;
        this.context = null;
        this.openDebug = false;
        if (this.snView && this.workflowToDebug) {
            this.stopDebug({ redraw: false });
        }

        this.snModel = this.sessionsService.findModel(this.host, this.customerKey, this.snModelUuid);
        this.snView = this.snModelsService.getActiveView(this.snModel) as SnView;
        if (!this.snView) {
            return;
        }

        this.subscribeToCheck();

        this.subscription.add(this.watcherService.onUpdate().subscribe(() => {
            this.snActions.notifyRefresh(this.snView);
        }));

        this.subscription.add(
            this.snActions.onShowInspector(this.snView).subscribe((data) => {
                this.openInspector = data.openInspector;
            })
        );

        this.createSubscription();
        this.datasService.notifyChangeView(this.customerKey, this.host, this.snView.id);

        const languages = this.sessionsService.active.datas.read.customer.languages;
        this.settings = {
            module: 'workflow',
            languages,
            filterParams: ((connectorIn: SnParam, connectorOut: SnParam) =>
                this.snCustomSmartConections.filterParam(connectorIn, connectorOut, this.snView)
            ),
            theme: 'dark',
            contextmenus: {
                extended: this.buildExtendedMenu(),
            },
            entryComponents: this.entryComponentsService.getEntryComponents(languages),
            undo: () => {
                this.datasService.undo(this.snModel, this.customerKey, this.host);
            },
            redo: () => {
                this.datasService.redo(this.snModel, this.customerKey, this.host);
            },
        };
    }

    createSubscription() {
        if (this.updateView) {
            this.updateView.unsubscribe();
        }
        this.updateView = this.snActions.onUpdate(this.snView).subscribe((data) => {
            if (data.cmd !== 'sn.update') {
                return;
            }
            if (this.context?.type === 'param' && !this.snUtils.getParams(this.snView).includes(this.context?.element)) {
                this.param = null;
                this.context = null;
                this.smartModel = null;
            }
        });
    }

    buildExtendedMenu(): SnContextmenuActionExtension[] {
        // transform to workflow
        return _.compact([{
            filter: (selections: SnSelectionEvent[]) => {
                // 1|0 flow in
                const nodes: SnNode[] = _.map(selections.filter((s) => s.type === 'node'
                    && (s.element as SnNode).flows.length > 0), 'element');
                return nodes.length > 1 &&
                    this.snUtils.getStartNodes(this.snView, nodes).length === 1 &&
                    this.snUtils.getEndNodes(this.snView, nodes).length <= 1;
            },
            icon: 'fa-solid fa-diagram-project',
            title: 'SN-CONTEXTMENU-TRANSFORM-WORKFLOW',
            onClick: (selections: SnSelectionEvent[]) => {
                const nodes: SnNode[] = _.map(selections.filter((s) => s.type === 'node'), 'element');
                this.snPublish.exportWorkflow(this.snModel, this.snView, nodes);
            },
        }, this.nodesDocumentation ? {
            filter: (selections: SnSelectionEvent[]) => true,
            icon: 'fa-solid fa-circle',
            title: 'NODES_DOCUMENTATION',
            onClick: (selections: SnSelectionEvent[]) => {
                this.docGenerateService.generate(this.snView,
                    selections.filter((s) => s.type === 'node').map((e) => e.element as SnNode),
                    this.sessionsService.active.datas.read.customer.languages);
            },
        } : null]);
    }

    activateSmartLink() {
        try {
            this.workFlow = this.snPublish.getFlow(this.snView, this.snModel, 0, this.settings.languages,
                this.snModel.type as ResourceType, this.host, this.customerKey);
            this.openSmartLink = true;
        } catch (e) {
            this.toastService.addToast('error', this.translate.instant('ERROR-MESSAGE', { error: e.message }), null, 2000);
        }
    }

    onSelected(event: SnSelectionEvent) {
        this.param = null;
        if (!event) {
            this.context = null;
        } else {
            this.context = (event.element.displayName && _.isArray(event.element.displayName)) ? event : null;
            if (event.type === 'param' && this.paramEditorService.paramIsFormOptions(this.snView, event.element as SnParam)) {
                this.param = this.paramEditorService.constructionParam(event);
                this.context = (this.param) ? event : null;
                this.smartModel = (this.param) ?
                    this.smartModelsService.getModelsByParameter(event.element, this.sessionsService.active.datas.read.smartModels) : [];
            }
        }
    }

    changed(data: { snView: SnView }) {
        this.snActions.notifyCheck(data?.snView ? data.snView : this.snView, 'WF');
        this.datasService.notifySNView(data.snView as SnViewDto, this.customerKey, this.host);
    }

    onDrawingActivate(drawing: boolean) {
        this.snActions.notifyDrawing(this.snView, drawing);
    }

    onChanged(data: { snView: SnView }) {
        this.changed(data ? data : { snView: this.snView });
    }

    updateProfiles() {
        if (this.snView.options.profiles) {
            for (const node of this.snView.nodes) {
                if (node.custom) {
                    if (this.snView.options.profiles.length > 0) {
                        if (!node.custom.profile) {
                            node.custom.profile = this.snView.options.profiles[0].uuid;
                        }
                        continue;
                    }
                    delete node.custom.profile;
                }
            }
        }
    }

    runDebug() {
        try {
            this.treeDebugCLosed = false;
            this.workflowToDebug = this.snPublish.getFlow(this.snView, this.snModel, 0, this.settings.languages,
                this.snModel.type as ResourceType, this.host, this.customerKey);
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

        this.workflowToDebug = null;
        this.snView.displayState.debug = false;
        this.snActions.notifyRefresh(this.snView);
    }

    onChangedInspector() {
        this.updateProfiles();
        this.snActions.notifyInspector(this.snView);
        this.sessionsService.refreshEnv();
    }

    subscribeToCheck() {
        if (this.subscribeCheck) {
            this.subscribeCheck.unsubscribe();
        }
        this.subscribeCheck = this.snActions.onChecked(this.snView).subscribe({
            next: () => {

                if (this.snView) {
                    this.report = null;
                    this.openDebug = false;
                    this.report = this.checkService.getReport('WF', this.snModelUuid);
                    this.treeDebugCLosed = !this.workflowToDebug && this.configService.config.
                        preferences.checkOptions.openDebug.indexOf(this.report?.checkEvent) === -1;
                    this.openDebug = this.report?.errors?.length > 0 ||
                        this.report?.warnings?.length > 0 ||
                        this.report?.infos?.length > 0;
                }
            }
        });
        this.checkService.subscribeView(this.snView, this.snModelUuid);
    }

    onViewChanged(snView: SnView) {
        this.snView = snView;
        this.createSubscription();
        this.subscribeToCheck();
    }

    onCloseSmartLink(event) {
        this.openSmartLink = false;
    }

    // TODO evertyhing after this line is to be removed when helper development is done
    runHelper() {
        const workflowHelper = this.helper.getWorkflow(this.snModel.key);
        const start = workflowHelper
            .createNode(SnLauncherNodeHelper)
            .execute();

        const group = workflowHelper
            .createGroup('test-group')
            .execute();

        const boxInGroup = group
            .createBox('test-box-in-group')
            .execute();

        const dataNode = boxInGroup
            .createNode(SnDataNodeHelper, 'test-variable-object')
            .extendProperties(['NOM', 'DESIGNATION'])
            .execute();

        const formulaNode = boxInGroup
            .createNode(SnFormulaNodeHelper)
            .setSource([{
                key: 'text1',
                relativeTo: dataNode.getParam('NOM')
            }, {
                key: 'text2',
                relativeTo: dataNode.getParam('DESIGNATION')
            }])
            .setFormula('CONCATENATE({{text1}}, {{text2}})')
            .execute();

        const alert = group
            .createNode(SnAlertNodeHelper)
            .setTitle({ value: 'Test alert' })
            .setType('warning')
            .setMessage({ relativeTo: formulaNode.getResultParam() })
            .execute();

        const finish = workflowHelper
            .createNode(SnFinisherNodeHelper)
            .execute();

        workflowHelper.chainLinkNodes(start, alert, finish).update();
        this.onViewChanged(workflowHelper.snView);

        this.snActions.notifyUpdate(workflowHelper.snView);
    }

    handCloseTabs() {
        this.treeDebugCLosed = true;
    }
}
