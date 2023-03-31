import { EMailDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'smart-link-share',
    templateUrl: './smart-link-share.component.html',
    styleUrls: ['./smart-link-share.component.scss'],
})
export class SmartLinkShareComponent {

    @Input() eMail: EMailDto;
    @Output() updateMail = new EventEmitter<EMailDto>();

    constructor() { }

    onUpdateContent(value) {
        this.eMail.content = value;
        this.updateMail.emit(this.eMail);
    }

    onChangeChips(values) {
        this.eMail.to = _.cloneDeep(values);
        this.updateMail.emit(this.eMail);
    }

}
