import { Injectable } from '@angular/core';
import { DialogMessageService } from '../../../services';
import { ExportDataFileDto, } from '../dto/export-data-file.dto';
import { LangDto, SmartModelDto, SmartPropertyModelDto } from '@algotech/core';
import * as _ from 'lodash';
import { SettingsDataService } from '@algotech/angular';
import { DocumentsMetaDatasSettingsDto } from '@algotech/core';
import * as ExcelJS from 'exceljs';
import moment from 'moment'; 

@Injectable()
export class ExportDataFileService {

    constructor(
        private dialogMessageService: DialogMessageService,
        private settingsDataService: SettingsDataService,
    ) { }

    createExcelFile(exportData: ExportDataFileDto, models: SmartModelDto[], languages: LangDto[]) {
        const wBook = this._createWorkBook();

        _.forEach(exportData.modelList, (model: SmartModelDto) => {
            const keys: string[] = model.uniqueKeys;
            this._addSheetDocument(wBook, model.key, (keys.length > 0) ? keys[0] : '');
        });

        _.forEach(exportData.glistList, (list) => {
            this._addSheetGList(wBook, list, languages);
        });

        if (exportData.addLayers) {
            this._addSheetRaster(wBook);
        }
        this._createViews(wBook);
        this._download(wBook);
    }

    _createWorkBook() {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Algotech-Informatique';
        workbook.created =  new Date(moment.now());
        return workbook;
    }

    _createViews(wBook) {
        wBook.views = [
            {
                x: 0, y: 0, width: 10000, height: 20000,
                firstSheet: 0, activeTab: 0, visibility: 'visible'
            }
        ];
    }

    _addSheetModel(wBook, model: SmartModelDto, models: SmartModelDto[]) {
        const name = model.key.toUpperCase();
        if (this._validateSheetName(wBook, name)) {
            return;
        }
        const sheet = wBook.addWorksheet(name);
        sheet.columns = _.map(model.properties, (prop: SmartPropertyModelDto) => {
            const keys: string[] = model.uniqueKeys;
            const extModel =  this._externalKey(prop, models);
            const columnName = (keys.includes(prop.key)) ? `${prop.key}:[KEY]` :
                (extModel !== '') ? `${prop.key}:${extModel}` : prop.key;
            return this._column(columnName, 30);
        });
        this._style(sheet);
    }

    _validateSheetName(wBook, name: string): boolean {
        const worksheet = wBook.getWorksheet(name);
        return (worksheet) ? true : false;
    }

    _externalKey(prop: SmartPropertyModelDto, models: SmartModelDto[]): string {
        if (prop.keyType.startsWith('so:')) {
            const smModelKey = prop.keyType.replace('so:', '');
            const extModel: SmartModelDto = _.find(models, (m: SmartModelDto) => m.key === smModelKey);
            return ( extModel && extModel.uniqueKeys.length > 0) ? `[${smModelKey}.${extModel.uniqueKeys[0]}]`  : '';
        }
        return '';
    }

    _addSheetGList(wBook, sheetName: string, languages: LangDto[]) {
        const sheet = wBook.addWorksheet('GLIST#' + sheetName.toUpperCase());
        sheet.columns = [
            this._column('KEY', 30),
            ... _.map(languages, (lang: LangDto) => {
                return this._column(lang.lang.toUpperCase(), 30);
            }),
        ];
        this._style(sheet);
    }

    _addSheetDocument(wBook, sheetName: string, columnName: string) {
        const name = 'DOCUMENTS#' + sheetName.toUpperCase();
        if (this._validateSheetName(wBook, name)) {
            return;
        }
        const sheet = wBook.addWorksheet(name);
        const column =  (columnName !== '') ? `KEY:[${sheetName}.${columnName.toUpperCase()}]` : 'KEY';
        const data = this._getMetadataSettings();
        sheet.columns = [
            this._column('FILENAME', 70),
            this._column('PATH', 50),
            this._column('TAGS', 50),
            this._column(column, 50),
            ...data,
        ];

        this._style(sheet);
    }

    _getMetadataSettings() {
        const metadata: DocumentsMetaDatasSettingsDto[] = this.settingsDataService.settings.documents.metadatas;
        return _.map(metadata, (data: DocumentsMetaDatasSettingsDto) => {
            return this._column(`md:${data.key}`, 30);
        });
    }

    _addSheetRaster(wBook) {
        const sheet = wBook.addWorksheet('RASTERS#');
        sheet.columns = [
            this._column('CONTENEUR.PERE', 50),
            this._column('CONTENEUR.NOM', 50),
            this._column('CONTENEUR.DESCRIPTION', 70),
            this._column('CONTENEUR.METADATA', 70),
            this._column('LAYER.NOM', 50),
            this._column('LAYER.CONTENEUR_PERE', 50),
            this._column('LAYER.TYPE', 30),
            this._column('LAYER.METADATA', 50),
            this._column('LAYER.REGROUP_POI', 20),
            this._column('RASTER.TITRE', 50),
            this._column('RASTER.DEFAUT', 20),
            this._column('RASTER.COULEUR', 20),
            this._column('RASTER.SOURCE', 50),
        ];
        this._style(sheet);
    }

    _column(name: string, width: number) {
        return {
            header: name,
            key: name,
            width,
        };
    }

    _style(sheet) {
        sheet.eachRow(function(row) {
            row.eachCell( function(cell) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFC2C2C2'},
                };
                cell.font = {
                    name: 'Arial',
                    size: 12,
                    italic: true,
                    bold: true,
                    color: { argb: 'FF000000' }
                };
                cell.alignment = {horizontal: 'center' };
                cell.border = {
                    bottom: { style: 'medium' },
                };
            });
        });
    }

    _download(wBook) {
        wBook.xlsx.writeBuffer().then((data) => {
            this.dialogMessageService.getSaveMessage(
                data,
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'download.xlsx',
                'Excel'
            );
        });
    }

}
