import { GenericListDto, SearchSODto, SmartModelDto, SmartObjectDto, SmartPropertyModelDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import { SessionsService } from '../sessions/sessions.service';
import * as _ from 'lodash';
import { ImportDataDocDto } from '../../components/import-data/dto/import-data-doc.dto';
import { ImportDataFileDto, ImportDataModel } from '../../components/import-data/dto/import-data-file.dto';
import { ValidateData } from '../../components/import-data/dto/validate-data-file.dto';
import { MessageService } from '../message/message.service';
import { TranslateService } from '@ngx-translate/core';
import { RxExtendService, SmartObjectsService } from '@algotech/angular';
import { Observable, of, throwError, zip  } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ValidateImportDataDto, ValidateImportDataModelDto } from '../../components/import-data/dto/validate-import-data.dto';
import { OptionLoggerMessage } from '../../components/options/components/options-logger/option-logger-message.dto';
import { ImportDataDocService } from './import-data-doc.service';
import moment from 'moment'; 

@Injectable()
export class ImportDataUtilsService {

    constructor(
        private sessionService: SessionsService,
        private messageService: MessageService,
        private translateService: TranslateService,
        private smartObjectService: SmartObjectsService,
        private importDataDocService: ImportDataDocService,
        private rxExtend: RxExtendService,
    ) {}

    sequence(array$: Observable<any>[], sequenceMaxCall = 50): Observable<any[]> {
        const sequence = [];
        const maxCall = sequenceMaxCall;
        while (array$.length > 0) {
            sequence.push(zip(..._.slice(array$, 0, maxCall)).pipe(
                catchError((err) => throwError(err)),
            ));
            array$.splice(0, maxCall);
        }

        return sequence.length === 0 ? of([]) : this.rxExtend.sequence(sequence).pipe(
            map((res) => _.flatten(res)),
        );
    }

    sendMessageService(inputLog: string, message: string, isError: boolean) {
        const optionMessage: OptionLoggerMessage = {
            message,
            isError,
        };
        this.messageService.send(inputLog, optionMessage);
    }

    getSmartModel(modelKey: string): SmartModelDto {
        const index = _.findIndex(this.sessionService.active.datas.read.smartModels,
            (model: SmartModelDto) => model.key.toUpperCase() === modelKey.toUpperCase());
        if (index !== -1) {
            return this.sessionService.active.datas.read.smartModels[index];
        }
        return null;
    }

    getSmartModelUniqueKey(model: string): string {
        const smModel: SmartModelDto = this.getSmartModel(model);
        return (smModel.uniqueKeys.length !== 0) ? smModel.uniqueKeys[0] : '';
    }

    getSmartModelProperty(propKey: string, modelKey: string): SmartPropertyModelDto {
        const model: SmartModelDto = this.getSmartModel(modelKey);
        return (model) ?
            model.properties.find((pr) => pr.key === propKey) : null;
    }

    findPropKey = (row, key, validateModel: boolean = false) => {
        let ret = (validateModel) ? '' : key;
        if (row) {
            for (const [k, value] of Object.entries(row)) {
                const rowKey = k.split(':')[0];
                if (rowKey === key) {
                    ret = k;
                    break;
                }
            }
        }
        return ret;
    };

    getDocumentIndex(fileName: string, fPath: string, data: object[]): number {
        if (!fileName) {
            return -1;
        }
        const sPath = this._emptyPath(fPath);
        const filePath: string = (sPath !== '') ?
            this.filePathJoin(fPath, fileName, '/') : this._replace(fileName);
        const index = _.findIndex(data, (dt: object) => dt['FILENAME'].toUpperCase() === filePath.toUpperCase());
        return index;
    }

    getDocument(fileName: string, fPath: string, importData: ImportDataDocDto[]): boolean {

        if (!fileName) {
            return false;
        }
        const sPath = this._emptyPath(fPath);
        const filePath: string = (sPath !== '') ?
            this.filePathJoin(fPath, fileName, '/') : this._replace(fileName);
        const index = _.findIndex(importData, (data: ImportDataDocDto) => data.pathName.toUpperCase() === filePath.toUpperCase());
        return (index !== -1) ? true : false;
    }

