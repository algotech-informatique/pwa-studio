import {
    Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnDestroy, AfterViewInit, ChangeDetectorRef, OnChanges,
} from '@angular/core';
import { SnItem, SnNode, SnView } from '../../../../models';
import * as _ from 'lodash';
import { SnActionsService, SnDOMService, SnSelectionService } from '../../../../services';
import { Subscription } from 'rxjs';

@Component({
    selector: 'sn-input-select',
    templateUrl: './sn-input-select.component.html',
    styleUrls: ['./sn-input-select.component.scss'],
})
export class SnInputSelectComponent implements OnDestroy, AfterViewInit, OnChanges {

    @ViewChild('select') selectElt: ElementRef;
    @ViewChild('searchInput') searchInput: ElementRef;
    @Input() snView: SnView;
    @Input() value: string;
    @Input() list: SnItem[] = [];
    @Input() node: SnNode;
    @Output() updateValue = new EventEmitter<any>();
    showList = false;
    top = 0;
    selectedValue: SnItem;
    subscription: Subscription;
    filterList: SnItem[];
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
            this.selectedValue = _.find(this.list, (item: SnItem) => item.key && item.key === this.value);
            this.filterList = this.list;
        }
    }

    toggleList(show: boolean, ev?: any) {
        this.showList = show;
        this.changeDetectorRef.detectChanges();
        if (this.showList) {
            this.focusSearch();
            this.search = '';
            this.filterList = this.list;
            this.top = this.snDOM.getRelativeTop(this.selectElt.nativeElement, this.node);
        }
        if (ev) {
            ev.stopPropagation();
        }
    }

    selectItem($event, item: SnItem) {
        $event.stopPropagation();
        if (!item.disabled) {
            this.updateValue.emit(item.key);
            this.toggleList(false);
        }
    }

    onSearch() {
        this.filterList = _.reduce(this.list, (res: SnItem[], item: SnItem) => {
            if (_.includes(item.value.toLowerCase(), this.search.toLowerCase())) {
                res.push(item);
            }
            return res;
        }, []);
        this.changeDetectorRef.detectChanges();
    }

    resetSearch(event: any) {
        event.stopPropagation();
        this.search = '';
        this.filterList = this.list;
        this.focusSearch();
    }

    private focusSearch() {
        if (this.searchInput) {
            this.searchInput.nativeElement.focus();
        }
    }

}
