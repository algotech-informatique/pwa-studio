import { TranslateLangDtoService } from '@algotech/angular';
import { SnAppDto, SnPageDto } from '@algotech/core';
import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from '../../../../app/dto';
import { AppActionsService, AppSelectionService } from '../../../../app/services';
import { UITree } from '../models/ui-tree';

@Component({
    selector: 'ui-tree-page',
    templateUrl: './ui-tree-page.component.html',
    styleUrls: ['ui-tree-page.component.scss'],
})
export class UITreePageComponent implements OnChanges {

    @Input() item: UITree;
    @Input() snApp: SnAppDto;
    @Input() settings: AppSettings;
    name: string;

    constructor(
        public appSelection: AppSelectionService,
        private translateService: TranslateService,
        private appActions: AppActionsService,
        private translateLangDtoService: TranslateLangDtoService,
    ) { }

    ngOnChanges() {
        this.name = this.translateLangDtoService.transform((this.item.element as SnPageDto).displayName);
    }

    onPageSelected() {
        this.appSelection.select(null, this.snApp, { element: this.item.element, type: 'page' });
    }

    onToggleLine(open: boolean) {
        this.item.open = open;
    }

    onNameChanged(name: string) {
        const currentLang = this.translateService.currentLang;
        (this.item.element as SnPageDto).displayName = (this.item.element as SnPageDto).displayName.map(dName => {
            if (dName.lang === currentLang) {
                dName.value = name;
            }
            return dName;
        });
        this.appActions.notifyUpdate(this.snApp);
    }

}
