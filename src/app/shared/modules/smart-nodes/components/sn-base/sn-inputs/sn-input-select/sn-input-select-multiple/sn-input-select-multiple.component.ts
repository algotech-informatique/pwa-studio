import { Component, Input, Output, EventEmitter, OnChanges, ViewChild, ElementRef, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SnItem, SnNode, SnView } from '../../../../../models';
import * as _ from 'lodash';
import { SnActionsService, SnDOMService, SnSelectionService } from '../../../../../services';
import { Subscription } from 'rxjs';

@Component({
    selector: 'sn-input-select-multiple',
    templateUrl: './sn-input-select-multiple.component.html',
    styleUrls: ['../sn-input-select.component.scss'],
})
export class SnInputSelectMultipleComponent implements OnChanges, OnDestroy, AfterViewInit {

    @ViewChild('select') selectElt: ElementRef;
    @ViewChild('searchInput') searchInput: ElementRef;
    @Input() snView: SnView;
    @Input() values: string[];
    @Input() list: SnItem[] = [];
    @Input() node: SnNode;
    @Output() updateValue = new EventEmitter<any>();
    listDisplay: { item: SnItem, selected: boolean }[];
    showList = false;
    top = 0;
    selectedValues: SnItem[];
    overview: string;
    subscription: Subscription;
    filterList: { item: SnItem, selected: boolean }[];
    search = '';

    constructor(
        private snDOM: SnDOMService,
        private snSelect: SnSelectionService,
        private snActions: SnActionsService,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngAfterViewInit() {
        this.subscription = this.snSelect.onSelect(this.snView).subscribe(() => {
            if (this.showList) {
                this.showList = false;
                this.snActions.notifyRefresh(this.snView);
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ngOnChanges() {
        if (this.list) {
            this.overview = null;
            this.listDisplay = _.map(this.list, (item: SnItem) => {
                const selected = this.values && _.includes(this.values, item.key);
                if (selected) {
                    this.overview = this.overview ? this.overview.concat(', ', item.value) : item.value;
                }
                return {
                    item,
                    selected,
                };
            });
            this.filterList = this.listDisplay;
        }
    }

    toggleList(show: boolean, ev?) {
        this.showList = show;
        this.changeDetectorRef.detectChanges();
        if (this.showList) {
            this.focusSearch();
            this.search = '';
            this.filterList = this.listDisplay;
            this.top = this.snDOM.getRelativeTop(this.selectElt.nativeElement, this.node);
        }
        if (ev) {
            ev.stopPropagation();
        }
    }

    selectItem($event, itemDisplay: { item: SnItem, selected: boolean }) {
        $event.stopPropagation();
        this.search = '';
        let _values = _.clone(this.values);
        if (itemDisplay.selected) {
            const index: number = _.findIndex(_values, (val: string) => val === itemDisplay.item.key);
            _values.splice(index, 1);
        } else {
            _values ? _values.push(itemDisplay.item.key) : _values = [itemDisplay.item.key];
        }
        _values = _.filter(_values, (value: string) => this.list.find((item) => item.key === value));
        this.updateValue.emit(_values);
    }

    onSearch() {
        this.filterList = _.reduce(this.listDisplay,
            (res: { item: SnItem, selected: boolean }[], l: { item: SnItem, selected: boolean }) => {
                if (_.includes(l.item.value.toLowerCase(), this.search.toLowerCase())) {
                    res.push(l);
                }
                return res;
            }, []);
        this.changeDetectorRef.detectChanges();
    }

    resetSearch(event: any) {
        event.stopPropagation();
        this.search = '';
        this.filterList = this.listDisplay;
        this.focusSearch();
    }

    private focusSearch() {
        if (this.searchInput) {
            this.searchInput.nativeElement.focus();
        }
    }

}
