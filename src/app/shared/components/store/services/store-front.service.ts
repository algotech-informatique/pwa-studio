import { TranslateLangDtoService } from '@algotech-ce/angular';
import { SnModelDto, SnNodeDto, SnViewDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { OptionsObjectDto, RessourcesDto } from '../../../dtos';
import { IconsService } from '../../../services';
import { SnTranslateService } from '../../../modules/smart-nodes';

@Injectable()
export class StoreFrontService {

    constructor(
        private translateService: TranslateLangDtoService,
        private translateSnService: SnTranslateService,
        private iconService: IconsService,
    ) {
    }

    loadDownloadList(ressources: RessourcesDto[]): OptionsObjectDto[] {
        return _.reduce(ressources, (result, ressource: RessourcesDto) => {
            if (ressource.data) {
                const optionsObject = (ressource.data.type === 'SnModelNode') ?
                    this._createOptionModelNode(ressource.uuid, ressource.data) : this._createOption(ressource.uuid, ressource.data);
                result.push(optionsObject);
            }
            return result;
        }, []);
    }

    _createOption(uuid: string, data: SnModelDto): OptionsObjectDto {
        const optionsObject: OptionsObjectDto = {
            uuid: uuid,
            title: this.translateService.transform(data.displayName),
            mainIcon: this.iconService.getSnModelIcon(data.type),
            mainLine: data.key,
            detailLine: data.type,
            statusIcon: {
                color: '#A5A5A5',
                icon: 'fa-solid fa-circle-check',
                status: false,
            }
        };
        return optionsObject;
    }

    _createOptionModelNode(uuid: string, node: SnNodeDto) {
        const optionObject: OptionsObjectDto = {
            uuid: uuid,
            title: this.translateSnService.transform(node.displayName),
            mainIcon: this.iconService.getSnModelIcon('smartmodel'),
            mainLine: node.custom.key,
            detailLine: node.type,
            statusIcon: {
                color: '#A5A5A5',
                icon: 'fa-solid fa-circle-check',
                status: false,
            }
        };
        return optionObject;
    }

    loadUploadList(datas: SnModelDto[]): OptionsObjectDto[] {

        return _.reduce(datas, (result, data: SnModelDto) => {
            if (data.type === 'smartmodel') {
                result.push(...this._getSmartModelDatas(data));
            } else {
                const optionsObject = this._createOption(data.uuid, data);
                result.push(optionsObject);
            }
            return result;
        }, []);
    }

    activateOptionList(data: OptionsObjectDto) {
        data.statusIcon.status = (data.statusIcon.status) ? false : true;
        data.statusIcon.color = (data.statusIcon.status) ? '#27AE60' : '#A5A5A5';
    }

    allOptionListActivate(data: OptionsObjectDto[]): OptionsObjectDto[] {
        return _.map(data, (da: OptionsObjectDto) => {
            da.statusIcon.status = true;
            da.statusIcon.color = '#27AE60';
            return da;
        });
    }

    clearList(datas: OptionsObjectDto[]) {
        return _.map(datas, (data: OptionsObjectDto) => {
            data.statusIcon.color = '#A5A5A5';
            data.statusIcon.status = false;
            return data;
        });
    }

    _getSmartModelDatas(data: SnModelDto): OptionsObjectDto[] {

        const view: SnViewDto = data.versions[0].view as SnViewDto;
        return _.map(view.nodes, (node: SnNodeDto) => {
            const optionObject = this._createOptionModelNode(node.id, node);
            return optionObject;
        });
    }

}
