import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'base-pop-up',
    templateUrl: './base-pop-up.component.html',
    styleUrls: ['./base-pop-up.component.scss'],
})
export class BasePopUpComponent implements OnInit {

    @Input()
    title;

    @Output()
    closePopUp = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    crossClicked() {
        this.closePopUp.emit();
    }

}
