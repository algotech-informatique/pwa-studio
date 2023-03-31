import { Injectable } from '@angular/core';
import { ImportDataFileDto, ImportDataModel } from '../../../components/import-data/dto/import-data-file.dto';
import { ValidateData, ValidateDataFileDto, ValidateDataModel } from '../../../components/import-data/dto/validate-data-file.dto';
import { ImportDataUtilsService } from '../import-data-utils.service';
import * as _ from 'lodash';
import { GenericListDto, PairDto, SmartModelDto, SmartObjectDto, SmartPropertyModelDto } from '@algotech-ce/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { SessionsService } from '../../sessions/sessions.service';
import { first, map } from 'rxjs/operators';

@Injectable()
export class ImportValidateDataService {

    constructor(
        private importUtilsService: ImportDataUtilsService,
        private translateService: TranslateService,
        private sessionService: SessionsService,
    ) {}

    validateObject(data: ImportDataFileDto, forceData: boolean,
        dataList: ImportDataFileDto, inputLog: string): Observable<ValidateDataFileDto> {

        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL'), false);

        return this._validateData(data, dataList, forceData, inputLog).pipe(
            map((importData: ValidateDataModel[]) => {
                const valide = !_.some(importData, (imd: ValidateDataModel) => imd.valide === false);
                const validate: ValidateDataFileDto = {
                    type: 'object',
                    valide,
                    importData,
                };
                return validate;
            }),
        );
    }

    _validateData(data: ImportDataFileDto, dataList: ImportDataFileDto,
        forceData: boolean, inputLog: string): Observable<ValidateDataModel[]> {

        const obj$: Observable<ValidateDataModel>[] = _.map(data.importData, (dt: ImportDataModel) => {
            const smartModel: SmartModelDto = this.importUtilsService.getSmartModel(dt.model);

            return this._validateSmartObject(dt, smartModel, dataList, forceData, inputLog).pipe(
                map((dataImport: ValidateData[]) => {
                    const valideData = !_.some(dataImport, (valD: ValidateData) => valD.valide === false);
                    const valideUnicity = this.importUtilsService.findDuplicates(dt.data, dt.model, inputLog);
                    const valideModel = this._validationSmartModel(dt, smartModel, forceData, inputLog);
                    const valide = (valideData && valideUnicity && valideModel);

                    if (valide) {
                        this.importUtilsService.sendMessageService(inputLog,
                            this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-OK', {model: smartModel.key}), false);
                    }
                    if (!valide) {
                        this.importUtilsService.sendMessageService(inputLog,
                            this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-ERROR',
                            { model: (smartModel) ? smartModel.key : '' }), true);
                    }
                    return {valide, model: dt.model, data: dataImport };
                }),
                first(),
            );
        });
        return this.importUtilsService.sequence(obj$);
    }

