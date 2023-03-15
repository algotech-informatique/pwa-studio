import { Component, OnInit, EventEmitter, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SnTextFormattingService } from '../sn-preview-text-formatting.service';
import * as _ from 'lodash';
import { SnSection, SnParam, SnLang } from '../../../../smart-nodes/models';
import { NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'sn-edit-text-formatting',
    templateUrl: './sn-edit-text-formatting.component.html',
    styleUrls: ['./sn-edit-text-formatting.component.scss']
})
export class SnEditTextFormattingComponent implements OnInit {

    @ViewChildren('txtAreas') txtAreas: QueryList<ElementRef>;
    @ViewChildren('selectCombo') selectCombo: QueryList<ElementRef>;

    closePopup: EventEmitter<any>;
    sections: SnSection[] = [];
    activeLangs: SnLang[] = [];
    editText = [];

    selectedKey = '';
    activeText = '';
    previewText = '';

    caretPos = 0;
    listParams = [];
    modeEdition = true;
    defaultValue = '-1';
    display = true;

    constructor(
        private snTextFormattingService: SnTextFormattingService,
        private ref: ChangeDetectorRef,
        private translateService: TranslateService,
        private navParams: NavParams
    ) {
        this.closePopup = navParams.data.closePopup;
        this.sections = navParams.data.sections;
        this.activeLangs = navParams.data.activeLangs;
        this.editText = navParams.data.editText;
    }

    ngOnInit(): void {
        this.selectedLang(this.activeLangs[0].lang);
        this.creationParams();
    }

    onModeClick() {
        this.modeEdition = !this.modeEdition;
    }

    onChangeArea() {
        this.updateMessage(this.txtAreas.last.nativeElement.value);
    }

    onClose() {
        this.closePopup.emit(this.editText);
    }

    creationParams() {
        this.listParams = _.map(this.sections[0].params, (param: SnParam) => {
            return {
                key: param.key,
                value: param.key
            };
        });
        this.listParams.unshift({
            key: '-1',
            value: this.translateService.instant('SN-TEXT-FORMATTING-SELECT-ELEMENT')
        });
    }

    selectedLang(key) {
        this.selectedKey = key;
        this.activeText = _.find(this.editText, (text) => text.lang === this.selectedKey).value;
        this.previewText = this.snTextFormattingService.constructionPreview(this.activeText, this.sections[0].params);
    }

    onAddElementClick(event) {
        const key = event.srcElement.value;
        if (key !== '-1') {

            const text = '{{' + event.srcElement.value + '}}';
            this.transformText(text, '');
            this.display = false;
            this.ref.detectChanges();
            this.defaultValue = '-1';
            this.display = true;
            this.ref.detectChanges();
        }
    }

    transformText(textA: string, textB: string) {
        const startPosition = this.txtAreas.last.nativeElement.selectionStart;
        const endPosition = this.txtAreas.last.nativeElement.selectionEnd;

        const previewText: string = this.activeText.slice(0, startPosition);
        const mediumText: string = this.activeText.slice(startPosition, endPosition);
        const endText: string = this.activeText.slice(endPosition);
        const transformText = [previewText, textA, mediumText, textB, endText].join('');
        this.updateMessage(transformText);
    }

    updateMessage(transformText: string) {
        this.editText = _.cloneDeep(this.snTextFormattingService.updateTextFormatting(this.editText, this.selectedKey, transformText));
        this.selectedLang(this.selectedKey);
    }
}
