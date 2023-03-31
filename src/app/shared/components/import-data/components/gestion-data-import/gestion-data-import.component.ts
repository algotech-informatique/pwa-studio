import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { OptionsObjectDto } from '../../../../dtos';
import { ImportDataService } from '../../services/import-data.service';
import * as _ from 'lodash';
import { GenericListDto, SmartModelDto } from '@algotech-ce/core';
import { ExportDataFileDto } from '../../dto/export-data-file.dto';
import { SessionsService } from '../../../../services';

@Component({
    selector: 'gestion-data-import',
    templateUrl: './gestion-data-import.component.html',
    styleUrls: ['./gestion-data-import.component.scss'],
})
export class GestionDataImportComponent implements OnChanges {

    @Input() exportData: ExportDataFileDto;
    @Output() downloadFile = new EventEmitter();

    validateDownload = false;
    modelList: SmartModelDto[] = [];
    genericLists: GenericListDto[] = [];

    optionModelList: OptionsObjectDto[] = [];
    optionGListList: OptionsObjectDto[] = [];
    activate = false;

    constructor(
        private importDataService: ImportDataService,
        private sessionService: SessionsService,
    ) { }

    ngOnChanges() {
        this.genericLists = this.sessionService.active.datas.read.glists;
        this.modelList = this.sessionService.active.datas.read.smartModels;

        this.optionModelList = this.importDataService.loadModelList(this.modelList.filter((sm) => sm.skills.atDocument));
        this.optionGListList = this.importDataService.loadGListList(this.genericLists);
    }

    onModelChanged(data) {
        const find: SmartModelDto = _.find(this.modelList, (model: SmartModelDto) => model.uuid === data.uuid);
        const index = _.findIndex(this.exportData.modelList, (model: SmartModelDto) => model.key === find.key);
        if (index === -1) {
            this.exportData.modelList.push(find);
        } else {
            this.exportData.modelList.splice(index, 1);
        }
        this.onValidateDowload();
    }

    onGListChanged(data) {
        const index = _.findIndex(this.exportData.glistList, (list) => list === data.mainLine);
        if (index === -1) {
            this.exportData.glistList.push(data.mainLine);
        } else {
            this.exportData.glistList.splice(index, 1);
        }
        this.onValidateDowload();
    }

    onDownload() {
        this.downloadFile.emit(this.exportData);
    }

    onLayerImport(data) {
        this.exportData.addLayers = data;
        this.onValidateDowload();
    }

    onValidateDowload() {
        this.validateDownload = (
            this.exportData.addLayers ||
            this.exportData.glistList.length !== 0 ||
            this.exportData.modelList.length !== 0
        );
        this.activate = (this.exportData.modelList.length !== 0);
    }
}
