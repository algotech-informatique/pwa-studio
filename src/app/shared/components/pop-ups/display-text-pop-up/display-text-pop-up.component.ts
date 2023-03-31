import { Component, EventEmitter, Input, Output, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { SessionsService } from '../../../services/sessions/sessions.service';
import { LangDto } from '@algotech-ce/core';
import { TranslateService } from '@ngx-translate/core';
import { SnView } from '../../../modules/smart-nodes';
import * as _ from 'lodash';

@Component({
    selector: 'display-text-pop-up',
    templateUrl: './display-text-pop-up.component.html',
    styleUrls: ['./display-text-pop-up.component.scss'],
})
export class DisplayTextPopUpComponent implements OnChanges {

    @ViewChild('textarea') textarea: ElementRef;

    @Input() snView: SnView;
    @Input() translations;
    @Input() input: string;
    @Input() collectionItem: any;
    @Output() changed = new EventEmitter;

    translationFields = [];
    languages: LangDto[];
    selectedLang: LangDto;
    textShowed: string;

    _top: any = null;
    @Input()
    get top() {
        return this._top;
    }

    @Output() topChange = new EventEmitter();
    set top(data) {
        if (!data) {
            this.changeValue();
        }
        this._top = data;
        this.topChange.emit(data);
    }

    constructor(
        private sessionsService: SessionsService,
        public translate: TranslateService,
    ) {
    }

    ngOnChanges() {
        this.createDisplay();
    }

    createDisplay() {
        this.languages = this.sessionsService.active.datas.read.customer.languages;
        const findLang = this.languages.find((l) => l.lang === this.translate.currentLang);
        this.selectedLang = findLang ? findLang : this.languages[0];
        this.translationFields = _.map(this.languages, (lng: LangDto) => {
            const findValue = _.find(this.translations, { lang: lng.lang });
            return {
                key: lng.lang,
                langName: lng.value,
                value: findValue ? findValue.value : ''
            };
        });
        this._setTextShowed();
    }

    changeValue() {
        this.changed.emit(_.map(this.translationFields, (field) => ({
            lang: field.key,
            value: field.value,
        })));
    }

    _setTextShowed() {
        this.textShowed = _.find(this.translationFields, { key: this.selectedLang.lang })?.value;
    }

    close() {
        this._updateValue();
        this.top = null;
    }

    selectLang(lang: LangDto) {
        this._updateValue();
        this.selectedLang = lang;
        this._setTextShowed();
    }

    _updateValue() {
        const field = _.find(this.translationFields, { key: this.selectedLang.lang });
        field.value = this.textShowed;
    }

    addInput() {
        const inputText = '{{' + this.input + '}}';
        const startPosition = this.textarea.nativeElement.selectionStart;
        const endPosition = this.textarea.nativeElement.selectionEnd;
        const startText: string = this.textShowed.slice(0, startPosition);
        const endText: string = this.textShowed.slice(endPosition);
        this.textShowed = startText + inputText + endText;
    }

}
