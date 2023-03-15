import { Component, Input, EventEmitter } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'store-publish-popover',
    templateUrl: './store-publish-popover.component.html',
    styleUrls: ['./store-publish-popover.component.scss'],
})
export class StorePublishPopoverComponent {

    @Input() response = new EventEmitter<boolean>();
    @Input() isQuery: boolean;
    @Input() message: string;

    constructor() { }

    SendResponse(accept: boolean) {
        this.response.emit(accept);
    }

}
