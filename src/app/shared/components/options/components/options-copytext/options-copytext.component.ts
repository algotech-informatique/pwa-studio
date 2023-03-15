import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../services';

@Component({
    selector: 'options-copytext',
    styleUrls: ['./options-copytext.component.scss'],
    templateUrl: './options-copytext.component.html',
})
export class OptionsCopyTextComponent {

    @Input() copyText = '';
    @Input() label = '';
    @Input() includeBottomBorder = false;
    @Input() readOnly = false;
    @Input() multiline = false;

    constructor(
        private toastService: ToastService,
        private translateService: TranslateService,
    ) {

    }

    notify(event) {
        this.toastService.addToast('info', '', this.translateService.instant('TOAST-MESSAGE.COPY-CLIPBOARD'), 2000);
    }
}
