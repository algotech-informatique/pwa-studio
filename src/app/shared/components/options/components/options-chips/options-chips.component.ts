import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IconsService, ToastService } from '../../../../services';

@Component({
    selector: 'options-chips',
    styleUrls: ['./options-chips.component.scss'],
    templateUrl: './options-chips.component.html',
})
export class OptionsChipsComponent {

    @Input() items: string[];
    @Input() readOnly = false;
    @Input() label: string;
    @Input() type: 'mail' | 'text' | 'phone';
    @Input() includeBottomBorder = true;
    @Output() changeValue = new EventEmitter();

    inputValue = '';
    inputError = false;
    constructor(
        private toastService: ToastService,
        private translateService: TranslateService,
        private iconService: IconsService,
    ) {

    }

    removeItem(i) {
        this.items.splice(i, 1);
    }

    validateValue(value: string) {
        this.inputError = false;
        const val = value.trim();
        if (val === '') {
            return;
        }
        if (this.doValidate(val)) {
            this.items.push(val);
            this.changeValue.emit(this.items);
            this.inputValue = '';
        } else {
            this.toastService.addToast('error', '', this.translateService.instant('OPTIONS.CHIPS.ERROR-FORMAT', {'type': this.type}), 1500);
            this.inputError = true;
        }
    }

    doValidate(value) {
        switch (this.type) {
            case 'mail':
                return this.validateEmail(value);
            case 'phone':
                return this.validatePhone(value);
            default:
                return true;
        }
    }

    validateEmail(email: string) { // Validates the email address
        const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regexp.test(email);
    }

    validatePhone(phone) {
        const phoneRegex = /^(\+91-|\+91|0)?\d{10}$/;
        return phoneRegex.test(phone);
    }

    getObjectIcon(type: string) {
        return this.iconService.getSnModelIcon(type);
    }
}

