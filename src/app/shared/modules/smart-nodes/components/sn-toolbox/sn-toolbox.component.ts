import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SnToolbox } from '../../dto';

@Component({
    selector: 'sn-toolbox',
    styleUrls: ['./sn-toolbox.component.scss'],
    templateUrl: './sn-toolbox.component.html',
})
export class SnToolboxComponent {

    @Input() tools = [];
    @Input() direction = 'column';
    @Output() launchEvent = new EventEmitter();

    constructor() {
    }

    onLaunchEvent(event: SnToolbox) {
        if (event.type === 'direct') {
            event.onClick(event);
        } else {
            this.launchEvent.emit(event);
        }
    }
}
