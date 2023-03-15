import { ThemeEngloberService } from '@algotech/business';
import { SnAppDto, ThemeDto } from '@algotech/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListItem } from '../../../dto/list-item.dto';
import * as _ from 'lodash';

@Component({
    selector: 'app-parameters-theme',
    templateUrl: './app-parameters-theme.component.html',
    styleUrls: ['./app-parameters-theme.component.scss'],
})
export class AppParametersThemeComponent {

    @Input() snApp: SnAppDto;
    @Output() themeChanged = new EventEmitter();
    keyProperties: string[];

    themes: ListItem[] = [
        { key: 'light', value: 'THEME-LIGHT', icon: 'fa-solid fa-sun' },
        { key: 'dark', value: 'THEME-DARK', icon: 'fa-solid fa-moon' },
        { key: 'custom', value: 'THEME-CUSTOM', icon: 'fa-solid fa-palette' },
    ];

    constructor(
        private themeEnglober: ThemeEngloberService,
    ) {
        this.keyProperties = themeEnglober.keyProperties;
    }

    onSelectTheme(themeKey: string) {
        const theme: ThemeDto = {
            themeKey,
            customColors: this.snApp?.theme?.customColors,
        };
        this.snApp.theme = theme;
        this.themeChanged.emit();
    }

    onColorChanged(key: string, color: string) {
        const theme: ThemeDto = _.cloneDeep(this.snApp?.theme);
        const property = theme?.customColors.find((ele) => ele.key === key);
        if (property) {
            property.value = color;
            this.snApp.theme = theme;
            this.themeChanged.emit();
        }
    }

}
