import { Injectable } from '@angular/core';
import { SnView, SnLang } from '../../../../smart-nodes/models';
import { SnEntryComponents } from '../../../../smart-nodes/dto';
import * as components from '../../../index-component';
import * as schema from '../../../index-schema';
import * as _ from 'lodash';
import { EntryComponentsService } from '../entry-components/entry-components.service';
import { SnAlertNodeHelper, SnLauncherNodeHelper, SnObjectCreationNodeHelper,
    SnFinisherNodeHelper, SnFormulaNodeHelper, SnArrayFunctionNodeHelper, SnObjectFunctionNodeHelper } from '../../../index-helper';

@Injectable()
export class WorkflowEntryComponentsService {

    constructor(private entryComponents: EntryComponentsService) { }

    getEntryComponents(languages: SnLang[]): (snView: SnView) => SnEntryComponents {
        return (snView: SnView) => {
            const entryComponents: SnEntryComponents = {
                groups: [{
                    displayName: 'SN-TASK-GROUP-LIFECYCLE',
                    components: [{
                        displayName: 'SN-LAUNCHER',
                        component: components.SnLauncherNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_LAUNCHER_NODE_SCHEMA, 'SN-LAUNCHER', languages),
                        helper: SnLauncherNodeHelper
                    }, {
                        displayName: 'SN-FINISHER',
                        component: components.SnFinisherNodeComponent,
                        schema: schema.SN_FINISHER_NODE_SCHEMA(
                            this.entryComponents.initializeLangs('SN-FINISHER', languages),
                            true,
                        ),
                        helper: SnFinisherNodeHelper
                    }, {
                        displayName: 'SN-MULTICHOICE',
                        component: components.SnMultiChoiceNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_MULTICHOICE_NODE_SCHEMA, 'SN-MULTICHOICE', languages)
                    }, {
                        displayName: 'SN-UNDO',
                        component: components.SnUndoNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_UNDO_NODE_SCHEMA, 'SN-UNDO', languages)
                    }, {
                        displayName: 'SN-CONDITION',
                        component: components.SnConditionNodeComponent,
                        schema: schema.SN_CONDITION_NODE_SCHEMA(
                            this.entryComponents.initializeLangs('SN-CONDITION', languages),
                            this.entryComponents.initializeLangs('SN-CONDITION-OK', languages),
                            this.entryComponents.initializeLangs('SN-CONDITION-KO', languages)
                        )
                    }, {
                        displayName: 'SN-CONDITION',
                        component: components.SnConditionV2NodeComponent,
                        schema: schema.SN_CONDITIONV2_NODE_SCHEMA(
                            this.entryComponents.initializeLangs('SN-CONDITION', languages),
                            this.entryComponents.initializeLangs('SN-CONDITION-OK', languages),
                            this.entryComponents.initializeLangs('SN-CONDITION-KO', languages)
                        )
                    }, {
                        displayName: 'SN-SWITCH',
                        component: components.SnSwitchNodeComponent,
                        schema: schema.SN_SWITCH_NODE_SCHEMA(
                            this.entryComponents.initializeLangs('SN-SWITCH', languages),
                            this.entryComponents.initializeLangs('SN-SWITCH-DEFAULT', languages),
                        )
                    }, {
                        displayName: 'SN-LOOP',
                        component: components.SnLoopNodeComponent,
                        schema: schema.SN_LOOP_NODE_SCHEMA(
                            this.entryComponents.initializeLangs('SN-LOOP', languages),
                            this.entryComponents.initializeLangs('SN-LOOP-NEXT', languages),
                            this.entryComponents.initializeLangs('SN-LOOP-EXIT', languages),
                        )
                    }, {
                        displayName: 'SN-SUB-WORKFLOW',
                        component: components.SnSubWorkflowNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SUB_WORKFLOW_NODE_SCHEMA, 'SN-SUB-WORKFLOW', languages)
                    }, {
                        displayName: 'SN-CONNECTOR',
                        component: components.SnConnectorNodeComponent,
                        schema: schema.SN_CONNECTOR_NODE_SCHEMA(
                            this.entryComponents.initializeLangs('SN-CONNECTOR', languages),
                            this.entryComponents.initializeLangs('SN-SERVICE-DONE', languages),
                            this.entryComponents.initializeLangs('SN-SERVICE-ERROR', languages),
                        )
                    }, {
                        displayName: 'SN-LOCK-GOBACK',
                        component: components.SnLockGoBackNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_LOCK_GO_BACK_NODE_SCHEMA, 'SN-LOCK-GOBACK', languages)
                    }]
                }, {
                    displayName: 'SN-SERVICE',
                    components: [{
                        displayName: 'SN-TRANSFORM',
                        component: components.SnTransformNodeComponent,
                        schema: schema.SN_TRANSFORM_NODE_SCHEMA('SN-TRANSFORM'),
                    }, {
                        displayName: 'SN-MAPPED',
                        component: components.SnMappedNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_MAPPED_NODE_SCHEMA, 'SN-MAPPED', languages)
                    }, {
                        displayName: 'SN-CSV-MAPPED',
                        component: components.SnCsvMappedNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_CSV_MAPPED_NODE_SCHEMA, 'SN-CSV-MAPPED', languages)
                    }]
                }, {
                    displayName: 'SN-TASK-GROUP-FORMS',
                    components: [{
                        displayName: 'SN-FORM',
                        component: components.SnFormNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_FORM_NODE_SCHEMA, 'SN-FORM', languages)
                    }, {
                        displayName: 'SN-LIST',
                        component: components.SnListNodeComponent,
                        schema: schema.SN_LIST_NODE_SCHEMA(
                            this.entryComponents.initializeLangs('SN-LIST', languages),
                            this.entryComponents.initializeLangs('SN-LIST-EXIT', languages)
                        )
                    }, {
                        displayName: 'SN-INPUT',
                        component: components.SnInputNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_INPUT_NODE_SCHEMA, 'SN-INPUT', languages)
                    }]
                }, {
                    displayName: 'SN-TASK-GROUP-DATA',
                    components: [{
                        displayName: 'SN-DATA-BUFFER',
                        component: components.SnDataBufferNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DATA_BUFFER_NODE_SCHEMA, 'SN-DATA-BUFFER', languages)
                    }, {
                        displayName: 'SN-SKILLS',
                        component: components.SnSkillsNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SKILLS_NODE_SCHEMA, 'SN-SKILLS', languages)
                    }, {
                        displayName: 'SN-OBJECT-ASSIGNMENT',
                        component: components.SnObjectAssignmentNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_OBJECT_ASSIGNMENT_NODE_SCHEMA,
                            'SN-OBJECT-ASSIGNMENT', languages)
                    }, {
                        displayName: 'SN-OBJECT-CREATION',
                        component: components.SnObjectCreationNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_OBJECT_CREATION_NODE_SCHEMA, 'SN-OBJECT-CREATION', languages),
                        helper: SnObjectCreationNodeHelper
                    }, {
                        displayName: 'SN-OBJECT-UI-CREATION',
                        component: components.SnObjectUICreationNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_OBJECT_UI_CREATION_NODE_SCHEMA,
                            'SN-OBJECT-UI-CREATION', languages)
                    }, {
                        displayName: 'SN-OBJECT-DELETION',
                        component: components.SnObjectDeletionNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_OBJECT_DELETION_NODE_SCHEMA, 'SN-OBJECT-DELETION', languages)
                    }, {
                        displayName: 'SN-OBJECT-DOWNLOAD',
                        component: components.SnObjectDownloadNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_OBJECT_DOWNLOAD_NODE_SCHEMA, 'SN-OBJECT-DOWNLOAD', languages)
                    }, {
                        displayName: 'SN-OBJECT-FILTER',
                        component: components.SnObjectFilterNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_OBJECT_FILTER_NODE_SCHEMA, 'SN-OBJECT-FILTER', languages)
                    }, {
                        displayName: 'SN-LAYER-METADATA',
                        component: components.SnLayerMetadataNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_LAYER_METADATA_NODE_SCHEMA, 'SN-LAYER-METADATA', languages)
                    }
                    ]
                }, {
                    displayName: 'SN-TASK-GROUP-DOCUMENT',
                    components: [{
                        displayName: 'SN-DOCUMENT-UPLOAD',
                        component: components.SnDocumentUploadNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_UPLOAD_NODE_SCHEMA, 'SN-DOCUMENT-UPLOAD', languages)
                    }, {
                        displayName: 'SN-DOCUMENT-DOWNLOAD',
                        component: components.SnDocumentDownloadNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_DOWNLOAD_NODE_SCHEMA,
                            'SN-DOCUMENT-DOWNLOAD', languages)
                    }, {
                        displayName: 'SN-DOCUMENT-EDITION',
                        component: components.SnDocumentEditionNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_EDITION_NODE_SCHEMA, 'SN-DOCUMENT-EDITION', languages)
                    }, {
                        displayName: 'SN-DOCUMENT-LIST',
                        component: components.SnDocumentListNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_LIST_NODE_SCHEMA, 'SN-DOCUMENT-LIST', languages)
                    }, {
                        displayName: 'SN-DOCUMENT-LINK',
                        component: components.SnDocumentLinkNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_LINK_NODE_SCHEMA, 'SN-DOCUMENT-LINK', languages)
                    }, {
                        displayName: 'SN-DOCUMENT-SELECT',
                        component: components.SnDocumentSelectNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_SELECT_NODE_SCHEMA, 'SN-DOCUMENT-SELECT', languages)
                    }, {
                        displayName: 'SN-DOCUMENT-LOCK',
                        component: components.SnDocumentLockNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_LOCK_NODE_SCHEMA, 'SN-DOCUMENT-LOCK', languages)
                    }, {
                        displayName: 'SN-DOCUMENT-DELETION',
                        component: components.SnDocumentDeletionNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_DELETION_NODE_SCHEMA,
                            'SN-DOCUMENT-DELETION', languages)
                    }, {
                        displayName: 'SN-DOCUMENT-VIEWER',
                        component: components.SnDocumentViewerNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_VIEWER_NODE_SCHEMA, 'SN-DOCUMENT-VIEWER', languages)
                    }, {
                        displayName: 'SN-XREPORT',
                        component: components.SnXReportNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_X_REPORT_NODE_SCHEMA, 'SN-XREPORT', languages)
                    }, {
                        displayName: 'SN-DOCUMENT-CONVERT',
                        component: components.SnDocumentConvertNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_CONVERT_NODE_SCHEMA, 'SN-DOCUMENT-CONVERT', languages)
                    }, {
                        displayName: 'SN-DOCUMENT-FILEZIP',
                        component: components.SnDocumentFileZipNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_FILEZIP_NODE_SCHEMA, 'SN-DOCUMENT-FILEZIP', languages)
                    }, {
                        displayName: 'SN-DOCUMENT-FILECREATE',
                        component: components.SnDocumentFileCreateNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_FILECREATE_NODE_SCHEMA,
                            'SN-DOCUMENT-FILECREATE', languages)
                    }]
                }, {
                    displayName: 'SN-TASK-GROUP-NOTIFICATION',
                    components: [{
                        displayName: 'SN-ALERT',
                        component: components.SnAlertNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_ALERT_NODE_SCHEMA, 'SN-ALERT', languages),
                        helper: SnAlertNodeHelper
                    }, {
                        displayName: 'SN-EMAIL',
                        component: components.SnEmailNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_EMAIL_NODE_SCHEMA, 'SN-EMAIL', languages)
                    }, {
                        displayName: 'SN-NOTIFICATION',
                        component: components.SnNotificationNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_NOTIFICATION_NODE_SCHEMA, 'SN-NOTIFICATION', languages)
                    }, {
                        displayName: 'SN-REVIEW',
                        component: components.SnReviewNodeComponent,
                        schema: schema.SN_REVIEW_NODE_SCHEMA(
                            this.entryComponents.initializeLangs('SN-REVIEW', languages),
                            this.entryComponents.initializeLangs('SN-REVIEW-ACCEPT', languages),
                            this.entryComponents.initializeLangs('SN-REVIEW-REFUSE', languages)
                        )
                    }, {
                        displayName: 'SN-SCHEDULE-AUTO-CREATION',
                        component: components.SnScheduleAutoCreationNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SCHEDULE_AUTO_CREATION_NODE_SCHEMA,
                            'SN-SCHEDULE-AUTO-CREATION', languages)
                    }, {
                        displayName: 'SN-SCHEDULE-CREATION',
                        component: components.SnScheduleCreationNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SCHEDULE_CREATION_NODE_SCHEMA,
                            'SN-SCHEDULE-CREATION', languages)
                    }, {
                        displayName: 'SN-SCHEDULE-DELETION',
                        component: components.SnScheduleDeletionNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SCHEDULE_DELETION_NODE_SCHEMA,
                            'SN-SCHEDULE-DELETION', languages)
                    }]
                }, {
                    displayName: 'SN-TASK-GROUP-MOBILE',
                    components: [{
                        displayName: 'SN-CAMERA-AUTO',
                        component: components.SnCameraAutoNodeComponent,
                        schema: schema.SN_CAMERA_AUTO_NODE_SCHEMA
                            (
                                this.entryComponents.initializeLangs('SN-CAMERA-AUTO', languages),
                                this.entryComponents.initializeLangs('SN-CAMERA-AUTO-DONE', languages),
                                this.entryComponents.initializeLangs('SN-CAMERA-AUTO-CANCEL', languages)
                            )
                    }, {
                        displayName: 'SN-CAMERA',
                        component: components.SnCameraNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_CAMERA_NODE_SCHEMA, 'SN-CAMERA', languages)
                    }, {
                        displayName: 'SN-GEOLOCATION',
                        component: components.SnGeolocationNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_GEOLOCATION_NODE_SCHEMA, 'SN-GEOLOCATION', languages)
                    }, {
                        displayName: 'SN-GPS',
                        component: components.SnGpsNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_GPS_NODE_SCHEMA, 'SN-GPS', languages)
                    }, {
                        displayName: 'SN-QRCODE',
                        component: components.SnQRCodeNodeComponent,
                        schema: schema.SN_QRCODE_NODE_SCHEMA
                            (
                                this.entryComponents.initializeLangs('SN-QRCODE', languages),
                                this.entryComponents.initializeLangs('SN-QRCODE-DONE', languages),
                                this.entryComponents.initializeLangs('SN-QRCODE-REVISION', languages),
                                this.entryComponents.initializeLangs('SN-QRCODE-TIMEOUT', languages)
                            )
                    }, {
                        displayName: 'SN-SIGNATURE',
                        component: components.SnSignatureNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SIGNATURE_NODE_SCHEMA, 'SN-SIGNATURE', languages)
                    }]
                }, {
                    displayName: 'SN-EDIT',
                    components: [{
                        displayName: 'SN-TEXT-FORMATTING',
                        component: components.SnTextFormattingNodeComponent,
                        schema: schema.SN_TEXTFORMATTING_NODE_SCHEMA,
                    }, {
                        displayName: 'SN-FORMULA',
                        component: components.SnFormulaNodeComponent,
                        schema: schema.SN_FORMULA_NODE_SCHEMA,
                        helper: SnFormulaNodeHelper
                    }, {
                        displayName: 'SN-JSON-NODE',
                        component: components.SnJsonNodeComponent,
                        schema: schema.SN_JSON_NODE_SCHEMA,
                    }, {
                        displayName: 'SN-ARRAY-DATA',
                        component: components.SnArrayNodeComponent,
                        schema: schema.SN_ARRAY_NODE_SCHEMA,
                    }, {
                        displayName: 'SN-ARRAY-FUNCTION',
                        component: components.SnArrayFunctionNodeComponent,
                        schema: schema.SN_ARRAY_FUNCTION_NODE_SCHEMA,
                        helper: SnArrayFunctionNodeHelper,
                    }, {
                        displayName: 'SN-OBJECT-FUNCTION',
                        component: components.SnObjectFunctionNodeComponent,
                        schema: schema.SN_OBJECT_FUNCTION_NODE_SCHEMA,
                        helper: SnObjectFunctionNodeHelper,
                    }, {
                        displayName: 'SN-GEO-NODE',
                        component: components.SnGeoNodeComponent,
                        schema: schema.SN_GEO_NODE_SCHEMA,
                    }, {
                        displayName: 'SN-MAGNET-NODE',
                        component: components.SnMagnetNodeComponent,
                        schema: schema.SN_MAGNET_NODE_SCHEMA,
                    }, {
                        displayName: 'SN-FILTER',
                        component: components.SnFilterNodeComponent,
                        schema: schema.SN_FILTER_NODE_SCHEMA,
                    }, {
                        displayName: 'SN-RESET-NODE',
                        component: components.SnResetNodeComponent,
                        schema: schema.SN_RESET_NODE_SCHEMA,
                    }, {
                        displayName: 'SN-GLIST-NODE',
                        component: components.SnGListNodeComponent,
                        schema: schema.SN_GLIST_NODE_SCHEMA,
                    }],
                }, {
                    displayName: 'SN-SERVICES',
                    components: [{
                        displayName: 'SN-SERVICE-CONNECTOR',
                        component: components.SnServiceConnectorNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SERVICE_CONNECTOR_NODE_SCHEMA,
                            'SN-SERVICE-CONNECTOR', languages),
                    }, {
                        displayName: 'SN-SERVICE-SMART-OBJECT',
                        component: components.SnServiceSmartObjectV2NodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SERVICE_SMARTOBJECTV2_NODE_SCHEMA,
                            'SN-SERVICE-SMART-OBJECT-NODE', languages),
                    }, {
                        displayName: 'SN-SERVICE-SMART-OBJECT',
                        component: components.SnServiceSmartObjectNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SERVICE_SMARTOBJECT_NODE_SCHEMA,
                            'SN-SERVICE-SMART-OBJECT-NODE', languages),
                    }, {
                        displayName: 'SN-SERVICE-TREE-SEARCH',
                        component: components.SnServiceTreeSearchNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SERVICE_TREESEARCH_NODE_SCHEMA,
                            'SN-SERVICE-TREE-SEARCH-NODE', languages),
                    }, {
                        displayName: 'SN-SERVICE-USERS',
                        component: components.SnServiceUsersNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SERVICE_USERS_NODE_SCHEMA, 'SN-SERVICE-USERS-NODE', languages),
                    }, {
                        displayName: 'SN-SERVICE-WORKFLOW',
                        component: components.SnServiceWorkflowNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SERVICE_WORKFLOW_NODE_SCHEMA,
                            'SN-SERVICE-WORKFLOW-NODE', languages),
                    }]
                }]
            };

            if (!snView) {
                return entryComponents;
            }

            const entryInputs: any = this.entryComponents.getEntryInputs(snView);
            const entryOutputs: any = this.entryComponents.getEntryOutputs(snView);

            if (entryInputs.length > 0) {
                entryComponents.groups.unshift({
                    displayName: 'SN-INPUT-VALUE',
                    components: entryInputs,
                });
            }

            if (entryOutputs.length > 0) {
                entryComponents.groups.unshift({
                    displayName: 'SN-OUTPUT-VALUE',
                    components: entryOutputs,
                });
            }

            return entryComponents;
        };
    }
}
