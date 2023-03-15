import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { SnLang, SnSection } from '../../../../smart-nodes/models';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-uuid';

@Component({
    selector: 'sn-preview-text-formatting',
    templateUrl: './sn-preview-text-formatting.component.html',
    styleUrls: ['./sn-preview-text-formatting.component.scss']
})
export class SnPreviewTextFormattingComponent implements OnChanges {

    @Input() previewText = [];
    @Input() activeLangs: SnLang[] = [];
    @Input() headerVisible = true;
    @Input() section: SnSection;

    showText = '';
    selectedKey = '';

    constructor(
        private translateService:  TranslateService,
    ) {
    }

    ngOnChanges() {
        if (this.activeLangs.length !== 0) {
            this.selectedLang(this.activeLangs[0].lang);
        }
    }

    selectedLang(key) {
        this.selectedKey = key;
        const preview = _.find(this.previewText, (prev) => prev.lang === key);
        this.showText = (preview) ? preview.value : '';
    }
}
