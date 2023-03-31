import { ATSkillsDto, SmartModelDto, SmartObjectDto, SmartPropertyObjectDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';
import { ImportDataUtilsService } from '../import-data-utils.service';
import { ImportDataFileDto, ImportDataModel } from '../../../components/import-data/dto/import-data-file.dto';
import { SmartObjectsService } from '@algotech-ce/angular';
import { ValidateImportDataDto, ValidateImportDataModelDto } from '../../../components/import-data/dto/validate-import-data.dto';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { InsertSmartObject } from '../../../components/import-data/dto/import-insert-object.dto';

@Injectable()
export class ImportObjectsDataService {

    constructor(
        private importUtilsService: ImportDataUtilsService,
        private smartObjectService: SmartObjectsService,
        private translateService: TranslateService,
    ) {}

    importObjects(data: ImportDataFileDto, forceData: boolean, inputLog: string): Observable<ValidateImportDataDto> {

        if (data.importData.length === 0) {
            return of( { type: data.type, valide: true, importData: [] });
        }
        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.START-DATA-SO-IMPORT'), false);

        return this._importObjects(data, forceData, inputLog).pipe(
            map((importData: ValidateImportDataModelDto[]) => {
                const valide = !_.some(importData, (dt: ValidateImportDataModelDto) => dt.valide === false);
                const validate: ValidateImportDataDto = {
                    valide,
                    type: 'object',
                    importData,
                };
                return validate;
            }),
        );
    }

    _importObjects(data: ImportDataFileDto, forceData: boolean, inputLog: string): Observable<ValidateImportDataModelDto[]> {

        const import$: Observable<ValidateImportDataModelDto>[] = _.map(data.importData, (dt: ImportDataModel) => {

            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.START-DATA-SO-IMPORT-MODEL', { model: dt.model }), false);

            if (dt.data.length === 0) {
                const validate: ValidateImportDataModelDto = {
                    valide: true,
                    data: [],
                    model: dt.model
                };
                return of(validate);
            }

            const smartModel: SmartModelDto = this.importUtilsService.getSmartModel(dt.model);
            if (!smartModel) {
                const validate: ValidateImportDataModelDto = {
                    valide: true,
                    data: [],
                    model: dt.model
                };
                return of(validate);
            }

            return this._getObjects(dt, smartModel, forceData).pipe(
                switchMap((asos: InsertSmartObject[]) =>
                    this._insertObjects(asos),
                ),
                map((objects: SmartObjectDto[]) => {
                    const validate: ValidateImportDataModelDto = {
                        valide: true,
                        data: objects,
                        model: dt.model
                    };
                    return validate;
                }),
                first(),
            );
        });
        return this.importUtilsService.sequence(import$);
    }

    _insertObjects(sos: InsertSmartObject[]): Observable<SmartObjectDto[]> {
        const obj$: Observable<SmartObjectDto>[] = _.map(sos, (so: InsertSmartObject) =>
            (!so.update) ?
                this.smartObjectService.post(so.smartObject) :
                this.smartObjectService.put(so.smartObject),
        );
        return this.importUtilsService.sequence(obj$);
    }

    _getObjects(data: ImportDataModel, smartModel: SmartModelDto, forceData: boolean): Observable<InsertSmartObject[]> {

        const add$: Observable<InsertSmartObject>[] = _.map(data.data, (row) =>
            (forceData) ?
                this._loadFromSO(row, data, smartModel) :
                of(this._rowToSmartObject(row, smartModel)),
        );
        return this.importUtilsService.sequence(add$);
    }

    _loadFromSO(row, data: ImportDataModel, smartModel: SmartModelDto): Observable<InsertSmartObject> {
        return this._findObject(row, data.model).pipe(
            map((so: SmartObjectDto) => {
                if (so) {
                    return this._rowLoadToSmartObject(row, so, smartModel);
                }
                return this._rowToSmartObject(row, smartModel);
            }),
        );
    }

    _findObject(row, model: string): Observable<SmartObjectDto> {
        const key = this.importUtilsService.findPivotKEY(row);
        const objModel: SmartModelDto = this.importUtilsService.getSmartModel(model);
        if (key) {
            const pivotProp = key.split(':')[0];
            return this.importUtilsService.returnObject(null, objModel.key, pivotProp, row[key]);
        }
        return of(null);
    }

    _rowToSmartObject(row, model: SmartModelDto): InsertSmartObject {
        const properties = _.map(model.properties, (prop) => this._rowToProp(row, prop));
        const obj: SmartObjectDto = {
            uuid: UUID.UUID(),
            modelKey: model.key,
            skills: this._rowToSkills(),
            properties
        };
        return { smartObject: obj, update: false, oldSmartObject: null };
    }

    _rowLoadToSmartObject = (row, so: SmartObjectDto, model: SmartModelDto) => {
        const oldSo = _.cloneDeep(so);
        const properties = _.map(model.properties, (prop) => this._rowToProp(row, prop));
        _.forEach(properties, (prop: SmartPropertyObjectDto) => {
            const findIndex = _.findIndex(so.properties, (prp: SmartPropertyObjectDto) => prp.key === prop.key);
            if (findIndex !== -1) {
                so.properties[findIndex].value = prop.value;
            } else {
                so.properties.push(prop.value);
            }
        });
        return { smartObject: so, update: true, oldSmartObject: oldSo };
    };

    _rowToSkills(): ATSkillsDto {
        const skills: ATSkillsDto = {
            atDocument: {
                documents: []
            },
            atGeolocation: {
                geo: []
            },
            atTag: {
                tags: []
            },
            atSignature: undefined,
        };
        return skills;
    }

    _rowToProp = (row, prop) => {
        let value;
        const propKey = this.importUtilsService.findPropKey(row, prop.key);
        value = (prop.items) ?
            this.importUtilsService.getListValue(prop.items, row[propKey]) :
            this.importUtilsService.setValueByType(prop.keyType, row[propKey]);
        if (prop.multiple && row[propKey]) {
            value = value === '' ? [] : row[propKey].split('|');
            if (value.size > 0) {
                value = _.map(value, (v) => this.importUtilsService.setValueByType(prop.keyType, v));
            }
        } else if (prop.multiple && value === '') {
            value = [];
        }
        return {
            key: prop.key,
            value
        };
    };

}
