import { Component } from '@angular/core';
import * as _ from 'lodash';

export class Toast {
    uuid: string;
    type: 'error' | 'warning' | 'success' | 'info';
    title: string;
    message: string;
}

@Component({
    selector: 'toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {

    ref;
    toast: Toast;
    eventEmitter;

    constructor() { }

    close() {
        this.eventEmitter({
            event: 'destroy',
            ref: this.ref
        });
    }

}
