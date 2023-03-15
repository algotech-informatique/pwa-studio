import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ImportDataDocDto } from '../../../components/import-data/dto/import-data-doc.dto';
import { ImportDataFileDto, ImportDataModel } from '../../../components/import-data/dto/import-data-file.dto';
import { ValidateData, ValidateDataFileDto, ValidateDataModel } from '../../../components/import-data/dto/validate-data-file.dto';
import * as _ from 'lodash';
import { ImportDataUtilsService } from '../import-data-utils.service';
import { Observable, of } from 'rxjs';
import { SessionsService } from '../../sessions/sessions.service';
import { PlanContainersSettingsDto } from '@algotech/core';

@Injectable()
export class ImportContainersDataService {

    constructor(
        private translateService: TranslateService,
        private importUtilsService: ImportDataUtilsService,
        private sessionService: SessionsService,
    ) {}

    validateContainer(data: ImportDataFileDto, importDocs: ImportDataDocDto[],
        forceData: boolean, inputLog: string): Observable<ValidateDataFileDto> {

        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.VALIDATE-RASTER'), false);

        const models: ValidateDataModel[] = this._getDataModels(data.importData, importDocs, forceData, inputLog);
        const valide = !_.some(models, (imp: ValidateDataModel) => imp.valide === false);
        const validate: ValidateDataFileDto = {
            type: 'layer',
            valide,
            importData: models,
        };
        return of(validate);
    }

    _getDataModels(data: ImportDataModel[], importDocs: ImportDataDocDto[], forceData: boolean, inputLog: string): ValidateDataModel[] {
        return _.map(data, (dt) => {

            if (dt.data.length === 0) {
                return {valide: true, model: dt.model, data: []};
            }

            const valData: ValidateData[] = _.map(dt.data, (row, index) => {
                return this._validateDataContainers(row, importDocs, index + 2, forceData, inputLog);
            });
            const valide = !_.some(valData, (ds: ValidateData) => ds.valide === false);
            return { model: dt.model, data: valData, valide};
        });

    }

    _validateDataContainers(row, importDocs: ImportDataDocDto[], index, forceData: boolean, inputLog: string): ValidateData {
        const value = row['RASTER.SOURCE'];
        const valRaster = row['RASTER.TITRE'];
        const valLayer = row['LAYER.NOM'];
        const valContainer = row['CONTENEUR.NOM'];

        const valideSource = (valLayer && valRaster) ?
            this._validateRasterSource(value, index, inputLog) : true;

        const valideBoolean = this._validateBooleanFields(row, index, inputLog);
        const valideMetadataCont = this._validateMetadata('CONTENEUR.METADATA', row, index, inputLog);
        const valideMetadataLayer = this._validateMetadata('LAYER.METADATA', row, index, inputLog);
        const valideExistContainer = true;
        const validateType = this._validateLayerType(row, index, importDocs, inputLog);
        const validateEmpty = this._validateEmptyValues( valRaster, valLayer, valContainer, index, inputLog);
        const valide = (valideSource && valideBoolean && validateType && validateEmpty
            && valideMetadataCont && valideMetadataLayer && valideExistContainer );
        return {valide, object: row};
    }

    _validateLayerType(row, index, importDocs: ImportDataDocDto[], inputLog: string): boolean {
        const layerType = ['mapWorld', 'mapCustom', 'iframe', 'fichier'];
        const source: string = row['RASTER.SOURCE'];
        const value: string = row['LAYER.TYPE'];
        if (value) {
            const findIndex = _.findIndex(layerType, (tp: string) => tp.toUpperCase() === value.toUpperCase());
            if (findIndex === -1) {
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.VALIDATE-LAYER-TYPE', {value, index}), true);
                return false;
            }
            if (value.toUpperCase() === 'MAPCUSTOM' || value.toUpperCase() === 'FICHIER') {
                return this._validateDoc(source, importDocs, index, inputLog);
            }
            if (value.toUpperCase() === 'MAPWORLD') {
                if (!source) {
                    this.importUtilsService.sendMessageService(inputLog,
                        this.translateService.instant('IMPORT-DATA.VALIDATE-LAYER-TYPE-EXISTS', {value, index}), true);
                    return false;
                }
            }
        }
        return true;
    }

    _validateRasterSource(value, index, inputLog: string): boolean {
        if (!value) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-RASTER-VALUE', {index}), true);
            return false;
        }
        return true;
    }

    _validateBooleanFields(row, index, inputLog: string): boolean {
        const layRegroup = row['LAYER.REGROUP_POI'];
        const rastDefault = row['RASTER.DEFAUT'];
        const valide = this.importUtilsService.testValueByType('boolean', layRegroup) &&
            this.importUtilsService.testValueByType('boolean', rastDefault);
        if (!valide) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-RASTER-VALUE-BOOLEAN', {index}), true);
        }
        return valide;
    }

    _validateDoc(value, importDocs: ImportDataDocDto[], index, inputLog: string): boolean {
        const valide: boolean = this.importUtilsService.getDocument(value, '', importDocs);
        if (!valide && value) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-RASTER-NO-FILE', {value, index}), true);
        }
        return valide;
    }

    _validateExistanceConteneur(row, index, forceData: boolean, inputLog: string): boolean {
        const value = row['CONTENEUR.NOM'];
        const containers: PlanContainersSettingsDto[] = this.sessionService.active.datas.read.settings.plan.containers;
        const findIndex = _.findIndex(containers, (cont: PlanContainersSettingsDto) => cont.displayName[0].value === value);
        if (findIndex !== -1 && forceData === false) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-CONTAINER-EXISTS-BDD', {value, index}), true);
            return false;
        }
        return true;
    }

    _validateMetadata(key, row, index, inputLog: string): boolean {
        const metadata = row[key];
        if (!metadata || metadata === '') {
            return true;
        }
        const metaSplit: string[] = metadata.split('`');
        if (metaSplit.length === 0) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-METADATA-ERROR', {key, index}), true);
            return false;
        }

        const valide = metaSplit.map(meta => {
            const m: string[] = meta.split('|');
            if (m.length !== 3) {
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.VALIDATE-METADATA-ERROR-SPLIT', {key, index}), true);
                return false;
            }
            const mLang: string[] = m[2].split(';');
            if (mLang.length === 0) {
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.VALIDATE-METADATA-ERROR-LANG', {key, index}), true);
                return false;
            }
            return mLang.map((langs) => {
                const lang: string[] = langs.split('=');
                if (lang.length !== 2) {
                    this.importUtilsService.sendMessageService(inputLog,
                        this.translateService.instant('IMPORT-DATA.VALIDATE-METADATA-ERROR-LANG-SPLIT', {key, index}), true);
                    return false;
                }
            });
        });
        return !_.some(valide, (val) => val === false);
    }

    _validateEmptyValues(valRaster: string, valLayer: string, valContainer: string, index, inputLog): boolean {
        let valide = true;

        if (valLayer || valRaster) {
            if (!valRaster) {
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.VALIDATE-RASTER-NO-EMPTY', { index}), true);
                valide = false;
            }
            if (!valLayer) {
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.VALIDATE-LAYER-NO-EMPTY', { index}), true);
                valide = false;
            }
        }

        if (!valContainer) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-CONTAINER-NO-EMPTY', { index}), true);
            valide = false;
        }
        return valide;
    }
}
