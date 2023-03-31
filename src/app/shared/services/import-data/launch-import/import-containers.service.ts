import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { ImportDataFileDto } from '../../../components/import-data/dto/import-data-file.dto';
import { ImportDataUtilsService } from '../import-data-utils.service';
import * as _ from 'lodash';
import { PatchPropertyDto, PlanContainersSettingsDto, PlanLayersRastersSettingsDto, PlanLayersSettingsDto } from '@algotech-ce/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsDataService, SettingsService, TranslateLangDtoService } from '@algotech-ce/angular';
import { Observable, of } from 'rxjs';
import { ValidateImportDataDto, ValidateImportDocDto } from '../../../components/import-data/dto/validate-import-data.dto';
import { flatMap, map } from 'rxjs/operators';
import { ImportRastersService } from './import-rasters.service';
import { ImportDataDocDto } from '../../../components/import-data/dto/import-data-doc.dto';
import { ValidateImportContainerDto, ValidateImportLayerDto, ValidateImportRasterDto } from '../../../components/import-data/dto/validate-container.dto';
import { ImportDataDocService } from '../import-data-doc.service';

@Injectable()
export class ImportContainersService {

    constructor(
        private importUtilsService: ImportDataUtilsService,
        private translateService: TranslateService,
        private settingsDataService: SettingsDataService,
        private settingsService: SettingsService,
        private importRastersService: ImportRastersService,
        private importDataDocs: ImportDataDocService,
        private translateLangDto: TranslateLangDtoService,
    ) { }

    importObjects(importFile: ImportDataFileDto, importContainer: ValidateImportContainerDto[],
        forceData: boolean, fileZip: File, inputLog: string): Observable<ValidateImportDataDto> {

        if (importFile.importData.length === 0) {
            return of( { type: importFile.type, valide: true, importData: [] });
        }

        return this.importDataDocs.loadFileList(fileZip, inputLog).pipe(
            flatMap((docs: ImportDataDocDto[]) => {
                return this._importObjects(importContainer, docs, forceData, inputLog).pipe(
                    map((result: ValidateImportDocDto[]) => {
                        const valide = !_.some(result, (res: ValidateImportDocDto) => res.valide === false);
                        const validate: ValidateImportDataDto = {
                            importData: [],
                            type: 'layer',
                            valide,
                        };
                        return validate;
                    }),
                );
            }),
        );
    }

    _importObjects(importContainer: ValidateImportContainerDto[], importDocs: ImportDataDocDto[],
        forceData: boolean, inputLog: string): Observable<ValidateImportDocDto[]> {

        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.IMPORT-DATA-CONTAINER.LAUNCH'), false);

        const rasterActions = [];
        const oldSettings: PlanContainersSettingsDto[] = _.cloneDeep(this.settingsDataService.settings.plan.containers);
        const planSettings: PlanContainersSettingsDto[] = this.settingsDataService.settings.plan.containers;
        this._buildSettings(planSettings, importContainer, rasterActions, forceData);
        if (planSettings.length !== oldSettings.length) {
            return this._updateSettings(planSettings).pipe(
                flatMap((patch: PatchPropertyDto[]) => {
                    return this.importRastersService.importRasters(rasterActions, importDocs, inputLog);
                }),
            );
        }
        return of([]);
    }

    _updateSettings(planSettings: PlanContainersSettingsDto[]) {
        const patches: PatchPropertyDto[] = [{
            op: 'replace',
            path: '/plan/containers',
            value: planSettings
        }];
        return this.settingsService.patchProperty(this.settingsDataService.settings.uuid, patches);
    }

    _buildSettings(planSettings: PlanContainersSettingsDto[], importContainer: ValidateImportContainerDto[],
        rasterActions, forceData: boolean) {

        _.forEach(importContainer, (cont: ValidateImportContainerDto) => {
            let container: PlanContainersSettingsDto = this._getContainer(planSettings, cont.key);
            if (_.isUndefined(container)) {
                container = this._createContainer(planSettings, cont);
                planSettings.push(container);
            }
            if (container) {
                _.forEach(cont.layers, (lay: ValidateImportLayerDto) => {
                    const layer = this._createLayer(lay, container);
                    _.forEach(lay.rasters, (rst: ValidateImportRasterDto) => {
                        this._validateRaster(layer, rst, lay, forceData, rasterActions,
                            this.translateLangDto.transform(container.displayName));
                    });
                    container.layers.push(layer);
                });
            }

        });
    }