    getDoc(fileName: string, fPath: string, fileZip: File, inputLog: string): Observable<ImportDataDocDto> {
        const sPath = this._emptyPath(fPath);
        const filePath: string = (sPath !== '') ?
        this.filePathJoin(fPath, fileName, '/') : this._replace(fileName);
        return this.importDataDocService.loadFileDoc(fileZip, filePath, inputLog);
    }

    getFile(importDocs: ImportDataDocDto[], filePath: string) {
        const index = _.findIndex(importDocs, (doc: ImportDataDocDto) =>
            doc.pathName.toUpperCase() === this._replace(filePath).toUpperCase());
        if (index !== -1) {
            return importDocs[index];
        }
        return null;
    }

    filePathJoin(filePath: string, fileName: string, separator: string): string {
        return this._pathJoin([this._replace(filePath), this._replace(fileName)],  separator);
    }

    _pathJoin(parts, sep) {
        const separator = sep || '/';
        const replace = new RegExp(separator + '{1,}', 'g');
        return parts.join(separator).replace(replace, separator);
    }

    _emptyPath(value): string {
        return (value) ? value : '';
    }

    _replace(value: string): string {
        return (value && (value as string)) ? value.replace(/\\/g, '/') : '';
    }

    findKey = (row) => {
        const keys = Object.keys(row);
        return _.reduce(keys, (result, k) => {
            if (k.indexOf('KEY:[') !== -1) {
                const sources = k.split('KEY:[');
                const values = sources[1].split('.');
                result = {
                    header: k,
                    model: values[0],
                    key: values[1].slice(0, -1)
                };
            }
            return result;
        }, null);
    };

    findExternalDocKey = (row) => {
        const keys = Object.keys(row);
        return _.reduce(keys, (result, key) => {
            if (key.indexOf('KEY:[') !== -1) {
                const k = key.split(':')[1].replace('[', '').replace(']', '').split('.');
                result.push({
                    key,
                    prop: key.split(':')[0],
                    linkedModel: k[0],
                    linkedProp: k[1]
                });
            }
            return result;
        }, []);
    };

    getListValue(item: string, value: string): string {
        if (value) {
            const findIndex = _.findIndex(this.sessionService.active.datas.read.glists, (glist: GenericListDto) => glist.key === item);
            if (findIndex !== -1) {
                const index = _.findIndex(this.sessionService.active.datas.read.glists[findIndex].values, (object) =>
                    object.key.toUpperCase() === value.toUpperCase());
                return index !== -1 ?
                    this.sessionService.active.datas.read.glists[findIndex].values[index].key :
                    value ;
            }
        }
        return '';
    }

    setValueByType = (type, value) => {
        if (type === 'number') {
            return (value) ? parseFloat(value) : null;
        } else if (type === 'date') {
            return (value) ? moment(value, 'DD/MM/YYYY').toISOString() : null;
        } else if (type === 'datetime') {
            return (value) ? moment(value, 'DD/MM/YYYY HH:mm').toISOString() : null;
        } else if (type === 'boolean') {
            return (value) ? this.getBoolean(value) : null;
        } else {
            return (value) ? value.toString() : '';
        }
    };

    testValueByType = (type, value) => {
        if (!value) {
            return true;
        }

        if (type === 'number') {
            return _.isNumber(value);
        } else if (type === 'date') {
            const splitarray: string[] = value.split(' ');
            return this._validateDate(splitarray[0]);
        } else if (type === 'datetime') {
            const splitarray: string[] = value.split(' ');
            const valDate = this._validateDate(splitarray[0]);
            const valTime = (splitarray.length > 1) ?
                this._validateTime(splitarray[1]) :
                false;
            return valDate && valTime;
        } else if (type === 'boolean') {
            return this._transformBoolean(value);
        } else {
            return (value) ? true : false;
        }
    };

    _validateDate(dateValue): boolean {
        const selectedDate = dateValue;
        if (selectedDate === '') {
            return false;
        }

        const regExp = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
        const dateArray =selectedDate.match(regExp);
        if (dateArray == null) {
            return false;
        }
        const day = dateArray[1];
        const month = dateArray[3];
        const year = dateArray[5];

        if (month < 1 || month > 12) {
            return false;
        } else if (day < 1 || day > 31) {
            return false;
        } else if ((month === 4 || month === 6 || month === 9 || month === 11) && day === 31) {
            return false;
        } else if (month === 2) {
            const isLeapYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
            if (day > 29 || (day === 29 && !isLeapYear)) {
               return false;
            }
        }
        return true;
    }

