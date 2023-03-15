import { SettingsService } from '@algotech/angular';
import { PatchPropertyDto, SettingsDto, ThemeDto } from '@algotech/core';
import { Component, OnInit } from '@angular/core';
import { SessionsService } from '../../services';

@Component({
    selector: 'app-theme-editor',
    template: `
        <theme-editor [theme]="theme" [showDebugger]= true (themeChanged)="onThemeChanged($event)">
        </theme-editor>
    `
})

export class ThemeEditorLayoutComponent implements OnInit {
    theme: ThemeDto;
    constructor(private sessionsService:  SessionsService, private settingsService: SettingsService) { }

    onThemeChanged(theme: ThemeDto) {
        this.theme = theme;
        this.sessionsService.active.datas.read.settings.theme = theme;
            const patches: PatchPropertyDto[] = [{
                op: 'replace',
                path: '/theme',
                value: this.theme,
            }];
            this.settingsService.patchProperty(this.sessionsService.active.datas.read.settings.uuid, patches).subscribe();
    }

    ngOnInit() {
        this.settingsService.getSettings([{ key: 'show', value: 'theme' }]).subscribe((res: SettingsDto) => {
            this.sessionsService.active.datas.read.settings.theme = res.theme;
            this.theme = res.theme;
        });
    }
}