    _validateRaster(newLayer: PlanLayersSettingsDto, raster: ValidateImportRasterDto,
        layer: ValidateImportLayerDto, forceData: boolean, rasterActions, containerName: string) {

        const findIndex = _.findIndex(newLayer.rasters, (rst: PlanLayersRastersSettingsDto) => rst.key === raster.key);
        const nRaster = this._createRaster(raster);
        if (forceData && (findIndex !== -1)) {
            newLayer.rasters[findIndex] = nRaster;
            this._addRaster(newLayer, nRaster, raster, layer, rasterActions, containerName);
        }
        if (findIndex === -1) {
            newLayer.rasters.push(nRaster);
            this._addRaster(newLayer, nRaster, raster, layer, rasterActions, containerName);
        }
    }

    _addRaster(newLayer: PlanLayersSettingsDto, newRaster: PlanLayersRastersSettingsDto,
        raster: ValidateImportRasterDto,  layer: ValidateImportLayerDto, rasterActions, containerName: string) {

        if (raster.default) {
            newLayer.defaultRaster = newRaster.uuid;
        }
        if (raster.source !== '' && (layer.type.toUpperCase() === 'MAPCUSTOM' || layer.type.toUpperCase() === 'FICHIER')) {
            rasterActions.push({ rasterUuid: newRaster.uuid, file: raster.source, layer: newLayer.key, container: containerName });
        }
    }

    /** CONTAINERS */
    _getContainer = (settings: PlanContainersSettingsDto[], containerName) => _.find(settings, (container) =>
            container.displayName[0].value === containerName)

    _createContainer = (settings: PlanContainersSettingsDto[], cont: ValidateImportContainerDto) => {
        let parentUuid = null;
        if (cont.parent !== '') {
            const parentContainer = this._getContainer(settings, cont.parent);
            if (!_.isUndefined(parentContainer)) {
                parentUuid = parentContainer.uuid;
            }
        }

        const metadatas = this._getMetadata(cont.metadata);
        return {
            imageIds: [],
            displayName: [
                {
                    lang: 'fr-FR',
                    value: cont.name,
                }
            ],
            description: [
                {
                    lang: 'fr-FR',
                    value: cont.description,
                }
            ],
            layers: [],
            metadatas,
            uuid: UUID.UUID(),
            metadataSoUuid: null,
            parentUuid: parentUuid
        };
    }

    /** LAYERS */
    _getLayer = (container, layerName) => _.find(container.layers, (layer) =>
            layer.displayName[0].value === layerName)

    _createLayer = (lyr: ValidateImportLayerDto, container): PlanLayersSettingsDto => {
        const metadatas = this._getMetadata(lyr.metadata);
        const layer = {
            key: this.importUtilsService.format(container.displayName[0].value + '-' + lyr.name),
            displayName: [
                {
                    lang: 'fr-FR',
                    value: lyr.name,
                }
            ],
            rasters: [],
            uuid: UUID.UUID(),
            defaultCenter: [0, 0],
            defaultZoom: 15,
            zoomMin: 8,
            zoomMax: 17.5,
            layerType: this._getLayerType(lyr.type),
            defaultRaster: null,
            clustersMode: lyr.regroup,
            metadatas
        };
        return layer;
    }

    _getLayerType(type: string): 'mapCustom' | 'mapWorld' | 'iframe' {
        switch (type.toUpperCase()) {
            case 'MAPCUSTOM':
                return 'mapCustom';
            case 'MAPWORLD':
                return 'mapWorld';
            case 'IFRAME':
                return 'iframe';
            case 'FICHIER':
                return 'mapCustom';
        }
    }

    /* METADATAS */
    _getMetadata = (metaFlat) => {
        const metadatas = (!metaFlat) ?
            null :
            metaFlat.split('`').map(meta => {
            const m = meta.split('|');
            return {
                uuid: UUID.UUID(),
                key: m[0],
                value: m[1],
                displayName: m[2].split(';').map(display => {
                    return {
                        lang: display.split('=')[0],
                        value: display.split('=')[1]
                    };
                })
            };
        });
        return metadatas;
    }

    /** RASTER */
    _createRaster(rst: ValidateImportRasterDto) {
        return {
            displayName: [
                {
                    lang: 'fr-FR',
                    value: rst.key,
                }
            ],
            uuid: UUID.UUID(),
            key: this.importUtilsService.format(rst.key),
            backgroundColor: rst.color,
            url: rst.source,
        };
    }
}

