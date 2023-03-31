import { GenericListDto, LangDto, SmartModelDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { OptionsObjectDto } from '../../../dtos';
import * as _ from 'lodash';
import { TranslateLangDtoService } from '@algotech-ce/angular';
import { ValidateDataFileDto, ValidateDataModel } from '../dto/validate-data-file.dto';
import { MessageService } from '../../../services';
import { OptionLoggerMessage } from '../../options/components/options-logger/option-logger-message.dto';

@Injectable()
export class ImportDataService {

    constructor(
        private translateService: TranslateLangDtoService,
        private messageService: MessageService,
    ) {}

    loadModelList(modelList: SmartModelDto[]): OptionsObjectDto[] {
        return _.orderBy(_.map(modelList, (model: SmartModelDto) => {
            const option: OptionsObjectDto = {
                title: this.translateService.transform(model.displayName as LangDto[]),
                mainLine: model.key,
                uuid: model.uuid,
                statusIcon: {
                    color: '#A5A5A5',
                    icon: 'fa-solid fa-circle-check',
                    status: false,
                }
            };
            return option;
        }), 'mainLine');
    }

    loadGListList(genericLists: GenericListDto[]): OptionsObjectDto[] {
        return _.orderBy(_.map(genericLists, (gList: GenericListDto) => {
            const option: OptionsObjectDto = {
                title: this.translateService.transform(gList.displayName),
                mainLine: gList.key,
                uuid: gList.uuid,
                statusIcon: {
                    color: '#A5A5A5',
                    icon: 'fa-solid fa-circle-check',
                    status: false,
                }
            };
            return option;
        }), 'mainLine');
    }

    activateOptionList(data: OptionsObjectDto) {
        data.statusIcon.status = (data.statusIcon.status) ? false : true;
        data.statusIcon.color = (data.statusIcon.status) ? '#27AE60' : '#A5A5A5';
    }

    returnListElements(validateImportData: ValidateDataFileDto[], type: 'object' | 'link' | 'list' | 'document' | 'layer'): string[] {
        const data: ValidateDataFileDto = _.find(validateImportData, (vip: ValidateDataFileDto) => vip.type === type);
        return (!data) ? '' :
            _.map(data.importData, (ip: ValidateDataModel) => ip.model );
    }

    returnListDocs(validateImportData: ValidateDataFileDto[], type: 'object' | 'link' | 'list' | 'document' | 'layer'): number {
        const data: ValidateDataFileDto = _.find(validateImportData, (vip: ValidateDataFileDto) => vip.type === type);
        let docs = 0;
        if (!data) {
            return 0;
        }
        _.forEach(data.importData, (vip: ValidateDataModel) => {
                docs += vip.data.length;
        });
        return docs;
    }

    sendMessageService(inputLog: string, message: string, isError: boolean, isWarning = false) {
        const optionMessage: OptionLoggerMessage = {
            message,
            isError,
            isWarning,
        };
        this.messageService.send(inputLog, optionMessage);
    }
}
