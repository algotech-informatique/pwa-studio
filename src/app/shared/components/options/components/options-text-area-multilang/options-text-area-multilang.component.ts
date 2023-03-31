import { LangDto } from '@algotech-ce/core';
import { Component, EventEmitter, ElementRef, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { SessionsService } from '../../../../services';
import { SnView } from '../../../../modules/smart-nodes';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'options-text-area-multilang',
    templateUrl: './options-text-area-multilang.component.html',
    styleUrls: ['./options-text-area-multilang.component.scss'],
})
export class OptionsTextAreaMultilangComponent implements OnChanges {

    @ViewChild('textarea') textarea: ElementRef;

    @Input() rows = 10;
    @Input() endLabel = '';
    @Input() inputText: LangDto[] = [];
    @Input() includeBottomBorder = false;
    @Input() readOnly = false;

    @Output() updateText = new EventEmitter<LangDto[]>();

    languages: LangDto[];
    selectedLang: LangDto;
    textShowed: string;
    translations: [];

    top: number;
    snView: SnView;

    constructor(
        private translate: TranslateService,
        private sessionsService: SessionsService,
    ) { }

    ngOnChanges() {
        this.top = null;
        this._createDisplay();

        this.translations = _.map(this.languages, (lng: LangDto) => {
            const findValue = _.find(this.inputText, { lang: lng.lang });
            return {
                key: lng.lang,
                langName: lng.value,
                value: findValue ? findValue.value : ''
            };
        });
        this._setTextShowed();
    }

    openChooseLanguage() {
        this.top = 31;
    }

    onChangeValue() {
        this._updateValue();
        this.updateText.emit(_.map(this.translations, (field) => ({
            lang: field.key,
            value: field.value,
        })));
    }

    onLangChanged(lang: LangDto) {
        this._updateValue();
        this.selectedLang = lang;
        this._setTextShowed();
    }

    _setTextShowed() {
        this.textShowed = _.find(this.translations, { key: this.selectedLang.lang })?.value;
    }

    _createDisplay() {
        this.languages = this.sessionsService.active.datas.read.customer.languages;
        const findLang = this.languages.find((l) => l.lang === this.translate.currentLang);
        this.selectedLang = findLang ? findLang : this.languages[0];
    }

    _updateValue() {
        const field = _.find(this.translations, { key: this.selectedLang.lang });
        field.value = this.textShowed;
    }
}