    _validateTime(value): boolean {
        if (value === '') {
            return false;
        }

        const re = /^(\d{1,2}):(\d{2})(:00)?([ap]m)?$/;
        const timeArray = value.match(re);
        if (timeArray == null) {
            return false;
        }
        if (timeArray[4]) {
            if (timeArray[1] < 1 || timeArray[1] > 12) {
                return false;
            }
        } else {
            if (timeArray[1] > 23) {
                return false;
            }
        }
        if (timeArray[2] > 59) {
            return false;
        }
        return true;
    }

    _transformBoolean(value: string) {
        const isBoolean = ((_.isBoolean(value) && value) || value.toUpperCase() === 'TRUE' || value.toUpperCase() === 'YES'
            || value.toUpperCase() === 'OUI' || value.toUpperCase() === 'NO'
            || value.toUpperCase() === 'NON' || value.toUpperCase() === 'FALSE' ||
            value === '1' || value === '0');
        return (isBoolean) ? true : false;
    }

    getBoolean(value: string): boolean {
        const isBoolean = ((_.isBoolean(value) && value) || value.toUpperCase() === 'TRUE' || value.toUpperCase() === 'YES'
        || value.toUpperCase() === 'OUI' || value === '1');
        return (isBoolean) ? true : false;
    }

    findPivotKEY = (row) => {
        let ret = '';
        if (row) {
            for (const [k, value] of Object.entries(row)) {
                if (k.indexOf(':[KEY]') !== -1) {
                    ret = k;
                    break;
                }
            }
        }
        return ret;
    };

    findLinks = (row) => {
        const links =  _.reduce(Object.keys(row), (results, key) => {
            if (key.indexOf(':') === -1 || key.indexOf(':[KEY]') !== -1) {
                return results;
            }
            const k = key.split(':')[1].replace('[', '').replace(']', '').split('.');
            results.push({
                key,
                prop: key.split(':')[0],
                linkedModel: k[0],
                linkedProp: k[1]
            });
            return results;
        }, []);
        return links;
    };

    findExternalPropertyKey = (row) => {

        const extProp = _.reduce( Object.keys(row), (result, key: string) => {
            if (key.includes(':')) {
                const rowKey = key.split(':')[1];
                if (rowKey.startsWith('[') && rowKey !== '[KEY]') {
                    let externalKey = rowKey.replace(']', '');
                    externalKey = externalKey.replace('[', '');
                    const model = externalKey.split('.');
                    result.push({ key, model: model[0], field: model[1]});
                }
            }
            return result;
        }, []);
        return extProp;
    };

    isMultiple = (model, key, inputLog: string) => {
        if (!model) {
            return false;
        }
        const prop = _.find(model.properties, { key });
        if (!prop) {
            this.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-MODEL-KEY', {key, model: model.key}), true);
            return false;
        }
        return prop.multiple;
    };

    validateDataLinks(link, data: ImportDataFileDto, importData: ImportDataModel, inputLog: string, message: string, isDocument = false):
        Observable<ValidateData[]> {

        const objModel: SmartModelDto = this.getSmartModel(importData.model);
        const objects: ImportDataModel =
            _.find(data.importData, (imp: ImportDataModel) => imp.model.toUpperCase() === link.linkedModel.toUpperCase());
        if (!objModel) {
            this.sendMessageService(inputLog,
                this.translateService.instant(message, {model: link.linkedModel}), true);
        }
        let obj$: Observable<ValidateData[]> = of([]);
        if (!objModel) {
            obj$ = this._getEmptyObject(importData.data);
        }
        if (objects && objects.data.length !== 0) {
                obj$ = this._validateData(objects, objModel, link, importData, inputLog, message, isDocument);
        } else {
            obj$ = this._validateDataExistingObject(link, importData, objModel, inputLog);
        }
        return obj$;
    }

