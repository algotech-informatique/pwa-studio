import { Component, EventEmitter, Input, Output, OnChanges, AfterViewInit, ChangeDetectorRef, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { SessionsService } from '../../../services/sessions/sessions.service';
import { LangDto } from '@algotech/core';
import { TranslateService } from '@ngx-translate/core';
import { SnView } from '../../../modules/smart-nodes';
import * as _ from 'lodash';
import { IonInput } from '@ionic/angular';

@Component({
    selector: 'display-name-pop-up',
    templateUrl: './display-name-pop-up.component.html',
    styleUrls: ['./display-name-pop-up.component.scss'],
})
export class DisplayNamePopUpComponent implements OnChanges, AfterViewInit {

    @ViewChildren('inputs', { read: IonInput }) private inputs: QueryList<IonInput>;
    @Input() snView: SnView;
    @Input() translations;

    @Output() changed = new EventEmitter;
    translationFields = [];

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
        private ref: ChangeDetectorRef,
        private sessionsService: SessionsService,
        public translate: TranslateService,
    ) {
    }

    ngAfterViewInit() {
        this.ref.detectChanges();
        if (this.inputs?.length > 0) {
            this.inputs.first.setFocus();
            this.inputs.first.getInputElement().then((input: HTMLInputElement) => {
                input.select();
            });
        }
    }

    ngOnChanges() {
        this.createDisplay();
    }

    createDisplay() {
        this.translationFields = _.map(this.sessionsService.active.datas.read.customer.languages, (lng: LangDto) => {
            const findValue = _.find(this.translations, { lang: lng.lang });
            return {
                key: lng.lang,
                langName: lng.value,
                value: findValue ? findValue.value : ''
            };
        });
    }

    changeValue() {
        this.changed.emit(_.map(this.translationFields, (field) => ({
            lang: field.key,
            value: field.value,
        })));
    }

    close() {
        this.top = null;
    }
}
