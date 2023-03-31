import { SnPageDto, SnPageWidgetConditionDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { WidgetInput } from '../../../../../../app-custom/dto/widget-input.dto';
import { InputItem } from '../../../../../dto/input-item.dto';
import { DataSelectorResult } from '../../../../../dto/data-selector-result.dto';
import { ListItem } from '../../../../../dto/list-item.dto';
import { AppCustomService } from '../../../../../../app-custom/services';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'rule-condition',
    templateUrl: './rule-condition.component.html',
    styleUrls: ['./rule-condition.component.scss'],
})
export class RuleConditionComponent implements OnChanges {

    @Input() condition: SnPageWidgetConditionDto;
    @Input() conditions: SnPageWidgetConditionDto[];
    @Input() inputsData: Observable<WidgetInput[]>;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;

    @Output() conditionChanged = new EventEmitter<SnPageWidgetConditionDto>();
    @Output() conditionRemoved = new EventEmitter();
    @Output() moveEvent = new EventEmitter<'up' | 'down'>();

    inputPath: InputItem;
    firstInputValue: InputItem;
    secondInputValue: InputItem;
    inputType: string;
    inputMultiple: boolean;
    criteriasList: ListItem[];
    displayFirstValue = false;
    displaySecondValue = false;
    stringCriterias: ListItem[];
    numberCriterias: ListItem[];
    genericCriterias: ListItem[];
    arrayCriterias: ListItem[];

    constructor(
        private translate: TranslateService,
        private appCustomService: AppCustomService,
    ) {
        this.stringCriterias = [
            { key: 'startsWith', value: this.translate.instant('SN-FILTER.CRITERIA.STARTS-WITH') },
            { key: 'notStartsWith', value: this.translate.instant('SN-FILTER.CRITERIA.NOT-STARTS-WITH') },
            { key: 'endWith', value: this.translate.instant('SN-FILTER.CRITERIA.END-WITH') },
            { key: 'contains', value: this.translate.instant('SN-FILTER.CRITERIA.CONTAINS') },
        ];
        this.numberCriterias = [
            { key: 'gt', value: this.translate.instant('SN-FILTER.CRITERIA.MORE-THAN') },
            { key: 'lt', value: this.translate.instant('SN-FILTER.CRITERIA.LESS-THAN') },
            { key: 'gte', value: this.translate.instant('SN-FILTER.CRITERIA.MORE-THAN-EQUAL') },
            { key: 'lte', value: this.translate.instant('SN-FILTER.CRITERIA.LESS-THAN-EQUAL') },
            { key: 'between',value: this.translate.instant('SN-FILTER.CRITERIA.BETWEEN') },
        ];
        this.genericCriterias = [
            { key: 'equals', value: this.translate.instant('SN-FILTER.CRITERIA.EQUALS') },
            { key: 'different', value: this.translate.instant('SN-FILTER.CRITERIA.DIFFERENT') },
            { key: 'isNull',value: this.translate.instant('SN-FILTER.CRITERIA.IS-NULL') },
            { key: 'isNotNull',value: this.translate.instant('SN-FILTER.CRITERIA.IS-NOT-NULL') },
            { key: 'exists',value: this.translate.instant('SN-FILTER.CRITERIA.EXISTS') },
        ];
        this.arrayCriterias = [
            { key: 'isEmptyArray', value: this.translate.instant('SN-FILTER.CRITERIA.IS-EMPTY-ARRAY') },
            { key: 'isNotEmptyArray', value: this.translate.instant('SN-FILTER.CRITERIA.IS-NOT-EMPTY-ARRAY') },
        ];
    }

    ngOnChanges() {
        this.inputPath = {
            key: 'inputPath',
            value: this.condition.input,
            types: ['object', 'string', 'number', 'so:*', 'sys:user'],
            multiple: false,
            multiNoStrict: true,
        };

        if (this.condition.input) {
            const typeAndMultiple = this.appCustomService.getPathTypeAndMultiple(this.condition.input, this.page, this.widget);
            this.inputType = typeAndMultiple?.type;
            this.inputMultiple = typeAndMultiple?.multiple;
            this.loadCriteriasList();
        }
        this.displayValues();
    }

    onInputPathChanged(input: DataSelectorResult) {
        this.condition.input = input.path;
        if (this.inputType !== input.type || this.inputMultiple !== input.multiple) {
            this.condition.criteria = '';
            this.inputType = input.type;
            this.inputMultiple = input.multiple;
            this.resetConditionValue();
            this.loadCriteriasList();
            this.displayValues();
        }
        this.conditionChanged.emit(this.condition);
    }

