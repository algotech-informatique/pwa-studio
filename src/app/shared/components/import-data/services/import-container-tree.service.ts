import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { ImportDataUtilsService } from '../../../services/import-data/import-data-utils.service';
import { ImportDataModel } from '../dto/import-data-file.dto';
import { ValidateImportContainerDto, ValidateImportLayerDto, ValidateImportRasterDto } from '../dto/validate-container.dto';

@Injectable()
export class ImportContainerTreeService {

    constructor(
        private translateService: TranslateService,
        private importUtilsService: ImportDataUtilsService,
    ) {}

    createContainerTree(data: ImportDataModel, forceData: boolean, inputLog: string): ValidateImportContainerDto[] {

        const importContainer: ValidateImportContainerDto[] = [];
        _.forEach(data.data, (row) => {
            this._createContainer(importContainer, row);
        });

        _.forEach(data.data, (row) => {
            this._createLayer(importContainer, row);
        });
        _.forEach(data.data, (row, index) => {
            this._createRaster(importContainer, row, index + 2);
        });
        this._validateDuplicate(importContainer, forceData, inputLog);
        return importContainer;
    }

    _createContainer(containers: ValidateImportContainerDto[], row) {
        const findIndex = _.findIndex(containers, (cont: ValidateImportContainerDto) => cont.key === row['CONTENEUR.NOM']);
        if (findIndex === -1) {
            containers.push(this._addContainer(row));
        }
    }

    _addContainer(row): ValidateImportContainerDto {
        const importContainer: ValidateImportContainerDto = {
            key: row['CONTENEUR.NOM'],
            name: row['CONTENEUR.NOM'],
            parent: row['CONTENEUR.PERE'],
            description: row['CONTENEUR.DESCRIPTION'],
            metadata: row['CONTENEUR.METADATA'],
            layers: [],
            valide: false
        };
        return importContainer;
    }

    _createLayer(containers: ValidateImportContainerDto[], row) {
        const findIndex = _.findIndex(containers, (cont: ValidateImportContainerDto) => cont.key === row['CONTENEUR.NOM']);
        if (findIndex !== -1) {
            const layNom: string = row['LAYER.NOM'];
            if (layNom) {
                const findLay = _.findIndex(containers[findIndex].layers, (lay: ValidateImportLayerDto) => lay.key === row['LAYER.NOM']);
                if (findLay === -1) {
                    containers[findIndex].layers.push(this._addLayer(row));
                }
            }
        }
    }

    _addLayer(row): ValidateImportLayerDto {
        const group: boolean = this.importUtilsService.getBoolean(row['LAYER.REGROUP_POI']);
        const layType: string = row['LAYER.TYPE'];
        const lyr: ValidateImportLayerDto = {
            key: row['LAYER.NOM'],
            name: row['LAYER.NOM'],
            regroup: group,
            type: (layType.toUpperCase() === 'FICHIER') ? 'mapCustom' : layType,
            metadata: row['LAYER.METADATA'],
            rasters: [],
            valide: false,
        };
        return lyr;
    }

    _createRaster(containers: ValidateImportContainerDto[], row, index: number) {
        const findIndex = _.findIndex(containers, (cont: ValidateImportContainerDto) => cont.key === row['CONTENEUR.NOM']);
        if (findIndex !== -1) {
            const findLay = _.findIndex(containers[findIndex].layers, (lay: ValidateImportLayerDto) => lay.key === row['LAYER.NOM']);
            if (findLay !== -1) {
                containers[findIndex].layers[findLay].rasters.push(this._addRaster(row, index));
            }
        }
    }

    _addRaster(row, index: number): ValidateImportRasterDto {
        const defaut: boolean = this.importUtilsService.getBoolean(row['RASTER.DEFAUT']);
        const raster: ValidateImportRasterDto = {
            key: row['RASTER.TITRE'],
            color: row['RASTER.COULEUR'],
            default: defaut,
            source: row['RASTER.SOURCE'],
            valide: true,
            index,
        };
        return raster;
    }

    _validateDuplicate(containers: ValidateImportContainerDto[], forceData: boolean, inputLog: string) {
        _.forEach(containers, (cont: ValidateImportContainerDto) => {
            _.forEach(cont.layers, (lay: ValidateImportLayerDto) => {
                lay.valide = (forceData) ? true : this._findRasterDuplicates(cont, lay, inputLog);
            });
            cont.valide = !_.some(cont.layers, (lay: ValidateImportLayerDto) => lay.valide === false);
        });
    }

    _findRasterDuplicates(cont: ValidateImportContainerDto, layer: ValidateImportLayerDto, inputLog: string) {
        const listKeys: {key: string, index: number}[] = _.map(layer.rasters, (rst: ValidateImportRasterDto) => {
            return {
                key: rst.key,
                index: rst.index,
            };
        });
        const repeat = _.uniqBy(_.reduce(listKeys, (result, key) => {
            const indexes: number[] = this._getAllIndexes(listKeys , key.key);
            if (indexes.length > 1) {
                result.push({key: key.key, items: indexes.join(', ')});
            }
            return result;
        }, []), 'key');

        if (repeat.length > 0) {
            _.forEach(repeat, (rpt) => {
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.DUPLICATE-ITEMS-FOUND-CONT',
                        {key: rpt.key, layer: layer.name, cont: cont.name, index: rpt.items }), true);
            });
            return false;
        }
        return true;
    }

    _getAllIndexes(listKeys: {key: string, index: number}[], key: string): number[] {
        const lookFor = function (el, term) {
            if (el.key === term) {
                return true;
            }
            return false;
        };
        const len = listKeys.length;
        let i = 0;
        const indexes = [];
        while (i < len) {
            if (lookFor(listKeys[i], key)) {
                indexes.push(listKeys[i].index);
            }
            i += 1;
        }
        return indexes;
    }
}
