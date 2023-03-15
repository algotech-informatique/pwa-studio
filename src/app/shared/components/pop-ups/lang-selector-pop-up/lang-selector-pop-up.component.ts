import { fromEvent, Subscription } from 'rxjs';
import { LangDto } from '@algotech/core';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { SnLang, SnView } from '../../../modules/smart-nodes';
import * as _ from 'lodash';

@Component({
    selector: 'lang-selector-pop-up',
    templateUrl: './lang-selector-pop-up.component.html',
    styleUrls: ['./lang-selector-pop-up.component.scss'],
})
export class LangSelectorPopUpComponent implements OnChanges, OnDestroy {

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
    @Input() langs: SnLang[] = [];
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

    chooseLang(lang: SnLang) {
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
