import { SessionsService } from './../../../../services/sessions/sessions.service';
import { LangDto } from '@algotech-ce/core';
import { SnLang } from './../../../smart-nodes/models/sn-lang';
import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnView } from '../../../smart-nodes';
import { WidgetInput } from '../../../app-custom/dto/widget-input.dto';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { PopupContainerDto } from '../../dto/popup-container.dto';
import { DataSelectorResult } from '../../dto/data-selector-result.dto';
import { EventTextInputChanged } from '../../dto/event-text-input-changed.dto';

@Component({
    selector: 'display-text-element',
    templateUrl: './display-text-element.component.html',
    styleUrls: ['./display-text-element.component.scss'],
})
export class DisplayTextElementComponent implements OnInit, OnChanges {

    @ViewChild('textarea') textarea: ElementRef;
    @ViewChild('container') container: ElementRef;

    @Input() title: string;
    @Input() snView: SnView;
    @Input() displayText: SnLang[];
    @Input() displayPreview: SnLang[];
    @Input() items: Observable<WidgetInput[]>;
    @Input() rows = 10;
    @Input() languages: LangDto[];
    @Output() changed = new EventEmitter();
    @Output() preview = new EventEmitter();

    _selectedLang: LangDto;
    @Input()
    get selectedLang() {
        return this._selectedLang;
    }
    @Output() selectedLangChange = new EventEmitter();
    set selectedLang(data) {
        this._selectedLang = data;
        this.selectedLangChange.emit(data);
    }

    showDataSelector = true;
    textShowed: string;
    translations: [];
    showLanguages = false;
    top: number = null;
    textContainer: PopupContainerDto;
    popupMargin = 3;
    dataSelectorShowed = false;
    mode: 'edition' | 'preview';

    constructor(
        public translate: TranslateService,
        private sessionsService: SessionsService,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.languages = this.sessionsService.active.datas.read.customer.languages;
        const findLang = this.languages.find((l) => l.lang === this.translate.currentLang);
        this.selectedLang = findLang ? findLang : this.languages[0];
        this.selectMode('edition');
    }

    ngOnChanges() {
        this.translations = _.map(this.languages, (lng: LangDto) => {
            const findValue = _.find(this.mode === 'edition' ? this.displayText : this.displayPreview, { lang: lng.lang });
            return {
                key: lng.lang,
                langName: lng.value,
                value: findValue ? findValue.value : ''
            };
        });
        this.setTextShowed();
    }

    selectMode(mode: 'edition' | 'preview') {
        this.mode = mode;
        this.showDataSelector = mode === 'edition';
        this.translations = _.map(this.languages, (lng: LangDto) => {
            const findValue = _.find(mode === 'edition' ? this.displayText : this.displayPreview, { lang: lng.lang });
            return {
                key: lng.lang,
                langName: lng.value,
                value: findValue ? findValue.value : ''
            };
        });
        this.setTextShowed();
    }

    changeValue(notify: boolean) {
        this.updateValue();
        const changes = _.map(this.translations, (field) => ({
            lang: field.key,
            value: field.value,
        }));
        if (this.mode === 'edition') {
            this.changed.emit(new EventTextInputChanged(changes, notify));
        } else {
            this.preview.emit(changes);
        }
    }

    addInput(inputText: DataSelectorResult) {
        const startPosition = this.textarea.nativeElement.selectionStart;
        const endPosition = this.textarea.nativeElement.selectionEnd;
        const startText: string = this.textShowed.slice(0, startPosition);
        const endText: string = this.textShowed.slice(endPosition);
        this.textShowed = startText + inputText.path + endText;

        this.textarea.nativeElement.value = this.textShowed;
        this.textarea.nativeElement.focus();
        this.textarea.nativeElement.selectionStart = startPosition + inputText.path.length;
        this.textarea.nativeElement.selectionEnd = startPosition + inputText.path.length;
        this.changeValue(true);

        this.dataSelectorShowed = false;
    }

    openChooseLanguage() {
        this.top = 31;
    }

    openDataSelector(event: any) {
        event.stopPropagation();
        this.textContainer = {
            top: this.container.nativeElement.offsetTop,
            height: this.container.nativeElement.offsetHeight,
            left: this.container.nativeElement.offsetLeft,
            containerClientRect: this.container.nativeElement.getBoundingClientRect(),
        };
        this.dataSelectorShowed = !this.dataSelectorShowed;
        this.changeDetectorRef.detectChanges();
    }

    onLangChanged(lang: LangDto) {
        this.updateValue();
        this.selectedLang = lang;
        this.setTextShowed();
    }

    closeDataSelector() {
        this.dataSelectorShowed = false;
    }

    private updateValue() {
        const field = _.find(this.translations, { key: this.selectedLang.lang });
        field.value = this.textShowed;
    }

    private setTextShowed() {
        if (!this.selectedLang) {
            return ;
        }
        this.textShowed = _.find(this.translations, { key: this.selectedLang.lang })?.value;
    }

}
