import { LangDto } from '@algotech-ce/core';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { SnView } from '../../../../../modules/smart-nodes';
import * as _ from 'lodash';

@Component({
    selector: 'option-multilang-pop-up',
    templateUrl: './option-multilang-pop-up.component.html',
    styleUrls: ['./option-multilang-pop-up.component.scss'],
})
export class OptionMultilangPopUpComponent implements OnChanges {

    @ViewChild('modal') modal: ElementRef;

    _top: any = null;
    @Input()
    get top() {
        return this._top;
    }

    @Output() topChange = new EventEmitter();
    set top(data) {
        this._top = data;
        this.topChange.emit(data);
    }

    @Input() snView: SnView = null;
    @Input() langs: LangDto[] = [];
    @Input() selected: LangDto;
    @Input() short: boolean;

    @Output() changed = new EventEmitter();

    subscription: Subscription;
    showPopup: boolean;

    constructor() { }

    ngOnChanges() {
        if (this.top || this.top !== null) {
            this.subscription = fromEvent(document, 'click').subscribe((event) => {
                const className = (<HTMLInputElement>event.target).className;
                if ((!_.isString(className) || (_.isString(className) && !className.includes('lang-selector-pop-up'))) && this.showPopup) {
                    this.close();
                } else if (!this.showPopup) {
                    this.showPopup = true;
                }
            });
        }
    }

    chooseLang(lang: LangDto) {
        this.changed.emit(lang);
        this.close();
    }

    close() {
        this.showPopup = false;
        this.top = null;
        this.subscription.unsubscribe();
        this.topChange.emit(this.top);
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
