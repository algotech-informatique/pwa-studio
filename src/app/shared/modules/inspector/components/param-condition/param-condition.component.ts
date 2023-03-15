import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PairDto, SmartModelDto } from '@algotech/core';
import { ParamConditionsDto } from '../../dto/param-conditions.dto';
import { IconsService } from '../../../../services';
import { ListItem } from '../../dto/list-item.dto';
import { TranslateLangDtoService } from '@algotech/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'param-condition',
    templateUrl: './param-condition.component.html',
    styleUrls: ['./param-condition.component.scss'],
})
export class LauchParamConditionComponent implements OnChanges {

    @Input() smartmodel: SmartModelDto | SmartModelDto[];
    @Input() conditions: ParamConditionsDto;
    @Output() changed = new EventEmitter();

    types: string[];
    listProperties: ListItem[];
    icons: string[] = [];
    addedIndex: number;

    modeList: ListItem[] = [{
        key: 'visible',
        value: this.translateService.instant('INSPECTOR.PARAM.CONDITION-VISIBLE'),
    }, {
        key: 'enabled',
        value: this.translateService.instant('INSPECTOR.PARAM.CONDITION-ENABLED'),
    }];

    operatorList: ListItem[] = [{
        key: 'and',
        value: this.translateService.instant('INSPECTOR.PARAM.CONDITION-OPERATOR-AND'),
    }, {
        key: 'or',
        value: this.translateService.instant('INSPECTOR.PARAM.CONDITION-OPERATOR-OR'),
    }];

    constructor(
        private iconsService: IconsService,
        private translateLangDtoService: TranslateLangDtoService,
        private translateService: TranslateService,
    ) { }

    ngOnChanges() {
        this.smartmodel = Array.isArray(this.smartmodel) ? this.smartmodel[0] : this.smartmodel;
        this.types = this.conditions?.list?.map((condition, index) => {
            const property = (this.smartmodel as SmartModelDto).properties.find((prop) => prop.key === condition.field);
            this.icons[index] = this.iconsService.getIconByType(property?.keyType)?.value;
            return property?.keyType;
        });
        this.listProperties = this.setListProperties();
    }

    onUpdateMode(event: 'enabled' | 'visible') {
        this.conditions.mode = event;
        this.emitData(this.conditions);
    }

    onUpdateOperator(event: 'and' | 'or') {
        this.conditions.operator = event;
        this.emitData(this.conditions);
    }

    emitData(data: ParamConditionsDto) {
        const emitData: PairDto = {
            key: 'condition',
            value: data
        };
        this.changed.emit(emitData);
    }

    eraseCondition(index: number) {
        this.conditions.list.splice(index, 1);
        this.emitData(this.conditions);
    }

    addCondition() {
        if (!this.conditions) {
            this.conditions = {
                list: [],
                mode: 'enabled',
                operator: 'and'
            };
            this.listProperties = [];
        }
        this.conditions.list.push({
            model: (this.smartmodel as SmartModelDto).key,
            field: '',
            value: null,
        });
        this.addedIndex = this.conditions.list.length - 1;
        this.emitData(this.conditions);
    }

    onSelectProperty(event: string, index: number) {
        this.conditions.list[index].field = event;
        const property = (this.smartmodel as SmartModelDto).properties.find((prop) => prop.key === event);
        if (this.types[index] !== property?.keyType) {
            this.conditions.list[index].value = null;
        }
        this.icons[index] = this.iconsService.getIconByType(property?.keyType)?.value;
        this.types[index] = property?.keyType;
        this.emitData(this.conditions);
    }

    onChangeValue(event: PairDto, index: number) {
        this.conditions.list[index].value = event.value;
        this.emitData(this.conditions);
    }

    private setListProperties(): ListItem[] {
        return (this.smartmodel as SmartModelDto).properties.reduce((res: ListItem[], property) => {
            if (['string', 'boolean', 'number'].indexOf(property.keyType) > -1) {
                res.push({
                    key: property.key,
                    value: this.translateLangDtoService.transform(property.displayName),
                    icon: this.iconsService.getIconByType(property.keyType)?.value,
                    color: this.iconsService.getIconColor(property.keyType)
                });
            }
            return res;
        }, []);
    }

}