    _validateDataExistingObject(link, importData: ImportDataModel, model: SmartModelDto, inputLog: string): Observable<ValidateData[]> {
        const object$: Observable<ValidateData>[] = _.map(importData.data, (row: ImportDataModel, index) => {
            const valueKey = row[link.key];
            if (!valueKey) {
                return of({object: row, valide: true });
            }
            const values = (valueKey + '').split('|');
            return this._validateReturnObjectBDD(link.linkedModel, link.linkedProp, values).pipe(
                map((sos: SmartObjectDto[]) => {
                    const notExistsNull = _.every(sos, null);
                    if (notExistsNull) {
                        return {object: row, valide: true };
                    } else {
                        this.sendMessageService(inputLog,
                            this.translateService.instant('IMPORT-DATA.VALIDATE-DOC-NO-EXTERNAL-KEY',
                            {model: link.linkedModel, key: link.prop, index: index + 2 }), true);
                        return {object: row, valide: false };
                    }
                }),
            );
        });
        return this.sequence(object$);
    }

    _validateReturnObjectBDD(modelKey: string, property: string, values: any[]): Observable<SmartObjectDto[]> {
        const ob$: Observable<SmartObjectDto>[]  = _.map(values, (value) => this.returnObjectBDD(modelKey, property, value));
        return this.sequence(ob$);
    }

    transformData(data, valide): ValidateData[] {
        return _.map(data, (row) => {
            const valD: ValidateData = {
                valide,
                object: row,
            };
            return valD;
        });
    }

    returnObject(dataSO: ValidateImportDataDto, model: string, prop: string, value: string): Observable<SmartObjectDto> {
        const object = this._getValidateSO(dataSO, model, prop, value);
        return (object) ? of(object) :
        this.returnObjectBDD(model, prop, value);
    }

    returnObjectBDD(model: string, prop: string, value): Observable<SmartObjectDto> {
        const modelProp: SmartPropertyModelDto = this.getSmartModelProperty(prop, model);
        const soSearch: SearchSODto = {
            modelKey: model,
            filter: [
                { key: prop, value: { criteria: 'equals', value, type: modelProp.keyType } },
            ],
            order: []
        };
        return this.smartObjectService.QuerySearchSO(soSearch).pipe(
            map((sos: SmartObjectDto[]) =>
                this._reduceSmartObjects(sos as SmartObjectDto[], prop, value),
            ),
        );
    }

    updateObjectData(data: ValidateImportDataDto, so: SmartObjectDto) {
        const fIndex = _.findIndex(data.importData, (dt) => dt.model.toUpperCase() === so.modelKey.toUpperCase());
        if (fIndex !== -1) {
            const sIndex = _.findIndex(data.importData[fIndex].data, (obj) => obj.uuid === so.uuid);
            if (sIndex !== -1) {
                data.importData[fIndex].data[sIndex] = so;
            } else {
                data.importData[fIndex].data.push(so);
            }
        }
    }

    _getValidateSO(data: ValidateImportDataDto, model: string, key: string, value: string): SmartObjectDto {
        if (!data) {
            return null;
        }
        const index = _.findIndex(data.importData, (dt: ValidateImportDataModelDto) => dt.model.toUpperCase() === model.toUpperCase());
        if (index === -1) {
            return null;
        }
        const objects: SmartObjectDto[] = (data.importData[index].data) as SmartObjectDto[];
        return this._reduceSmartObjects(objects, key, value);
    }

    _reduceSmartObjects(sos: SmartObjectDto[], prop: string, value: string): SmartObjectDto  {
        const resultSOs: SmartObjectDto[] = _.reduce(sos, (results, obj: SmartObjectDto) => {
            const propModel: SmartPropertyModelDto = this.getSmartModelProperty(prop, obj.modelKey);
            if (propModel) {
                if (_.findIndex(obj.properties, (p) => p.key === prop
                    && p.value === this.setValueByType(propModel.keyType, value)) !== -1) {
                    results.push(obj);
                }
            }
            return results;
        }, []);
        return (resultSOs.length !== 0) ? resultSOs[0] : null;
    }

    _getEmptyObject(data: any[]): Observable<ValidateData[]> {
        const objs: ValidateData[] = _.map(data, (obj) => {
            const valD: ValidateData = {
                valide: false,
                object: obj,
            };
            return valD;
        });
        return of(objs);
    }