    _validationSmartModel(dt: ImportDataModel, smartModel: SmartModelDto, forceData: boolean, inputLog): boolean {
        let valideModel = true;
        if (dt.data.length === 0) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-EMPTY-LIST', {model: dt.model}), false);
            return true;
        }
        if (!smartModel) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-NO-MODEL-ERROR', {model: dt.model}), true);
            valideModel = false;
        }

        const key = this.importUtilsService.findPivotKEY(dt.data[0]);
        if (!key && forceData) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-UNIQUE-KEY', {model: dt.model}), true);
            valideModel = false;
        }
        if (!this._rowToSmartModel(dt.data[0], smartModel, inputLog)) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-COMPATIBILITY-ERROR', {model: dt.model}), true);
            valideModel = false;
        }
        return valideModel;
    }

    _validateSmartObject(dt: ImportDataModel, smartModel: SmartModelDto,  dataList: ImportDataFileDto,
        forceData: boolean, inputLog: string): Observable<ValidateData[]> {

        const obj$: Observable<ValidateData>[] = _.map(dt.data, (row, index) => {
            const so$: Observable<SmartObjectDto> = (forceData) ? of(null) : this._smartObjectExists(row, smartModel);
            return so$.pipe(
                map((so: SmartObjectDto) => {
                    const validate: ValidateData = this._validate(row, index + 2, smartModel, forceData, dataList, inputLog);
                    if (so) {
                        this.importUtilsService.sendMessageService(inputLog,
                            this.translateService.instant('IMPORT-DATA.VALIDATE-OBJECT-EXISTS',
                            {index: index + 2, model: smartModel.key }), true);
                        validate.valide = false;
                    }
                    return validate;
                }),
                first(),
            );
        });
        return this.importUtilsService.sequence(obj$);
    }

    _validate(row, index, smartModel: SmartModelDto, forceData: boolean, dataList: ImportDataFileDto, inputLog: string): ValidateData {

        const valide = this._rowToSmartObject(row, index, smartModel, dataList, inputLog);
        return {valide, object: row};
    }

    _getList(model: SmartModelDto): PairDto[] {
        return _.reduce(model.properties, (result, prop: SmartPropertyModelDto) => {
            if (prop.items) {
                const pair: PairDto = {
                    key: prop.key,
                    value: prop.items,
                };
                result.push(pair);
            }
        }, []);
    }

    _smartObjectExists(row, model: SmartModelDto): Observable<SmartObjectDto> {
        const propKey = this.importUtilsService.findPivotKEY(row);
        if (propKey) {
            const key = propKey.split(':')[0];
            return (key && model) ? this.importUtilsService.returnObject(
                null, model.key, key, row[propKey]) : of(null);
        }
        return of(null);
    }

    _rowToSmartModel(row, model: SmartModelDto, inputLog: string): boolean {
        const val: boolean[] = (model && model.properties.length !== 0) ?  _.map(model.properties, (prop: SmartPropertyModelDto) => {
            const propKey = this.importUtilsService.findPropKey(row, prop.key, true);
            if (!propKey) {
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-PROP-ERROR', {prop: prop.key, model: model.key}), true);
                return false;
            } else {
                return this._validateFormatProperty(propKey, model, inputLog);
            }
        }) : [] ;
        return !_.some(val, (v) => v === false);
    }

    _validateFormatProperty(propKey, model: SmartModelDto, inputLog: string): boolean {
        const key = this._findProperty(propKey);
        const fIndex = _.findIndex(model.properties, (prp: SmartPropertyModelDto) => prp.key.toUpperCase() === key.prop.toUpperCase());
        if (fIndex === -1) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-PROP-ERROR-EXIST', {prop: propKey, model: model.key}), true);
            return false;
        }
        const smProp: SmartPropertyModelDto = model.properties[fIndex];
        if (smProp.keyType.startsWith('so:')) {
            if (key.linkedModel === '') {
                    this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-PROP-NO-DEFINED',
                    {prop: propKey, model: smProp.keyType}), true);
                return false;
            }
            return this._validateLinkedModel(propKey, key, smProp, model, inputLog);
        }
        return true;
    }

    _validateLinkedModel(propKey: string, key, smProp: SmartPropertyModelDto, model: SmartModelDto, inputLog: string) {
        if (smProp.keyType !== `so:${key.linkedModel}`) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-PROP-NO-DEFINED-CORRECT',
                {prop: propKey, model: smProp.keyType}), true);
            return false;
        }
        const uniqueKey = this.importUtilsService.getSmartModelUniqueKey(key.linkedModel);
        if (!uniqueKey) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-UNIQUE-KEY', {model: key.linkedModel}), true);
            return false;
        }
        const extKey = `${key.linkedModel}.${uniqueKey}`;
        const formatedKey = `${key.prop}:[${extKey}]`;
        if (formatedKey !== propKey) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-PROP-ERROR-EXTERNAL-LINK',
                {prop: propKey, model: model.key, extkey: extKey}), true);
            return false;
        }
        return true;
    }

    _findProperty(key) {
        if (key.indexOf(':') === -1) {
            return {
                key,
                prop: key,
                type: 'simple',
                linkedModel: '',
                linkedProp: '',
            };
        }
        if (key.indexOf(':[KEY]') !== -1) {
            return {
                key,
                prop: key.split(':')[0],
                type: 'key',
                linkedModel: '',
                linkedProp: '',
            };
        }
        const k = key.split(':')[1].replace('[', '').replace(']', '').split('.');
        return {
             key,
             type: 'link',
             prop: key.split(':')[0],
             linkedModel: k[0],
             linkedProp: k[1]
         };
    }

    _rowToSmartObject = (row, index, model, dataList: ImportDataFileDto, inputLog: string ) => {
        const properties = (model && model?.properties.length !== 0) ?
            _.map(model.properties, (prop) => this._rowToProp(row, index, prop, model.key, dataList, inputLog)) : [];
        return !_.some(properties, (prop) => prop.valide === false);
    };

    _rowToProp = (row, index, prop: SmartPropertyModelDto, model: string, dataList: ImportDataFileDto, inputLog: string) => {
        const propKey = this.importUtilsService.findPropKey(row, prop.key);
        if (!propKey) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-PROP-ERROR', {prop: prop.key, model, index}), true);
            return {prop, valide: false};
        }
        if (prop.required && !row[propKey]) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-PROP-REQUIRED-ERROR', {prop: prop.key, model, index}), true);
            return {prop, valide: false};
        }

        const valide = this.importUtilsService.testValueByType(prop.keyType, row[propKey]);
        if (!valide) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-PROP-FORMAT-ERROR', {prop: prop.key, model, index}), true);
            if (prop.keyType === 'date' || prop.key === 'datetime') {
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.VALIDATE-PROP-FORMAT-ERROR-DATE', {prop: prop.key }), true);
            }
            return {prop, valide: false};
        }
        if (prop.items) {
            if (!this._validateRowList(prop, row[propKey], dataList)) {
                this.importUtilsService.sendMessageService(inputLog, this.translateService.instant('IMPORT-DATA.VALIDATE-PROP-LIST-ERROR',
                    {prop: prop.key, value: row[propKey], model, index}), true);
                    return {prop, valide: false};
            }
        }
        return {prop, valide: true};
    };

    _validateRowList(prop: SmartPropertyModelDto, value: string, dataList: ImportDataFileDto): boolean {
        const items = (prop.items as string) ? [prop.items] : prop.items;
        const validate = _.map(items, (item) => {
            const findIndex = _.findIndex(dataList, (data: ImportDataModel) => data.model === item);
            const dataIndex = (findIndex !== -1) ? dataList[findIndex] : null;
            const valide: boolean[] = (prop.multiple) ?
                this._validateArrayRowListValue(dataIndex, item, value, prop.required) :
                [this._validateRowListValue(dataIndex, item, value, prop.required)];
            return !_.some(valide, (val) => val === false);
        });
        return !_.some(validate, (val) => val === false);
    }

    _validateArrayRowListValue(data: ImportDataModel, item: string, value: string, required: boolean): boolean[] {
        const valArray: string[] = value.split('|');
        return _.map(valArray, (val) => this._validateRowListValue(data, item, val, required) );
    }

    _validateRowListValue(data: ImportDataModel, item: string, value: string, required: boolean) {

        if (!value && !required) {
            return true;
        }
        if (!value && required) {
            return false;
        }
        return (data) ?
            this._getValueData(data, item, value.toString()) :
            this._getListValueData(item, value.toString());
    }

    _getValueData(dataList: ImportDataModel, item: string, value: string): boolean {
        const index = _.findIndex(dataList.data, (object) => object.key === value);
        return (index !== -1);
    }

    _getListValueData(item: string, value: string): boolean {
        const findIndex = _.findIndex(this.sessionService.active.datas.read.glists, (glist: GenericListDto) => glist.key === item);
        if (findIndex !== -1) {
            const index = _.findIndex(this.sessionService.active.datas.read.glists[findIndex].values, (object) =>
                object.key.toUpperCase() === value.toUpperCase());
            return (index !== -1);
        }
        return true;
    }
}
