import { Injectable } from '@angular/core';
import { ConfigDto, PreferencesDto, StoreConnectionDto, TabDto } from '../../dtos';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { DataService } from '@algotech/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ConfigService {

    _config: ConfigDto = null;

    get config() {
        return this._config;
    }

    constructor(
        private translate: TranslateService,
        private dataService: DataService,
    ) { }

    load(): Observable<ConfigDto> {
        return this.dataService.get<ConfigDto>('config', 'studio').pipe(
            map((data: ConfigDto) => {
                if (!data) {
                    this._config = this._createEmpty();
                } else {
                    this._config = data;
                }
                return this._config;
            }),
        );
    }

    getTabs(): TabDto[] {
        return (this._config.preferences?.tabs) ? this._config.preferences.tabs : [];
    }

    save(config: ConfigDto): Observable<ConfigDto> {
        this._config = config;
        return this.dataService.save(config, 'config', 'studio').pipe(
            map(() => this._config)
        );
    }

    _createEmpty(): ConfigDto {
        const newEmptyConfig: ConfigDto = {
            lang: this.translate.currentLang,
            preferences: {
                appPositions: [],
                positions: [],
                tabs: [],
                versions: [],
                watchers: [],
                checkOptions: {
                    checkOnDesign: true,
                    openDebug: ['onCheck', 'onPublish'],
                },
                dataBaseOptions: {
                    lastSelectedModelKey: ''
                },
            }
        };
        this.save(newEmptyConfig);
        this._config = newEmptyConfig;
        return newEmptyConfig;
    }

    setPreferences(preferences: PreferencesDto): Observable<ConfigDto> {
        this._config.preferences = preferences;
        return this.save(this._config);
    }

    setStoreConfig(store: StoreConnectionDto): Observable<ConfigDto> {
        this._config.storeConnection = store;
        return this.save(this._config);
    }
}