    _validateData(objects, objModel: SmartModelDto, link, importData: ImportDataModel,
        inputLog: string, message: string, isDocument: boolean): Observable<ValidateData[]> {

        if (!objModel) {
            return of([]);
        }
        const pivotKey = (objects || (isDocument && objects) ) ?
            this.findPivotKEY(objects.data[0]) : this.findPivotKEY(importData.data[0]);
        const multiple = (isDocument) ? false : this.isMultiple(objModel, link.prop, inputLog);
        const data$: Observable<ValidateData>[] = _.map(importData.data, (obj, line) => {
            const val = obj[link.key];
            const objectData = (objects) ? objects.data : [];
            const result = (!val) ?
                of({object: obj, valide: true }) :
                (multiple) ?
                    this._getMultipleData(val, objModel.key, obj, link, pivotKey, objectData, line + 2, inputLog, message) :
                    (objects) ?
                        this._validateObjects(obj, objModel.key, link, pivotKey, objects.data, val, line + 2, inputLog, message) :
                        this._validateDataSmartObject(obj, objModel.key, link, val, line + 2, inputLog, message);
            return result;
        });
        return this.sequence(data$);
    }

    _getMultipleData(val, model: string, obj, link, pivotKey, objects, line, inputLog, message): Observable<ValidateData> {
        if (!val) {
            return of({object: obj, valide: true });
        }
        const values = val.split('|');
        const listVal$: Observable<ValidateData>[] = (objects.length !== 0) ?
            _.map(values, (vl) =>
                this._validateObjects(obj, model, link, pivotKey, objects, vl, line, inputLog, message),
            ) :
            _.map(values, (vl) =>
                this._validateDataSmartObject(obj, model, link, vl, line, inputLog, message),
        );

        const data$: Observable<ValidateData[]> = this.sequence(listVal$);
        return data$.pipe(
            map((list: ValidateData[]) => {
                const valide = !_.some(list, (vData: ValidateData) => vData.valide === false);
                const validate: ValidateData = {
                    valide,
                    object: obj,
                };
                return validate;
            }),
        );
    }

    _validateDataSmartObject(row, model: string, link, value: string, line, inputLog: string, message: string): Observable<ValidateData> {
        const propKey: SmartPropertyModelDto = this.getSmartModelProperty(this.getSmartModelUniqueKey(model), model);
        return this.smartObjectService.searchByProperty(link.linkedModel, link.linkProp, this.setValueByType(propKey.keyType, value)).pipe(
            map((list: SmartObjectDto[]) => {
                if (list.length === 0) {
                    this.sendMessageService(inputLog,
                        this.translateService.instant(message + '-KEY', {model, key: link.key, index: line, value}), true);
                }
                return {object: row, valide: list.length !== 0};
            }),
        );
    }

    _validateObjects(row, model: string, link, pivotKey, objects: Object[], value: string, line, inputLog: string, message: string):
        Observable<ValidateData> {
        let valide = true;
        const propKey: SmartPropertyModelDto = this.getSmartModelProperty(this.getSmartModelUniqueKey(model), model);
        const findIndex = _.findIndex(objects, (obj) =>
            this.setValueByType(propKey.keyType, obj[pivotKey]) === this.setValueByType(propKey.keyType, value));
        if (findIndex === -1) {
            this.sendMessageService(inputLog,
                this.translateService.instant(message + '-KEY', {model, key: link.key, index: line, value}), true);
            valide = false;
        }
        return of({ object: row, valide });
    }

