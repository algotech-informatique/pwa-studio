import { KeyFormaterService } from '@algotech/angular';
import {
    Component, Input, Output, AfterViewInit, EventEmitter,
    OnChanges, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy
} from '@angular/core';
import * as _ from 'lodash';
import { SnDOMService } from '../../../../services';
import { SnInputItem, SnNode } from '../../../../models';
import { debounceTime, Subject } from 'rxjs';

@Component({
    selector: 'sn-input-key',
    templateUrl: './sn-input-key.component.html',
    styleUrls: ['./sn-input-key.component.scss'],
})
export class SnInputKeyComponent implements OnChanges, OnDestroy {

    @ViewChild('input') input: ElementRef;

    @Input() node: SnNode;
    @Input() value: string;
    @Input() icon: string;
    @Input() placeholder: string;
    @Input() listItems: SnInputItem[];

    @Output() updateValue = new EventEmitter<string>();

    predefined = false;
    top;
    predefinedListDisplay: SnInputItem[] = [];

    update$ = new Subject<string>();

    constructor(
        private keyFormater: KeyFormaterService,
        private ref: ChangeDetectorRef,
        private snDOM: SnDOMService,
    ) {
        this.update$.pipe(debounceTime(150))
            .subscribe((value: string) => {
                this.update(value);
            });
    }

    ngOnChanges() {
        this.value = this.value ? this.value : '';
    }

    ngOnDestroy() {
        this.update$.unsubscribe();
    }

    close() {
        this.predefined = false;
        this.top = null;
        this.ref.detectChanges();
    }

    update(value: string) {
        this.ref.detectChanges();
        this.value = this.keyFormater.format(value);
        this.top = null;
        this.predefined = false;
        this.predefinedListDisplay = [];
        this.updateValue.emit(this.value);
    }

    onToggleList(show: boolean, ev?: any) {
        this.predefined = show && this.listItems?.length > 0;
        this.ref.detectChanges();
        if (this.predefined) {
            this.onSearch(false);
            this.top = this.snDOM.getRelativeTop(this.input.nativeElement, this.node) as number;
        }
        if (ev) {
            ev.stopPropagation();
        }
    }

    onUpdate() {
        this.update$.next(this.value);
    }

    onSelectItem(item: SnInputItem) {
        this.update$.next(item.key);
    }

    onSearch(filter: boolean) {
        setTimeout(() => {
            this.predefinedListDisplay = _.sortBy((this.value !== '' && filter) ?
                _.reduce(this.listItems, (res: SnInputItem[], item: SnInputItem) => {
                    if (_.includes(item.key.toLowerCase(), this.value.toLowerCase()) && res.length <= 2) {
                        res.push(item);
                    }
                    return res;
                }, []) : this.listItems, 'key');
            this.ref.detectChanges();
        }, 400);
    }
}
