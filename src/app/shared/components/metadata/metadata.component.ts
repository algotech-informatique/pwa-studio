import { KeyFormaterService } from '@algotech-ce/angular';
import { Component, Input, OnChanges } from '@angular/core';
import { DialogMessageService, SessionsService, ToastService } from '../../services';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { AlertMessageDto, OptionsObjectDto } from '../../dtos';
import {  LangDto } from '@algotech-ce/core';
import { DocumentsMetaDatasSettingsDto } from '@algotech-ce/core';
import { SettingsUpdateService } from '../../services/settings/settings-update.service';

@Component({
    selector: 'app-metadata',
    templateUrl: './metadata.component.html',
    styleUrls: ['./metadata.component.scss'],
})
export class MetadataComponent implements OnChanges {

    @Input() customerKey: string;
    @Input() host: string;

    selectedMetadata;
    selectedId: string;
    search = '';
    customerLangs: LangDto[];

    _metadataList: DocumentsMetaDatasSettingsDto[] = [];
    set metadataList(value: DocumentsMetaDatasSettingsDto[]) {
        this._metadataList = value;
        this.sessionService.active.datas.read.settings.documents.metadatas = this._metadataList;
    }

    get metadataList(): DocumentsMetaDatasSettingsDto[] {
        return this._metadataList;
    }

    constructor(
        private settingsUpdateService: SettingsUpdateService,
        private sessionService: SessionsService,
        private toastService: ToastService,
        private translateService: TranslateService,
        private dialogMessageService: DialogMessageService,
        private keyFormater: KeyFormaterService,
    ) {

        this.settingsUpdateService.initialize(this.sessionService.active.datas.read.settings);
    }

    ngOnChanges() {
        this.onLoad();
        this.customerLangs = this.sessionService.active.datas.read.customer.languages;
        this._restart();
    }

    onLoad() {
        this.metadataList = _.orderBy(this.settingsUpdateService.settings.documents.metadatas, 'key');
    }

    onSelectedMetadata(data: OptionsObjectDto) {
        this._selectMetadata(data.uuid);
    }

    _selectMetadata(key) {
        const index = _.findIndex(this.metadataList, (mData) => mData.key === key);
        if (index !== -1) {
            this.selectedMetadata = this.metadataList[index];
            this.selectedId = key;
        }
    }

    _restart() {
        this.selectedId = '';
        this.selectedMetadata = null;
        this.search = '';
    }

    onCreateNewMetadata() {
        const newData = {
            key: 'new-metadata',
            displayName: this._generateLanguagesName(this.customerLangs),
        };
        const index = _.findIndex(this.metadataList, (mData) => mData.key === newData.key);
        if (index === -1) {
            this.metadataList.unshift(newData);
            this.selectedMetadata = newData;
            this.selectedId = newData.key;
        } else {
            this.toastService.addToast('error', '',
                this.translateService.instant('SETTINGS.DOCUMENTS.METADATA.ERROR-DUPLICATE', { key: newData.key }), 3000);
        }
    }

    onUpdateMetadata(data: {data: DocumentsMetaDatasSettingsDto, option: string}) {
        if (data.option === 'add') {
            if (!data.data.key) {
                this.toastService.addToast('error', '',
                    this.translateService.instant('SETTINGS.DOCUMENTS.METADATA.ERROR-KEY-EMPTY'), 3000);
                return;
            }

            const formatKey: string = this.keyFormater.format(data.data.key);
            const keyIsUnique: boolean = _.findIndex(this.metadataList, { key: formatKey }) === -1;
            if (keyIsUnique) {
                const newData = {
                    key: formatKey,
                    displayName: data.data.displayName,
                };
                this._updateMetaDataList(newData, 'new-metadata', 'update');
                this.selectedMetadata = newData;
                this.selectedId = formatKey;
            } else {
                this.toastService.addToast('error', '',
                    this.translateService.instant('SETTINGS.DOCUMENTS.METADATA.ERROR-DUPLICATE', { key: formatKey }), 3000);
            }
        } else {
            this._updateMetaDataList(data.data, data.data.key, 'update');
        }
    }

    _updateMetaDataList(metadata: DocumentsMetaDatasSettingsDto, key: string, option: 'update' | 'delete') {
        const lData: DocumentsMetaDatasSettingsDto[] = this.metadataList;
        const index = _.findIndex(lData, (mData: DocumentsMetaDatasSettingsDto) => mData.key === key);
        if (index !== -1) {

            if (option === 'delete') {
                lData.splice(index, 1);
                this._restart();
            } else {
                lData[index] = metadata;
            }
            this.metadataList = _.cloneDeep(lData);
            this.settingsUpdateService.settings.documents.metadatas = this.metadataList;
            this.settingsUpdateService.settingsUpdate().subscribe(() => {
               this.onLoad();
            });
        }
    }

    onRemoveMetadata(data: DocumentsMetaDatasSettingsDto) {
        const alertMessage: AlertMessageDto = {
            confirm: this.translateService.instant('DIALOGBOX.DELETE'),
            cancel: this.translateService.instant('DIALOGBOX.CANCEL'),
            message: this.translateService.instant('SETTINGS.DOCUMENTS.METADATA.DELETE_CONFIRM'),
            title: this.translateService.instant('SETTINGS.DOCUMENTS.METADATA.DELETE'),
            type: 'question',
            messageButton: true,
        };
        this.dialogMessageService.getMessageConfirm(alertMessage).pipe().subscribe((result: boolean) => {
            if (result) {
                this._updateMetaDataList(data, data.key, 'delete');
            }
        }, (err) => console.error(err));
    }

    _generateLanguagesName(languages: Array<LangDto>): Array<LangDto> {
        return _.map(languages, language => {
            return { lang: language.lang, value: '' };
        });
    }
}
