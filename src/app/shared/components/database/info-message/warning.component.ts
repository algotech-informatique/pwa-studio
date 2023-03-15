import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
    selector: 'app-data-base-warning',
    templateUrl: './warning.component.html',
    styleUrls: ['./warning.component.scss']
})

export class AppDataBaseWarningComponent {
    @Input() message: string;
    @Input() action: string;
    @Output() validate = new EventEmitter<boolean>();
    constructor() { }

    onValidate(ok: boolean) {
        this.validate.emit(ok);
    }
}
