import { SettingsService } from '@algotech-ce/angular';
import { PatchPropertyDto, PatchService, SettingsDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';

@Injectable()
export class SettingsUpdateService {

    private _settingsTmp: SettingsDto = null;
    public settings: SettingsDto = null;

    constructor(
        private settingsService: SettingsService,
    ) {}

    initialize(settings: SettingsDto) {
        this.settings = settings;
        this._settingsTmp = _.cloneDeep(this.settings);
    }

    settingsUpdate(): Observable<PatchPropertyDto[]> {
        const patches = new PatchService<SettingsDto>().compare(this._settingsTmp, this.settings);
        if (patches.length > 0) {
            this._settingsTmp = _.cloneDeep(this.settings);
            return this.settingsService.patchProperty(this.settings.uuid, patches);
        } else {
            return of(null);
        }
    }
}
