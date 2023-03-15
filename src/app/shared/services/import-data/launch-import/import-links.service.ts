import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ImportDataFileDto, ImportDataModel } from '../../../components/import-data/dto/import-data-file.dto';
import { ValidateImportDataDto, ValidateImportDataModelDto } from '../../../components/import-data/dto/validate-import-data.dto';
import { ImportDataUtilsService } from '../import-data-utils.service';
import * as _ from 'lodash';
import { first, map, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SmartObjectsService } from '@algotech/angular';
import { SmartObjectDto, SmartPropertyObjectDto } from '@algotech/core';

interface ObjectLink {
    propertyKey: string;
    uuids: string[];
    multiple: boolean;
}

@Injectable()
export class ImportLinksService {

    constructor(
        private importUtilsService: ImportDataUtilsService,
        private translateService: TranslateService,
        private smartObjectsService: SmartObjectsService,
    ) {}

    importObjects(data: ImportDataFileDto, dataSO: ValidateImportDataDto, validateData: ValidateImportDataDto, forceData: boolean,
        inputLog: string): Observable<ValidateImportDataDto> {

        if (!this._launchLinkImport(validateData)) {
            return of( { type: data.type, valide: true, importData: [] });
        }
        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.START-DATA-LINKS-IMPORT'), false);

        const importData$: Observable<ValidateImportDataModelDto>[] = _.map(data.importData, (dt: ImportDataModel) => {

            if (dt.data.length === 0) {
                const validate: ValidateImportDataModelDto = {
                    valide: true,
                    data: [],
                    model: dt.model
                };
                return of(validate);
            }

            const links = this.importUtilsService.findExternalPropertyKey(dt.data[0]);
            return (links.length !== 0) ?
                this._importObjects(dt, dataSO, forceData, links, inputLog) :
                of({ model: dt.model, valide: true, data: dt.data });
        });
        const import$: Observable<ValidateImportDataModelDto[]> = this.importUtilsService.sequence(importData$);
        return import$.pipe(
            map((importData: ValidateImportDataModelDto[]) => {
                const valide = !_.some(importData, (dt: ValidateImportDataModelDto) => dt.valide === false);
                const  validate: ValidateImportDataDto = {
                    valide,
                    importData,
                    type: 'link',
                };
                return validate;
            }),
        );
    }

    _launchLinkImport(validateData: ValidateImportDataDto): boolean {
        const exists: boolean = _.some(validateData.importData, (val: ValidateImportDataModelDto) => val.data.length !== 0);
        return (exists);
    }

    _importObjects(data: ImportDataModel, dataSO: ValidateImportDataDto,
        forceData: boolean, links, inputLog: string ): Observable<ValidateImportDataModelDto> {

        const model = this.importUtilsService.getSmartModel(data.model);
        const objects$: Observable<Object>[] = _.map(data.data, (row, index) =>
            this._rowToPatchLink(row, model, links, dataSO, inputLog),
        );
        const obj$: Observable<Object[]> = this.importUtilsService.sequence(objects$);
        return obj$.pipe(
            map((dt) => {
                const v: ValidateImportDataModelDto = {
                    model: data.model,
                    data: dt,
                    valide: true,
                };
                return v;
            })
        );
    }

    _rowToPatchLink(row, model, links, dataSO: ValidateImportDataDto, inputLog: string): Observable<Object> {
        const pivotKey = this.importUtilsService.findPivotKEY(row);
        const pivotProp = pivotKey.split(':')[0];

        return this.importUtilsService.returnObject(dataSO, model.key, pivotProp, row[pivotKey]).pipe(
            switchMap((obj: SmartObjectDto) => {
                if (!obj) {
                    return of(null);
                }
                return this._patchLinks(obj, links, row, model, dataSO, inputLog);
            }),
            map((data) => {
                this.importUtilsService.updateObjectData(dataSO, data);
                return data;
            }),
            first(),
        );
    }

    _patchLinks(object: SmartObjectDto, links, row, model, dataSO: ValidateImportDataDto, inputLog): Observable<any> {

        return this._readLinks(row, model, links, dataSO, inputLog).pipe(
            switchMap((propLink: ObjectLink[]) => {
                _.forEach(propLink, (lnk: ObjectLink) => {
                    object = this._patchSo(object, lnk.propertyKey, lnk.uuids, lnk.multiple);
                });
                return this.smartObjectsService.put(object);
            }),
        );
    }

    _readLinks(row, model, links, dataSO: ValidateImportDataDto, inputLog): Observable<ObjectLink[]> {

        const objLink$: Observable<ObjectLink>[] = _.reduce(links, (result, link) => {
            const property = link.key.split(':')[0];
            const isMultiple: boolean = this.importUtilsService.isMultiple(model, property, inputLog);
            const vals = row[link.key];
            if (vals) {
                result.push(this._getVals(link, vals, isMultiple, property, dataSO));
            }
            return result;
        }, []);
        return this.importUtilsService.sequence(objLink$);
    }

    _getVals(link, value, multiple, property, dataSO: ValidateImportDataDto): Observable<ObjectLink> {
        const object$: Observable<any> = (multiple) ? this._splitValues(link, value, dataSO) : this._getLinkValue(dataSO, link, value);
        return object$.pipe(
            map((so) => {
                const sos: SmartObjectDto[] = _.isArray(so) ? so : [so];
                const objlnk: ObjectLink = {
                    propertyKey: property,
                    multiple,
                    uuids: _.map(sos, (s: SmartObjectDto) => s.uuid),
                };
                return objlnk;
            }),
        );
    }

    _splitValues(link, vals, dataSO: ValidateImportDataDto): Observable<SmartObjectDto[]> {
        const values = vals.split('|');
        if (this._isUuid(values[0])) {
            return of([]);
        }

        const so$: Observable<SmartObjectDto>[] = _.map(values, (value) =>
            this._getLinkValue(dataSO, link, value),
        );
        return this.importUtilsService.sequence(so$);
    }

    _getLinkValue(dataSO: ValidateImportDataDto, link, value): Observable<SmartObjectDto> {
        return this.importUtilsService.returnObject(dataSO, link.model, link.field, value);
    }

    _isUuid = (value) => {
        if (value) {
            const found = value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
            return found !== null;
        }
        return false;
    };

    _patchSo(so: SmartObjectDto, propertyKey: string, uuids: string[], multiple: boolean): SmartObjectDto {
        const fIndex = _.findIndex(so.properties, (prop: SmartPropertyObjectDto) => prop.key === propertyKey);
        if (fIndex !== -1) {
            if (multiple) {
                so.properties[fIndex].value = uuids;
            } else {
                so.properties[fIndex].value = uuids[0];
            }
        }
        return so;
    }

}
