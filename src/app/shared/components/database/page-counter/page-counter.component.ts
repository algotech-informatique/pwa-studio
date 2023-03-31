import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
    selector: 'app-data-base-page-counter',
    templateUrl: './page-counter.component.html',
    styleUrls: ['./page-counter.component.scss'],
})
export class AppDataBasePageCounterComponent implements OnChanges {

    @Input() skip: number;
    @Input() lastPage: number;
    @Input() soCount: number;

    @Output() skipChange = new EventEmitter<number>();

    pages: number[] = [];

    constructor() { }

    ngOnChanges() {
        this.pages = this.lastPage === 0 ? [0] :
            Array.from({length: this.lastPage}, (_, i) => i + 1);
    }

    onChange(event) {
        this.skipChange.emit(Number(event.target.value)- 1);
    }
}
