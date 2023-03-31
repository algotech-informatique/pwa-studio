import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { SnActionsService, SnUtilsService, SnLang, SnView, SnSelectionEvent, SnParam,
    SnNode, SnRemoveSelection, SnContextmenuActionExtension, SnTranslateService, SnSelectionService } from '../../modules/smart-nodes';
import { SnModelDto, SmartModelDto } from '@algotech-ce/core';
import { SnSettings } from '../../modules/smart-nodes/dto/sn-settings';
import { DialogMessageService, SessionsService, DatasService } from '../../services';
import { ModelEntryComponentsService } from '../../modules/smart-nodes-custom';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-uuid';

@Injectable()
export class ModelEditorService {

    constructor(
        private snTranslate: SnTranslateService,
        private translate: TranslateService,
        private entryComponentsService: ModelEntryComponentsService,
        private dialogMessageService: DialogMessageService,
        private sessionService: SessionsService,
        private snSelection: SnSelectionService,
        private snActions: SnActionsService,
        private datasService: DatasService,
        private snUtils: SnUtilsService) { }

    buildSettings(snView: SnView, snModel: SnModelDto, host: string, customerKey: string, languages: SnLang[]): SnSettings {
        const isSAdmin = _.indexOf(this.sessionService.active.datas.read.localProfil.groups, 'sadmin') !== -1;
        const settings: SnSettings = {
            module: 'smartmodel',
            languages,
            theme: 'dark',
            contextmenus: {
                default: [
                    'add-group',
                    'add-box',
                    {
                        id: 'add-model',
                        icon: 'fa-solid fa-square',
                        title: 'SN-CONTEXTMENU.SCHEMA.ADD-SMARTMODEL',
                        onClick: (event) => {
                            const container = this.snUtils.getEndpointContainer(event.x, event.y, snView);
                            this.snActions.createNewNodeFromScratch(snView, container, event);
                        },
                    },
                    'paste'
                ],
                extended: this.buildExtendedMenu(snView, isSAdmin, languages),
            },
            removeConfirmation: (selection: SnRemoveSelection, done: () => void) => {
                this.removeConfirmation(snView, selection, done);
            },
            entryComponents: this.entryComponentsService.getEntryComponents(languages),
            undo: () => {
                this.datasService.undo(snModel, customerKey, host);
            },
            redo: () => {
                this.datasService.redo(snModel, customerKey, host);
            },
        };

        return settings;
    }

    buildExtendedMenu(snView: SnView, isSAdmin: boolean, languages: SnLang[]): SnContextmenuActionExtension[] {
        return _.compact(
            [
                this.buildExtendProperty(snView, 'comment', languages),
                this.buildExtendProperty(snView, 'photo', languages)
            ]);
    }

    buildExtendProperty(snView: SnView, type: string, languages: SnLang[]): SnContextmenuActionExtension {
        return {
            title: `SN-CONTEXTMENU.SCHEMA.EXTEND-PROPERTY-${type.toUpperCase()}`,
            filter: (selections: SnSelectionEvent[]) => {
                if (!(selections.length === 1 && selections[0].type === 'param' &&
                    !(selections[0].element as SnParam).key.startsWith('~__'))) {
                    return false;
                }

                const param: SnParam = selections[0].element as SnParam;
                const findArray = this.snUtils.getArrayOfParam(snView, param);
                if (!findArray) {
                    return false;
                }

                return findArray.find((elt) => elt.key === `~__${param.key}.${type}`) === undefined;
            },
            icon: type === 'comment' ? 'fa-solid fa-comment' : 'fa-solid fa-camera-retro',
            onClick: (selections: SnSelectionEvent[]) => {
                if (selections.length === 0) {
                    return;
                }
                const param: SnParam = selections[0].element as SnParam;
                const findElt = this.snUtils.getParamsWithNode(snView).find((elt) => elt.param === param);
                const findArray = this.snUtils.getArrayOfParam(snView, param);
                if (!findElt || !findArray) {
                    return;
                }

                const newParam: SnParam = _.cloneDeep(param);
                newParam.id = UUID.UUID();
                newParam.key = `~__${param.key}.${type}`;
                newParam.displayName = this.snTranslate.initializeLangs(
                    `${this.snTranslate.transform(newParam.displayName)}.${type}.ext`, languages);
                newParam.toward = null;
                newParam.multiple = false;
                newParam.pluggable = false;
                newParam.required = false;
                newParam.types = type === 'comment' ? 'sys:comment' : 'sys:file';
                newParam.value = {
                    hidden: false,
                    composition: false,
                    permissions: newParam.value.permissions
                };

                this.snActions.addParam(snView, findElt.node, newParam, findArray, findArray.indexOf(param) + 1);
                this.snSelection.select(null, snView, { element: newParam, type: 'param' });
            },
        };
    }

    removeConfirmation(snView: SnView, selection: SnRemoveSelection, done: () => void) {
        // has nodes and associated smart model published
        const hasModel = selection.nodes.length > 0;

        // has params and associated properties published
        const allParams = this.snUtils.getParamsWithNode(snView);
        const hasProperties = selection.params.length > 0 && _.some(selection.params, (p: { param: SnParam, params: SnParam[] }) => {
            const findParam = allParams.find((elt) => elt.param.id === p.param.id);
            if (!findParam) {
                return false;
            }
            return this._modelPublished(findParam.node);
        });

        if (!hasModel && !hasProperties) {
            done();
            return;
        }

        const keyWord = hasModel ? 'SN-DELETE-SMART-MODEL' : 'SN-DELETE-PROPERTY';

        this.dialogMessageService.getMessageConfirm({
            title: this.translate.instant(`${keyWord}-TITLE`),
            message: this.translate.instant(`${keyWord}-MESSAGE`),
            detail: this.translate.instant(`${keyWord}-DETAIL`),
            confirm: this.translate.instant('SN-DELETE-CONFIRM'),
            cancel: this.translate.instant('SN-DELETE-CANCEL'),
            type: 'warning',
            messageButton: true,
        }).pipe()
            .subscribe((data: boolean) => {
                if (data) {
                    done();
                }
            });
    }

    _modelPublished(node: SnNode) {
        return this.sessionService.active.datas.read.smartModels.find((sm: SmartModelDto) => node.custom.key === sm.key) !== undefined;
    }
}