    onSelectCriteria(criteria: string) {
        this.condition.criteria = criteria;
        this.displayValues();
        this.conditionChanged.emit(this.condition);
    }

    onInputFirstValueChanged(input: DataSelectorResult) {
        this.condition.value = this.condition.criteria !== 'between' ? input.path : [input.path, this.secondInputValue.value];
        this.conditionChanged.emit(this.condition);
    }

    onInputSecondValueChanged(input: DataSelectorResult) {
        if (this.condition.criteria === 'between') {
            this.condition.value = [this.firstInputValue.value, input.path];
            this.conditionChanged.emit(this.condition);
        }
    }

    removeCondition() {
        this.conditionRemoved.emit();
    }

    arrowMoveEvent(direction: 'up' | 'down') {
        this.moveEvent.emit(direction);
    }

    private loadCriteriasList() {
        switch (this.inputType) {
            case 'string':
                this.criteriasList = this.inputMultiple ?
                    this.renameMultipleCriterias(_.cloneDeep(this.stringCriterias.concat(this.genericCriterias))) :
                    _.cloneDeep(this.stringCriterias.concat(this.genericCriterias));
                break;
            case 'date':
            case 'time':
            case 'datetime':
            case 'number':
                this.criteriasList =
                    this.inputMultiple ? this.renameMultipleCriterias(_.cloneDeep(this.numberCriterias.concat(this.genericCriterias))) :
                    _.cloneDeep(this.numberCriterias.concat(this.genericCriterias));
                break;
            case 'boolean':
                this.criteriasList = this.inputMultiple ?
                    this.renameMultipleCriterias(_.cloneDeep(this.genericCriterias)) :
                    _.cloneDeep(this.genericCriterias);
                break;
            default:
                this.criteriasList = this.inputMultiple ?
                    this.renameObjectCriterias(
                        _.cloneDeep(this.stringCriterias.concat(this.numberCriterias, this.genericCriterias))
                    ).concat(_.cloneDeep(this.arrayCriterias)) :
                    this.renameObjectCriterias(
                        _.cloneDeep(this.stringCriterias.concat(this.numberCriterias, this.genericCriterias)));
        };
    }

    private renameMultipleCriterias(criterias: ListItem[]): ListItem[] {
        return criterias.map((criteria) => {
            if (criteria.key !== 'isNull' && criteria.key !== 'exists' && criteria.key !== 'isNotNull') {
                criteria.value = this.translate.instant('SN-FILTER.CRITERIA.FOR-MULTIPLE') + ' ' +
                    this.translate.instant(criteria.value).toLowerCase();
            }
            return criteria;
        });
    }

    private renameObjectCriterias(criterias: ListItem[]): ListItem[] {
        return criterias.map((criteria) => {
            if (criteria.key !== 'isNull' && criteria.key !== 'exists' && criteria.key !== 'isNotNull') {
                criteria.value = this.translate.instant('SN-FILTER.CRITERIA.FOR-OBJECT') + ' ' +
                    this.translate.instant(criteria.value).toLowerCase();;
            }
            return criteria;
        });
    }

    private displayValues() {
        this.displayFirstValue = !!this.condition.criteria
            && this.condition.criteria !== 'isNull'
            && this.condition.criteria !== 'isNotNull'
            && this.condition.criteria !=='exists'
            && this.condition.criteria !== 'isEmptyArray'
            && this.condition.criteria !== 'isNotEmptyArray';

        this.displaySecondValue = !!this.condition.criteria && this.condition.criteria === 'between';

        this.firstInputValue = {
            key: this.translate.instant('SN-FILTER.VALUE'),
            value: this.displaySecondValue ?
                Array.isArray(this.condition.value) ? this.condition.value?.[0] : this.condition.value :
                this.condition.value,
            types: this.inputType?.startsWith('so:') ? ['string'] : [this.inputType],
            multiple: false,
        };

        if (this.displaySecondValue) {
            this.secondInputValue = {
                key: this.translate.instant('SN-FILTER.VALUE'),
                value: this.condition.value?.[1],
                types: [this.inputType],
                multiple: false,
            };
        }
    }

    private resetConditionValue() {
        switch(this.inputType) {
            case 'string':
                this.condition.value = '';
                break;
            case 'number':
                this.condition.value = 0;
                break;
            case 'boolean':
                this.condition.value = false;
                break;
            default:
                this.condition.value = null;
                break;
        }
    }

}
