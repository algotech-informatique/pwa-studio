import { Injectable } from '@angular/core';
import { SnView, SnNode, SnParam, SnLang } from '../../../../smart-nodes/models';
import { of } from 'rxjs';
import { DialogMessageService, DatasService } from '../../../../../services';
import { SmartModelDto, SmartPropertyModelDto, PatchService, PatchPropertyDto } from '@algotech-ce/core';
import * as _ from 'lodash';
import { CrudDto } from '../../../../../dtos';
import { RxExtendService, SmartModelsService } from '@algotech-ce/angular';
import { flatMap, map, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment'; 

@Injectable()
export class SnPublishModelService {

    constructor(
        private translate: TranslateService,
        private dialogMessageService: DialogMessageService,
        private datasService: DatasService,
        private smartModelService: SmartModelsService,
        private rxExtend: RxExtendService) {
    }

    publish(snView: SnView, customerKey: string, host: string) {
        const operations: CrudDto[] = this.getOperations(snView, customerKey, host);

        if (operations.length === 0) {
            return of(false);
        }

        const operations$ = _.map(operations, (crud: CrudDto) => {
            switch (crud.op) {
                case 'update':
                    return this.smartModelService.put(crud.value);
                case 'add':
                    return this.smartModelService.post(crud.value);
                case 'remove':
                    return this.smartModelService.delete(crud.value);
            }
        });

        return this.confirm(operations).pipe(
            flatMap((data) => {
                if (!data) {
                    return of(null);
                }

                return this.rxExtend.sequence(operations$).pipe(
                    map(() => true),
                    tap(() => {
                        this.datasService.notifyPublishSmartModels(customerKey, host, this.createSmartModels(snView));
                    }));
            }),
        );
    }

    confirm(operations: CrudDto[]) {
        return this.dialogMessageService.getMessageConfirm({
            title: this.translate.instant('SMARTMODEL-PUBLISHED-TITLE'),
            message: this.translate.instant('SMARTMODEL-PUBLISHED-MESSAGE'),
            detail: this.translate.instant('SMARTMODEL-PUBLISHED-DETAIL', {
                add: operations.filter((op) => op.op === 'add').length,
                update: operations.filter((op) => op.op === 'update').length,
                remove: operations.filter((op) => op.op === 'remove').length,
            }),
            confirm: this.translate.instant('SMARTMODEL-PUBLISHED-PUBLISH'),
            cancel: this.translate.instant('SMARTMODEL-PUBLISHED-CANCEL'),
            type: 'warning',
            messageButton: true,
        });
    }

    getOperations(snView: SnView, customerKey: string, host: string): CrudDto[] {
        const operations: CrudDto[] = [];
        const preSmartmodels = this.datasService.findData(customerKey, host).read.smartModels;
        const newSmartModels = this.createSmartModels(snView);

        // update
        operations.push(..._.reduce(newSmartModels, (results: CrudDto[], smartModel: SmartModelDto) => {
            const findModel = preSmartmodels.find((sm) => sm.uuid === smartModel.uuid);
            if (findModel) {
                const patchService = new PatchService<SmartModelDto>();
                const patches: PatchPropertyDto[] = this.filterPatch(patchService.compare(findModel, smartModel));
                if (patches.length > 0) {
                    const operation: CrudDto = {
                        op: 'update',
                        value: Object.assign(smartModel, { updateDate: moment().format() }),
                    };
                    results.push(operation);
                }
            }
            return results;
        }, []));

        // remove
        operations.push(..._.reduce(preSmartmodels, (results: CrudDto[], smartModel: SmartModelDto) => {
            const findModel = newSmartModels.find((sm) => sm.uuid === smartModel.uuid);
            if (!findModel) {
                const operation: CrudDto = {
                    op: 'remove',
                    value: smartModel.uuid,
                };
                results.push(operation);
            }
            return results;
        }, []));

        // add
        operations.push(..._.reduce(newSmartModels, (results: CrudDto[], smartModel: SmartModelDto) => {
            const findModel = preSmartmodels.find((sm) => sm.uuid === smartModel.uuid);
            if (!findModel) {
                const operation: CrudDto = {
                    op: 'add',
                    value: smartModel,
                };
                results.push(operation);
            }
            return results;
        }, []));

        return operations;
    }

    createSmartModels(snView: SnView): SmartModelDto[] {
        return _.map(_.cloneDeep(snView.nodes), (node: SnNode) => {
            const smartModel: SmartModelDto = {
                uuid: node.id,
                displayName: node.displayName as SnLang[],
                domainKey: node.parentId ? node.parentId : 'undefined', // todo remove
                key: node.custom.key,
                permissions: node.custom.permissions,
                skills: node.custom.skills,
                uniqueKeys: node.custom.uniqueKeys,
                system: false,
                description: node.custom.description,
                properties: _.map(node.sections[0].params, (param: SnParam) => {
                    const property: SmartPropertyModelDto = {
                        uuid: param.id,
                        key: param.key,
                        keyType: param.types as string,
                        multiple: param.multiple,
                        displayName: param.displayName as SnLang[],
                        composition: param.value.composition,
                        defaultValue: param.value.defaultValue,
                        hidden: param.value.hidden,
                        items: param.value.items,
                        permissions: param.value.permissions,
                        required: param.required,
                        system: false,
                        validations: [],
                        description: param.value.description,
                    };
                    return property;
                })
            };

            return smartModel;
        });

    }

    private filterPatch(patches: PatchPropertyDto[]): PatchPropertyDto[] {
        return _.reduce(patches, (result, patch: PatchPropertyDto) => {
            if (patch.path !== '/updateDate' && patch.path !== '/createdDate') {
                result.push(patch);
            }
            return result;
        }, []);
    }
}
