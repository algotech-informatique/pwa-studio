import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CheckOptionsDto, CheckEvent } from '../../dtos';
import * as _ from 'lodash';
@Component({
    selector: 'app-check-settings',
    templateUrl: './check-settings.component.html',
    styleUrls: ['./check-settings.component.scss']
})

export class CheckSettingsComponent implements OnChanges {
    @Input() checkOnDesign: boolean;
    @Input() openDebug: string[];
    @Output() updated = new EventEmitter<CheckOptionsDto>();

    options: { key: CheckEvent, openDebug: boolean, check: boolean }[] = [{
        key: 'onDesign',
        openDebug: true,
        check: true,
    }, {
        key: 'onCheck',
        openDebug: true,
        check: true,
    }, {
        key: 'onPublish',
        openDebug: true,
        check: true,
    }];

    constructor() { }


    ngOnChanges() {
        this.options.forEach((option) => {
            option.openDebug = this.openDebug.findIndex((opt) => opt === option.key) !== -1;
            if (option.key === 'onDesign') {
                option.check = this.checkOnDesign;
            }
        });
    }

    updateOpenDebug(option) {
        option.openDebug = !option.openDebug;
        this.updateOptions();
    }

    updateCheck(option) {
        if (option.key === 'onDesign') {
            option.check = !option.check;
            this.updateOptions();
        }
    }

    updateOptions() {
        this.updated.emit({
            checkOnDesign: this.options[0].check, openDebug: _.reduce(this.options, (result, opt) => {
                if (opt.openDebug) {
                    result.push(opt.key);
                }
                return result;
            }, [])
        })
    }
}
