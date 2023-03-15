import { Component, EventEmitter, ViewChild, Output, Input, AfterViewInit, OnChanges, ChangeDetectorRef, OnInit, ElementRef } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { SnParam, SnView, SnNode, SnSection } from '../../../../smart-nodes/models';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SnUtilsService } from '../../../../smart-nodes/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'sn-select-key-value',
    templateUrl: './sn-select-key-value.component.html',
    styleUrls: ['./sn-select-key-value.component.scss']
})
export class SnSelectKeyValueComponent implements AfterViewInit, OnChanges, OnInit {

    @ViewChild('inputKey') input: ElementRef;

    _top: any = null;

    @Input() direction: 'in' | 'out' = 'in';
    @Input() snView: SnView;
    @Input() node: SnNode;
    @Input() showMultiple = false;
    @Input() showTypes = true;
    @Input() customFastList: string[] = [];
    @Input() placeHolder = 'SN-NEW-PARAMETER-KEY';
    @Input() predefinedList: string[] = [];
    @Input() section: SnSection;

    @Input()
    get top() {
        return this._top;
    }

    @Output() topChange = new EventEmitter();
    set top(data) {
        this._top = data;
        this.topChange.emit(data);
    }

    @Output() addParam = new EventEmitter<any>();

    fastTypes = ['string', 'boolean', 'datetime', 'date', 'time', 'number', 'object'];
    multiple = false;
    listTypes: string[] = [];
    reactiveForm;
    reactiveSubmitted = false;
    key = '';
    selectedType = '';
    disabled = true;
    predefined;
    predefinedListDisplay: string[];

    errorMessage = '';
    errorMessages = {
        key: {
            required: this.translateService.instant('SN-SELECT-PARAM-KEY-REQUIRED'),
            minlength: this.translateService.instant('SN-SELECT-PARAM-KEY-LEAST-3'),
            keyExists: this.translateService.instant('SN-SELECT-PARAM-KEY-EXISTS'),
        },
        selectedType: {
            required: this.translateService.instant('SN-SELECT-PARAM-TYPE-REQUIRED'),
        }
    };

    constructor(
        public fb: FormBuilder,
        private snUtils: SnUtilsService,
        private translateService: TranslateService,
        private ref: ChangeDetectorRef,
    ) {
        this.reactiveForm = this.fb.group({
            key: ['', [Validators.required, Validators.minLength(3)]],
            selectedType: ['string', Validators.required],
            multiple: [false]
        });
        this.reactiveForm.setValidators(this.validateKey());
    }

    ngOnChanges() {
        this.predefined = this.predefinedList.length > 0;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.input) {
                this.input.nativeElement.focus();
            }
        }, 400);
    }

    ngOnInit() {
        this.listTypes = _.map(this.fastTypes, (type: string) => ({
            key: type,
            value: type
        }));
        if (this.customFastList.length !== 0) {
            this.listTypes.push(
                ..._.map(this.customFastList, (option: string) => ({
                    key: option,
                    value: option,
                })),
            );
        }
    }

    validate() {
        this.predefinedListDisplay = [];
        this.reactiveSubmitted = true;
        if (this.validateForm()) {
            const param: SnParam = {
                id: UUID.UUID(),
                direction: this.direction,
                key: this.reactiveForm.get('key').value,
                toward: undefined,
                types: !this.showTypes ? 'string' : this.reactiveForm.get('selectedType').value,
                multiple: !this.showMultiple ? false : this.reactiveForm.get('multiple').value,
                pluggable: true,
                displayState: {},
                display: 'input',
            };
            this.top = null;
            this.addParam.emit(param);
        }
    }

    onKeyEnter() {
        if (!this.disabled) {
            this.validate();
        }
    }

    validateForm(): boolean {
        return (this.reactiveForm.get('key').value !== ''
            && !this.keyExists(this.reactiveForm.get('key').value)
            && this.reactiveForm.get('selectedType').value !== ''
        );
    }

    keyExists(key: string): boolean {
        const val = this.section ? this.section.params.find((p) => p.key?.toUpperCase() === key.toUpperCase()) :
        this.snUtils.getParamByKey(key, this.node, false);
        if (val) {
            return true;
        } else {
            return false;
        }
    }

    validateKey(): ValidationErrors {
        this.errorMessage = '';
        return (group: FormGroup): ValidationErrors => {
            const ctrl1 = group.controls.key;

            if (ctrl1.value === '')  {
                this.errorMessage = this.errorMessages.key.required;
                ctrl1.setErrors({ required: true });
                this.disabled = true;
                return {};
            };
            const val = this.keyExists(ctrl1.value);
            if (val) {
                this.errorMessage = this.errorMessages.key.keyExists;
                ctrl1.setErrors({ keyExists: true });
                this.disabled = true;
            } else {
                this.errorMessage = '';
                this.disabled = false;
                ctrl1.setErrors(null);
            }
            return {};
        };
    }

    filterPrededfinedList() {
        setTimeout(() => {
            if (this.predefinedList.length > 0) {
                this.predefinedListDisplay = _.reduce(this.predefinedList, (res: string[], item: string) => {
                    if (_.includes(_.lowerCase(item), _.lowerCase(this.reactiveForm.get('key').value)) && res.length <= 2) {
                        res.push(item);
                    }
                    return res;
                }, []);

                this.ref.detectChanges();
            }
        }, 400);
    }

    selectPredictiveItem(item: string) {
        this.reactiveForm.get('key').setValue(item);
        this.predefinedListDisplay = [];
    }

    closePredictiveList() {
        this.predefinedListDisplay = [];
    }

}
