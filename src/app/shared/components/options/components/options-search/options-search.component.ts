import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'options-search',
    templateUrl: './options-search.component.html',
    styleUrls: ['./options-search.component.scss'],
})
export class OptionsSearchComponent implements AfterViewInit {

    @ViewChild('searchInput') searchInput: ElementRef;
    @Input() placeHolder = 'SEARCHBOX.PLACEHOLDER';
    @Input() autofocus = false;

    _search = '';
    @Input()
    get search() {
        return this._search;
    }
    @Output() searchChange = new EventEmitter();
    set search(data) {
        this._search = data;
        this.searchChange.emit(data);
    }
    @Output() searchValue = new EventEmitter();

    constructor() { }

    ngAfterViewInit() {
        if (this.autofocus && this.searchInput) {
            this.searchInput.nativeElement.focus();
        }
    }

    onSearch() {
        this.searchValue.emit(this.search);
    }

    resetSearch(event: any) {
        this.search = '';
        event.stopPropagation();
        this.searchValue.emit(this.search);
    }

}
