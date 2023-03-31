import { ListItem } from '../../dto/list-item.dto';
import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import { PopupContainerDto } from '../../dto/popup-container.dto';

@Component({
    selector: 'select-element',
    templateUrl: './select-element.component.html',
    styleUrls: ['./select-element.component.scss'],
})
export class SelectElementComponent implements OnChanges {

    @ViewChild('searchInput') searchInput: ElementRef;
    @ViewChild('container') container: ElementRef;
    @Input() title: string;
    @Input() subTitle: string;
    @Input() list: ListItem[];
    @Input() showSearch = true;
    @Input() placeholder = '';
    @Input() allowForScroll = true;
    @Input() selectedKey: string;
    @Output() selectNewItem = new EventEmitter<string>();
    @Output() mouseenterItem = new EventEmitter<ListItem>();
    @Output() mouseleaveItem = new EventEmitter<ListItem>();

    selectedItem: ListItem;
    showList: boolean;
    search: string;
    filteredList: ListItem[];
    selectContainer: PopupContainerDto;
    popupMargin = 3;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedKey) {
            this.selectedItem = _.find(this.list, { key: this.selectedKey });
        }
        if (changes.list?.currentValue) {
            this.selectedItem = _.find(this.list, { key: this.selectedKey });
            this.filteredList = this.getFilteredList();
        }
    }

    clickOnSelect(event: any) {
        event.stopPropagation();
        this.selectContainer = {
            top: this.container.nativeElement.offsetTop,
            height: this.container.nativeElement.offsetHeight,
            left: this.container.nativeElement.offsetLeft,
            containerClientRect: this.container.nativeElement.getBoundingClientRect(),
        };
        this.showList = !this.showList;
        this.changeDetectorRef.detectChanges();
        if (this.showList) {
            if (this.searchInput) {
                this.searchInput.nativeElement.focus();
            }
        } else {
            this.resetSearch();
        }
    }

    closePopup() {
        this.showList = false;
        this.resetSearch();
    }

    selectItem(item: ListItem) {
        if (this.selectedItem?.key !== item.key) {
            this.selectedItem = item;
            this.selectNewItem.emit(item.key);
        }
        this.closePopup();
    }

    onmouseenterItem(item: ListItem) {
        this.mouseenterItem.emit(item);
    }

    onmouseleaveItem(item: ListItem) {
        this.mouseleaveItem.emit(item);
    }

    onSearch() {
        this.filteredList = this.getFilteredList();
    }

    resetSearch() {
        this.search = null;
        this.filteredList = this.getFilteredList();
    }

    private getFilteredList(): ListItem[] {
        if (this.search?.length > 0) {
            return _.reduce(this.list, (res: ListItem[], listItem: ListItem) => {
                if (_.includes(listItem.value.toUpperCase(), this.search.toUpperCase()) ||
                    _.includes(listItem.key.toUpperCase(), this.search.toUpperCase())) {
                    res.push(listItem);
                }
                return res;
            }, []);
        }
        return this.list;
    }

}
