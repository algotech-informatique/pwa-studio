import { Injectable } from '@angular/core';
import { SnZoomService } from '../../modules/smart-nodes';
import { TabDto, CheckOptionsDto, PreferencesDto, DataBaseOptionsDto } from '../../dtos';
import { ConfigService } from '../config/config.service';
import { SnModelsService } from '../smart-nodes/smart-nodes.service';
import * as _ from 'lodash';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { AppZoomService } from '../../modules/app/services';
import { merge, Subject } from 'rxjs';
import { WatcherService } from '../watcher/watcher.service';

@Injectable()
export class PreferencesService {

    savePreferences = new Subject();
    constructor(
        private appZoomService: AppZoomService,
        private snZoomService: SnZoomService,
        private snModelsService: SnModelsService,
        private watchersService: WatcherService,
        private configService: ConfigService) {

        this.savePreferences.pipe(
            mergeMap((tabs: TabDto[]) => {
                (this.preferences as PreferencesDto).tabs = tabs;
                (this.preferences as PreferencesDto).versions = this.snModelsService._activeVersions;
                (this.preferences as PreferencesDto).watchers = this.watchersService.watchers;
                return this.configService.setPreferences((this.preferences as PreferencesDto));
            })
        ).subscribe();

        merge(
            this.appZoomService.zoomed,
            this.snZoomService.zoomed
        ).pipe(
            debounceTime(1000),
            mergeMap(() => {
                (this.preferences as PreferencesDto).positions = this.snZoomService.transforms;
                (this.preferences as PreferencesDto).appPositions = this.appZoomService.transforms;
                return this.configService.setPreferences((this.preferences as PreferencesDto));
            })
        ).subscribe();
    }

    get config() {
        return this.configService.config;
    }

    get preferences() {
        return this.config.preferences;
    }

    save(tabs: TabDto[]) {
        this.savePreferences.next(tabs);
    }

    saveCheckOptions(checkOptions: CheckOptionsDto) {
        (this.preferences as PreferencesDto).checkOptions = checkOptions;
        this.configService.setPreferences((this.preferences as PreferencesDto)).subscribe();
    }

    saveDataBaseOptions(dataBaseOptions: DataBaseOptionsDto) {
        (this.preferences as PreferencesDto).dataBaseOptions = dataBaseOptions;
        this.configService.setPreferences((this.preferences as PreferencesDto)).subscribe();
    }

    restoreMandatory() {
        if (this.config?.preferences) {
            this.snZoomService.transforms = (this.preferences as PreferencesDto).positions ?
                (this.preferences as PreferencesDto).positions : [];
            this.appZoomService.transforms = (this.preferences as PreferencesDto).appPositions ?
                (this.preferences as PreferencesDto).appPositions : [];
            this.snModelsService._activeVersions = (this.preferences as PreferencesDto).versions;
            this.watchersService.watchers = (this.preferences as PreferencesDto).watchers ?
                (this.preferences as PreferencesDto).watchers : [];
            if (!this.config.preferences.checkOptions) {
                this.saveCheckOptions({
                    checkOnDesign: true,
                    openDebug: ['onDesign', 'onCheck', 'onPublish'],
                });
            }
            if (!this.config.preferences.dataBaseOptions) {
                this.saveDataBaseOptions({
                    lastSelectedModelKey: ''
                });
            }
        }
    }
}

