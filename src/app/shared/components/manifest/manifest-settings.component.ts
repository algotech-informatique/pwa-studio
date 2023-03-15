import { mergeMap } from 'rxjs/operators';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ManifestSettingsService } from './manifest-settings.service';
import { ListItem } from './../../modules/inspector/dto/list-item.dto';
import { PlayerManifestDto } from '@algotech/core';
import * as _ from 'lodash';

@Component({
    selector: 'app-manifest',
    templateUrl: './manifest-settings.component.html',
    styleUrls: ['./manifest-settings.component.scss']
})

export class ManifestSettingsComponent {

    api: string;
    color = '#F95959';
    displayList: ListItem[];
    orientationList: ListItem[];
    manifest: PlayerManifestDto;
    file: File;

    constructor(
        private translate: TranslateService,
        private manifestService: ManifestSettingsService
    ) {
        this.displayList = [
            { key: 'fullscreen', value: this.translate.instant('SETTINGS-MANIFEST-DISPLAY-FULLSCREEN') },
            { key: 'standalone', value: this.translate.instant('SETTINGS-MANIFEST-DISPLAY-STANDALONE') },
            { key: 'minimal-ui', value: this.translate.instant('SETTINGS-MANIFEST-DISPLAY-MINIMAL') },
            { key: 'browser', value: this.translate.instant('SETTINGS-MANIFEST-DISPLAY-BROWSER') },
        ];
        this.orientationList = [
            { key: 'landscape', value: this.translate.instant('SETTINGS-MANIFEST-ORIENTATION-LANDSCAPE') },
            { key: 'landscape-primary', value: this.translate.instant('SETTINGS-MANIFEST-ORIENTATION-LANDSCAPE-PRIMARY') },
            { key: 'portrait', value: this.translate.instant('SETTINGS-MANIFEST-ORIENTATION-PORTRAIT') },
            { key: 'portrait-primary', value: this.translate.instant('SETTINGS-MANIFEST-ORIENTATION-PORTRAIT-PRIMARY') },
        ];

        this.manifestService.getManifest().pipe(
            mergeMap((settingsManifest) => {
                this.manifest = settingsManifest;
                return this.manifestService.downloadIcon();
            })
        ).subscribe((file: File) => {
            if(file) {
                this.file = file;
            }
            console.log('manifest Loaded', this.manifest);
        });
   }

    onChangeFile(data) {
        this.file = undefined;

        setTimeout(() => {
            this.manifestService.uploadFile(data.addedFiles[0]).subscribe(
                () => this.file = data.addedFiles[0]
            );
        });
    }

    onChange(element: string, value: string) {
        switch(element) {
            case 'name':
            case 'short_name':
            case 'theme_color':
            case 'background_color':
            case 'orientation':
                this.manifest[element] = value;
                this.manifestService.update(this.manifest);
        }
    }
}
