import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as components from '../../../index-component';
import * as schema from '../../../index-schema';
import { SnTranslateService } from '../../../../smart-nodes/services';
import { SnView, SnLang } from '../../../../smart-nodes/models';
import { SnEntryComponents } from '../../../../smart-nodes/dto';
import { EntryComponentsService } from '../entry-components/entry-components.service';
import { SnArrayFunctionNodeHelper, SnObjectFunctionNodeHelper, SnObjectCreationNodeHelper } from '../../../index-helper';

@Injectable()
export class SmartflowEntryComponentsService {

    constructor(private snTranslate: SnTranslateService, private entryComponents: EntryComponentsService) { }

    getEntryComponents(languages: SnLang[], customerKey: string, host: string, connectorUuid: string):
        (snView: SnView) => SnEntryComponents {
        return (snView: SnView): SnEntryComponents => {
            const entryComponents: SnEntryComponents = {
                groups: [{
                    displayName: 'SN-TASK-GROUP-LIFECYCLE',
                    components: [{
                        displayName: 'SN-LAUNCHER',
                        component: components.SnLauncherNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_LAUNCHER_NODE_SCHEMA, 'SN-LAUNCHER', languages)
                    }, {
                        displayName: 'SN-FINISHER',
                        component: components.SnFinisherNodeComponent,
                        schema: schema.SN_FINISHER_NODE_SCHEMA(
                            this.entryComponents.initializeLangs('SN-FINISHER', languages),
                            false,
                        )
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
                        displayName: 'SN-CONNECTOR',
                        component: components.SnConnectorNodeComponent,
                        schema: schema.SN_CONNECTOR_NODE_SCHEMA(
                            this.entryComponents.initializeLangs('SN-CONNECTOR', languages),
                            this.entryComponents.initializeLangs('SN-SERVICE-DONE', languages),
                            this.entryComponents.initializeLangs('SN-SERVICE-ERROR', languages),
                        )
                    }, {
                        displayName: 'SN-SLEEP',
                        component: components.SnSleepNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SLEEP_NODE_SCHEMA, 'SN-SLEEP', languages)
                    }]
                }, {
                    displayName: 'SN-SERVICE',
                    components: [{
                        displayName: 'SN-SERVICE',
                        component: components.SnServiceNodeComponent,
                        schema: schema.SN_SERVICE_NODE_SCHEMA(
                            this.entryComponents.initializeLangs('SN-SERVICE', languages),
                            this.entryComponents.initializeLangs('SN-SERVICE-DONE', languages),
                            this.entryComponents.initializeLangs('SN-SERVICE-ERROR', languages),
                        )
                    }, {
                        displayName: 'SN-DB-CONNECTOR',
                        component: components.SnDBConnectorNodeComponent,
                        schema: schema.SN_DB_CONNECTOR_NODE_SCHEMA
                    }, {
                        displayName: 'SN-QUERY-BUILDER',
                        component: components.SnQueryBuilderNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_QUERY_BUILDER_NODE_SCHEMA, 'SN-QUERY-BUILDER', languages)
                    }, {
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
                    }, {
                        displayName: 'SN-REQUEST-RESULT',
                        component: components.SnRequestResultNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_REQUEST_RESULT_NODE_SCHEMA, 'SN-REQUEST-RESULT', languages)
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
                    }, {
                        displayName: 'SN-MERGE',
                        component: components.SnMergeNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_MERGE_NODE_SCHEMA, 'SN-MERGE', languages)
                    }, {
                        displayName: 'SN-MERGE',
                        component: components.SnMergeV2NodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_MERGEV2_NODE_SCHEMA, 'SN-MERGE', languages)
                    }
                    ]
                }, {
                    displayName: 'SN-TASK-GROUP-DOCUMENT',
                    components: [{
                        displayName: 'SN-DOCUMENT-LOCK',
                        component: components.SnDocumentLockNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_LOCK_NODE_SCHEMA, 'SN-DOCUMENT-LOCK', languages)
                    }, {
                        displayName: 'SN-DOCUMENT-DELETION',
                        component: components.SnDocumentDeletionNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_DOCUMENT_DELETION_NODE_SCHEMA,
                            'SN-DOCUMENT-DELETION', languages)
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
                        displayName: 'SN-EMAIL',
                        component: components.SnEmailNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_EMAIL_NODE_SCHEMA, 'SN-EMAIL', languages)
                    }, {
                        displayName: 'SN-NOTIFICATION',
                        component: components.SnNotificationNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_NOTIFICATION_NODE_SCHEMA, 'SN-NOTIFICATION', languages)
                    }, {
                        displayName: 'SN-SCHEDULE-AUTO-CREATION',
                        component: components.SnScheduleAutoCreationNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SCHEDULE_AUTO_CREATION_NODE_SCHEMA,
                            'SN-SCHEDULE-AUTO-CREATION', languages)
                    }, {
                        displayName: 'SN-SCHEDULE-DELETION',
                        component: components.SnScheduleDeletionNodeComponent,
                        schema: this.entryComponents.createSchema(schema.SN_SCHEDULE_DELETION_NODE_SCHEMA,
                            'SN-SCHEDULE-DELETION', languages)
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
                    }, {
                        displayName: 'SN-JSON-NODE',
                        component: components.SnJsonNodeComponent,
                        schema: schema.SN_JSON_NODE_SCHEMA,
                    }, {
                        displayName: 'SN-ARRAY-DATA',
                        component: components.SnArrayNodeComponent,
                        schema: schema.SN_ARRAY_NODE_SCHEMA
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
                    }]
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

            const entryConnectorsParams: any =
                this.entryComponents.getEntryConnectorsParams(customerKey, host, connectorUuid);
            const entryInputs: any = this.entryComponents.getEntryInputs(snView);
            const entryOutputs: any = this.entryComponents.getEntryOutputs(snView);

            if (entryInputs.length > 0) {
                entryComponents.groups.unshift({
                    displayName: 'SN-INPUT-VALUE',
                    components: entryInputs,
                });
            }

            if (snView.options?.api) {
                const urlSegmentsInputs = this.entryComponents.getApiInputs(snView, 'url-segment',
                    'INSPECTOR.SMART_FLOW.API.PATH_PARAMETER');
                const queryParameters = this.entryComponents.getApiInputs(snView, 'query-parameter',
                    'INSPECTOR.SMART_FLOW.API.QUERY_PARAMETER');
                const headers = this.entryComponents.getApiInputs(snView, 'header', 'INSPECTOR.SMART_FLOW.API.HEADER');
                const body = this.entryComponents.getApiInputs(snView, 'body', 'INSPECTOR.SMART_FLOW.API.BODY');

                if (urlSegmentsInputs.length > 0) {
                    entryComponents.groups.unshift({
                        displayName: 'INSPECTOR.SMART_FLOW.API.PATH_PARAMETERS',
                        components: urlSegmentsInputs,
                    });
                }

                if (queryParameters.length > 0) {
                    entryComponents.groups.unshift({
                        displayName: 'INSPECTOR.SMART_FLOW.API.QUERY_PARAMETERS',
                        components: queryParameters,
                    });
                }

                if (headers.length > 0) {
                    entryComponents.groups.unshift({
                        displayName: 'INSPECTOR.SMART_FLOW.API.HEADERS',
                        components: headers,
                    });
                }

                if (body.length > 0) {
                    entryComponents.groups.unshift({
                        displayName: 'INSPECTOR.SMART_FLOW.API.BODY',
                        components: body,
                    });
                }
            }

            if (entryOutputs.length > 0) {
                entryComponents.groups.unshift({
                    displayName: 'SN-OUTPUT-VALUE',
                    components: entryOutputs,
                });
            }

            if (entryConnectorsParams.length > 0) {
                entryComponents.groups.unshift({
                    displayName: 'SN-CONNECTOR-PARAMETER',
                    components: entryConnectorsParams,
                });
            }

            return entryComponents;
        };
    }

}
