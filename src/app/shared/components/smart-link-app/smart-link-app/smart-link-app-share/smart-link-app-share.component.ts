import { EMailDto } from '@algotech/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-smart-link-app-share',
  templateUrl: './smart-link-app-share.component.html',
  styleUrls: ['./smart-link-app-share.component.scss'],
})
export class SmartLinkAppShareComponent {

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
