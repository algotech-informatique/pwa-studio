import { LangDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SessionsService } from '../../../../services';
import { SnLang } from '../../../smart-nodes';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'display-translate-element',
    templateUrl: './display-translate-element.component.html',
    styleUrls: ['./display-translate-element.component.scss'],
})
export class DisplayTranslateElementComponent implements OnChanges {

    @Input() displayText: SnLang[];
    @Input() title: string;
    @Output() changed = new EventEmitter<LangDto[]>();

    languages: LangDto[];
    selectedLang: LangDto;
    textShowed: string;
    translations: [];
    top: number;

    constructor(
        private translate: TranslateService,
        private sessionsService: SessionsService,
    ) {
    }

    ngOnChanges() {
        this.top = null;
        this._createDisplay();

        this.translations = _.map(this.languages, (lng: LangDto) => {
            const findValue = _.find(this.displayText, { lang: lng.lang });
            return {
                key: lng.lang,
                langName: lng.value,
                value: findValue ? findValue.value : ''
            };
        });
        this._setTextShowed();
    }

    changeValue() {
        this._updateValue();
        this.changed.emit(_.map(this.translations, (field) => ({
            lang: field.key,
            value: field.value,
        })));
    }

    openChooseLanguage() {
        this.top = 31;
    }

    _setTextShowed() {
        this.textShowed = _.find(this.translations, { key: this.selectedLang.lang })?.value;
    }

    _createDisplay() {
        this.languages = this.sessionsService.active.datas.read.customer.languages;
        const findLang = this.languages.find((l) => l.lang === this.translate.currentLang);
        this.selectedLang = findLang ? findLang : this.languages[0];
    }

    onLangChanged(lang: LangDto) {
        this._updateValue();
        this.selectedLang = lang;
        this._setTextShowed();
    }

    _updateValue() {
        const field = _.find(this.translations, { key: this.selectedLang.lang });
        field.value = this.textShowed;
    }
}
