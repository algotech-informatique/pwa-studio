import { ListItem } from '../../dto/list-item.dto';
import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import { PopupContainerDto } from '../../dto/popup-container.dto';

@Component({
  selector: 'multi-select-element',
  templateUrl: './multi-select-element.component.html',
  styleUrls: ['./multi-select-element.component.scss'],
})
export class MultiSelectElementComponent implements OnChanges {

    @ViewChild('searchInput') searchInput: ElementRef;
    @ViewChild('container') container: ElementRef;
    @Input() title: string;
    @Input() subTitle: string;
    @Input() list: ListItem[];
    @Input() selectedKeys: string[];
    @Input() showSearch = true;
    @Output() selectNewItems = new EventEmitter<string[]>();

    selectedItems: ListItem[];
    showList: boolean;
    search: string | undefined;
    filteredList: ListItem[];
    multiSelectContainer: PopupContainerDto;
    popupMargin = 3;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selectedKeys) {
            this.selectedItems = _.filter(this.list, (item: ListItem) => _.includes(this.selectedKeys, item.key));
        }
        if (changes.list?.currentValue) {
            this.filteredList = this.getFilteredList();
        }
    }

    clickOnSelect(event: any) {
        event.stopPropagation();
        this.multiSelectContainer =  {
            top: this.container.nativeElement.offsetTop,
            height: this.container.nativeElement.offsetHeight,
            left: this.container.nativeElement.offsetLeft,
            containerClientRect: this.container.nativeElement.getBoundingClientRect(),
        };
        this.showList = !this.showList;
        this.changeDetectorRef.detectChanges();
        if (this.showList) {
            this.orderList();
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
        const index: number = _.findIndex(this.selectedItems, { key: item.key });
        if (index > -1) {
            this.selectedItems.splice(index, 1);
        } else {
            this.selectedItems.push(item);
        }
        this.selectNewItems.emit(this.selectedItems.map((selectedItem) => selectedItem.key));
        this.changeDetectorRef.detectChanges();
        const multiSelectContainer: PopupContainerDto = _.cloneDeep(this.multiSelectContainer);
        multiSelectContainer.height = this.container.nativeElement.offsetHeight;
        this.multiSelectContainer = multiSelectContainer;
    }

    onSearch() {
        this.filteredList = this.getFilteredList();
    }

    resetSearch() {
        this.search = undefined;
        this.filteredList = this.getFilteredList();
    }

    private getFilteredList(): ListItem[] {
        return _.reduce(this.list, (res: ListItem[], listItem: ListItem) => {
            if (!this.search || this.search?.length === 0 || _.includes(listItem.value, this.search) ||
                _.includes(listItem.key.toLowerCase(), this.search.toLowerCase())) {
                res.push(listItem);
            }
            return res;
        }, []);
    }

    private orderList() {
          const selectedItems: ListItem[] = _.filter(this.filteredList, (item: ListItem) => this.selectedKeys.includes(item.key));
          const unselectedItems: ListItem[] = _.filter(this.filteredList, (item: ListItem) => !this.selectedKeys.includes(item.key));
          this.filteredList = _.concat(selectedItems, unselectedItems);
    }
}
