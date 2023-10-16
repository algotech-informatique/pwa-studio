import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as components from '../smart-nodes-custom/index-component';
import { SmartNodesModule } from '../smart-nodes/smart-nodes.module';
import { SmartflowEntryComponentsService } from './service/entry-components/smartflow-entry-components/smartflow-entry-components.service';
import { WorkflowEntryComponentsService } from './service/entry-components/workflow-entry-components/workflow-entry-components.service';
import { SnTextFormattingNodeModule } from './shared/sn-text-formatting/sn-text-formatting.module';
import { SnSelectParameterModule } from './shared/sn-select-parameter/sn-select-parameter.module';
import { SnFormulaNodeModule } from './shared/sn-formula/sn-formula.module';
import { SnCustomSmartConnectionsService } from './service/sn-custom-smart-connections/sn-custom-smart-connections.service';
import { SnATNodeUtilsService } from './shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnCheckService } from './service/sn-check/sn-check.service';
import { SnDebugService } from './service/sn-debug/sn-debug.service';
import { ModelEntryComponentsService } from './service/entry-components/model-entry-components/model-entry-components.service';
import { EntryComponentsService } from './service/entry-components/entry-components/entry-components.service';
import { SnPublishModelService } from './service/sn-publish/sn-publish-model/sn-publish-model.service';
import { SnPublishFlowService } from './service/sn-publish/sn-publish-flow/sn-publish-flow.service';
import { SnConnectorUtilsService } from './workflow/data/sn-connector-node/sn-connector-utils.service';
import { SnPublishFlowTransformService } from './service/sn-publish/sn-publish-flow/sn-publish-flow-transform/sn-publish-flow-transform';
import { SnPublishFlowSubflowService } from './service/sn-publish/sn-publish-flow/sn-publish-flow-subflow/sn-publish-flow-subflow';
import { GotoButtonComponent } from './components/goto-button/goto-button.component';
import { SnToolboxComponent } from './components/sn-toolbox/sn-toolbox.component';
import { DrawingModule } from '@algotech-ce/business/drawing';
import { ATAppToolboxModule } from '../app-custom/app-toolbox/app-toolbox.module';
import { DocUtilsService } from './documentation/doc-utils/doc-utils.service';
import { DocCsvService } from './documentation/doc-csv/doc-csv.service';
import { DocGenerateService } from './documentation/doc-generate/doc-generate.service';
import { StudioHelper } from './helper/helper.service';
import { HelperContext } from './helper/helper.context';
import { TranslateModule } from '@ngx-translate/core';
import { ToolBoxModule } from '../toolbox/toolbox.module';
import { SnCheckUtilsService } from './service/sn-check/check-utils';
import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SmartNodesModule,
        SnTextFormattingNodeModule,
        SnSelectParameterModule,
        SnFormulaNodeModule,
        ATAppToolboxModule,
        DrawingModule,
        TranslateModule,
        ToolBoxModule,
        MonacoEditorModule
    ],
    declarations: [
        SnToolboxComponent,
        GotoButtonComponent,
        components.SnAlertNodeComponent,
        components.SnCameraAutoNodeComponent,
        components.SnCameraNodeComponent,
        components.SnConditionNodeComponent,
        components.SnConditionV2NodeComponent,
        components.SnSwitchNodeComponent,
        components.SnConnectorNodeComponent,
        components.SnConnectorParameterNodeComponent,
        components.SnDataNodeComponent,
        components.SnSkillsNodeComponent,
        components.SnCsvMappedNodeComponent,
        components.SnDocumentDeletionNodeComponent,
        components.SnDocumentDownloadNodeComponent,
        components.SnDocumentEditionNodeComponent,
        components.SnDocumentLinkNodeComponent,
        components.SnDocumentListNodeComponent,
        components.SnDocumentLockNodeComponent,
        components.SnDocumentUploadNodeComponent,
        components.SnDocumentViewerNodeComponent,
        components.SnEmailNodeComponent,
        components.SnFinisherNodeComponent,
        components.SnFormNodeComponent,
        components.SnGeolocationNodeComponent,
        components.SnGpsNodeComponent,
        components.SnInputNodeComponent,
        components.SnLauncherNodeComponent,
        components.SnListNodeComponent,
        components.SnMappedNodeComponent,
        components.SnModelNodeComponent,
        components.SnMultiChoiceNodeComponent,
        components.SnNotificationNodeComponent,
        components.SnObjectAssignmentNodeComponent,
        components.SnObjectCreationNodeComponent,
        components.SnObjectDeletionNodeComponent,
        components.SnObjectDownloadNodeComponent,
        components.SnObjectFilterNodeComponent,
        components.SnObjectUICreationNodeComponent,
        components.SnQRCodeNodeComponent,
        components.SnXReportNodeComponent,
        components.SnReviewNodeComponent,
        components.SnScheduleAutoCreationNodeComponent,
        components.SnScheduleCreationNodeComponent,
        components.SnScheduleDeletionNodeComponent,
        components.SnServiceNodeComponent,
        components.SnDBConnectorNodeComponent,
        components.SnQueryBuilderNodeComponent,
        components.SnQueryBuilderQueryComponent,
        components.SnSignatureNodeComponent,
        components.SnTransformNodeComponent,
        components.SnUndoNodeComponent,
        components.SnLockGoBackNodeComponent,
        components.SnProfileNodeComponent,
        components.SnJsonNodeComponent,
        components.SnJsonEditComponent,
        components.SnJsonMonacoEditComponent,
        components.SnArrayNodeComponent,
        components.SnArrayFunctionNodeComponent,
        components.SnObjectFunctionNodeComponent,
        components.SnServiceSmartObjectV2NodeComponent,
        components.SnServiceSmartObjectNodeComponent,
        components.SnServiceTreeSearchNodeComponent,
        components.SnServiceUsersNodeComponent,
        components.SnServiceWorkflowNodeComponent,
        components.SnServiceConnectorNodeComponent,
        components.SnLayerMetadataNodeComponent,
        components.SnLoopNodeComponent,
        components.SnRequestResultNodeComponent,
        components.SnDocumentSelectNodeComponent,
        components.SnDataBufferNodeComponent,
        components.SnATNodeComponent,
        components.SnTaskNodeComponent,
        components.SnGeoNodeComponent,
        components.SnMagnetNodeComponent,
        components.SnMergeNodeComponent,
        components.SnMergeV2NodeComponent,
        components.SnSubWorkflowNodeComponent,
        components.SnDocumentConvertNodeComponent,
        components.SnDocumentFileZipNodeComponent,
        components.SnDocumentFileCreateNodeComponent,
        components.SnFilterNodeComponent,
        components.SnResetNodeComponent,
        components.SnGListNodeComponent,
    ],
    providers: [
        SnCustomSmartConnectionsService,
        SnATNodeUtilsService,
        EntryComponentsService,
        SmartflowEntryComponentsService,
        WorkflowEntryComponentsService,
        ModelEntryComponentsService,
        SnPublishFlowService,
        SnPublishFlowTransformService,
        SnPublishFlowSubflowService,
        SnPublishModelService,
        SnDebugService,
        SnCheckService,
        SnCheckUtilsService,
        SnConnectorUtilsService,
        DocUtilsService,
        DocCsvService,
        DocGenerateService,
        StudioHelper,
        HelperContext
    ],
    exports: [
        SnSelectParameterModule,
        SnToolboxComponent,
    ]
})
export class SmartNodesCustomModule { }