    findDuplicates(data: object[], model: string, inputLog: string, defaultKey = ''): boolean {
        const rowKey = (defaultKey) ? defaultKey : this.findPivotKEY(data[0]);
        if (!rowKey) {
            return true;
        }
        const listKeys = _.map(data, (row) => row[rowKey]);
        const repeat = _.uniqBy(_.reduce(listKeys, (result, key) => {
            const indexes: number[] = this._getAllIndexes(listKeys, key);
            if (indexes.length > 1) {
                result.push({key, items: indexes.join(', ')});
            }
            return result;
        }, []), 'key');

        if (repeat.length > 0) {
            _.forEach(repeat, (rpt) => {
                this.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.DUPLICATE-ITEMS-FOUND',
                    {model, key: (!rpt.key) ? 'null' : rpt.key, index: rpt.items}), true);
            });
            return false;
        }
        return true;
    }

    _getAllIndexes(listKeys: string[], key: string): number[] {
        const indexes = [];
        let i = -1;
        while ((i = listKeys.indexOf(key, i + 1)) !== -1) {
            indexes.push(i + 2);
        }
        return indexes;
    }

    /** UTIL */
    format = (inputString) => {
        if (!inputString || inputString === '') { return ''; }

        inputString = inputString.replace(/[ŧ←↓·=→ł!@#$%^&*(),.?":{}|<>]/g, ''); // erases special caracters
        inputString = inputString.replace(/\s+/g, '-'); // replace spaces by '-'
        inputString = inputString.replace(/\//g, '-'); // replace slash by '-'
        inputString = inputString.trim().toLowerCase();

        return _.map(inputString, (letter) => this._replaceCharacter(letter)).join('').trim().toLowerCase();
    };

    _replaceCharacter = (character) => {
        switch (character) {
            case '+': return '';
            case '~': return '';
            case '[': return '';
            case ']': return '';
            case '«': return '';
            case '»': return '';
            case '¶': return '';
            case '\r': return '';
            case '\n': return '';
            case '\t': return '';
            case '\f': return '';
            case '\v': return '';
            case '`': return '';
            case '€': return '_';
            case '‚': return '';
            case 'ƒ': return 'f';
            case '„': return '';
            case '…': return '...';
            case '†': return '_';
            case '‡': return '_';
            case 'ˆ': return '^';
            case '‰': return '';
            case 'Š': return 'S';
            case '‹': return '';
            case 'Œ': return 'OE';
            case 'Ž': return 'Z';
            case '‘': return '';
            case '’': return '';
            case '“': return '';
            case '”': return '';
            case '•': return '-';
            case '–': return '-';
            case '—': return '-';
            case '˜': return '-';
            case '™': return '';
            case 'š': return 's';
            case '›': return '';
            case 'œ': return 'ce';
            case 'ž': return 'z';
            case 'Ÿ': return 'Y';
            case '¡': return 'i';
            case '¥': return 'Y';
            case '¦': return '';
            case 'ª': return 'a';
            case '¬': return '-';
            case '¯': return '-';
            case '²': return '2';
            case '³': return '3';
            case '´': return '';
            case '¸': return '';
            case '¹': return '1';
            case 'º': return '0';
            case '¼': return '14';
            case '½': return '12';
            case '¾': return '34';
            case '¿': return '';
            case 'À': return 'A';
            case 'Á': return 'A';
            case 'Â': return 'A';
            case 'Ã': return 'A';
            case 'Ä': return 'A';
            case 'Å': return 'A';
            case 'Æ': return 'AE';
            case 'Ç': return 'C';
            case 'È': return 'E';
            case 'É': return 'E';
            case 'Ê': return 'E';
            case 'Ë': return 'E';
            case 'Ì': return 'I';
            case 'Í': return 'I';
            case 'Î': return 'I';
            case 'Ï': return 'I';
            case 'Ð': return 'D';
            case 'Ñ': return 'N';
            case 'Ò': return 'O';
            case 'Ó': return 'O';
            case 'Ô': return 'O';
            case 'Õ': return 'O';
            case 'Ö': return 'O';
            case '×': return 'x';
            case 'Ø': return 'O';
            case 'Ù': return 'U';
            case 'Ú': return 'U';
            case 'Û': return 'U';
            case 'Ü': return 'U';
            case 'Ý': return 'Y';
            case 'ß': return 'B';
            case 'à': return 'a';
            case 'á': return 'a';
            case 'â': return 'a';
            case 'ã': return 'a';
            case 'ä': return 'a';
            case 'å': return 'a';
            case 'æ': return 'ae';
            case 'ç': return 'c';
            case 'è': return 'e';
            case 'é': return 'e';
            case 'ê': return 'e';
            case 'ë': return 'e';
            case 'ì': return 'i';
            case 'í': return 'i';
            case 'î': return 'i';
            case 'ï': return 'i';
            case 'ñ': return 'n';
            case 'ò': return 'o';
            case 'ó': return 'o';
            case 'ô': return 'o';
            case 'õ': return 'o';
            case 'ö': return 'o';
            case '÷': return '';
            case 'ø': return 'o';
            case 'ù': return 'u';
            case 'ú': return 'u';
            case 'û': return 'u';
            case 'ü': return 'u';
            case 'ý': return 'y';
            case 'ÿ': return 'y';
            case '©': return '';
            case '®': return '';
            case 'đ': return 'd';
            case 'ð': return 'o';
            case '¢': return 'c';
            case 'µ': return 'u';
            case 'þ': return 'b';
            case 'ŋ': return 'n';
            default: return character;
        }
    };
}
