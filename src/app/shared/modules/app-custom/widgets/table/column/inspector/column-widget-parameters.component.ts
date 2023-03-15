import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Output } from '@angular/core';
import moment from 'moment';
import { PageUtilsService } from '../../../../../app/services';
import { ListItem } from '../../../../../inspector/dto/list-item.dto';
import { WidgetParametersInterface } from '../../../../models/widget-parameters.interface';
import { AppCustomService } from '../../../../services';
import { getMockType } from '../../data/table-mock-data';
import * as _ from 'lodash';
import { TranslateLangDtoService } from '@algotech/angular';

@Component({
selector: 'column-widget-parameters',
templateUrl: './column-widget-parameters.component.html',
styleUrls: ['./column-widget-parameters.component.scss'],
})
export class ColumnWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    widget: SnPageWidgetDto;

    snApp: SnAppDto;
    page: SnPageDto;
    propertyKeyType: string | undefined;
    numberFormats: ListItem[];
    dateFormats: ListItem[];
    booleanFormats: ListItem[];
    soFormats: ListItem[];
    formats: ListItem[];
    isDateType: boolean;
    isSoType: boolean;
    showCustomFormat = false;
    parentTable: SnPageWidgetDto;

    typesHideFormatOptions = ['string', 'sys:comment', 'html'];
    customFormats = ['custom', 'icons', 'monetary'];

    dateFormat: ListItem = { key: 'L', value: moment().format('L') };
    dateTimeSecondsFormat: ListItem = { key: 'L LTS', value: moment().format('L LTS') };
    dateTimeFormat: ListItem = { key: 'L LT', value: moment().format('L LT') };
    timeSecondsFormat: ListItem = { key: 'LTS', value: moment().format('LTS') };
    timeFormat: ListItem = { key: 'LT', value: moment().format('LT') };

    constructor(
        private pageUtilsService: PageUtilsService,
        private appCustomService: AppCustomService,
        private translateLangDtoService: TranslateLangDtoService,
    ) {
        this.numberFormats = [
            { key: 'automatic', value: 'FORMAT.NUMBER.AUTOMATIC' },
            { key: 'decimal', value: 'FORMAT.NUMBER.DECIMAL' },
            { key: 'scientific', value: 'FORMAT.NUMBER.SCIENTIFIC' },
            { key: 'percentage', value: 'FORMAT.NUMBER.PERCENTAGE' },
            { key: 'monetary', value: 'FORMAT.NUMBER.MONETARY' },
        ];

        this.dateFormats = [
            { key: 'custom', value: 'FORMAT.CUSTOM' },
        ];

        this.booleanFormats = [
            { key: 'switch', value: 'FORMAT.BOOLEAN.SWITCH' },
            { key: 'checkbox', value: 'FORMAT.BOOLEAN.CHECKBOX' },
            { key: 'trueFalse', value: 'FORMAT.BOOLEAN.TRUEFALSE' },
            { key: 'icons', value: 'FORMAT.BOOLEAN.ICONS' },
        ];
    }

    initialize() {
        this.parentTable = this.pageUtilsService.getParent(this.snApp, this.widget) as SnPageWidgetDto;
        const model = this.appCustomService.getModel(this.parentTable?.custom?.collectionType);
        this.propertyKeyType = !model ?
            getMockType(this.widget.custom.propertyKey) :
            model.properties.find(prop => prop.key === this.widget.custom.propertyKey)?.keyType;
        if (!this.propertyKeyType) { return; }

        this.isSoType = this.propertyKeyType.startsWith('so:');
        this.checkIfShowCustomFormat();
        this.isDateType = false;
        if (this.typesHideFormatOptions.includes(this.propertyKeyType)) { return; }

        switch (this.propertyKeyType) {
            case 'date':
            case 'datetime':
            case 'time':
                this.setDateFormats();
                this.formats = this.dateFormats;
                break;
            case 'number':
                this.formats = this.numberFormats;
                break;
            case 'boolean':
                this.formats = this.booleanFormats;
                break;
            default:
                if (this.isSoType) {
                    this.setSoFormats();
                    this.formats = this.soFormats;
                }
                break;
        }
    }

    onIconChanged(icon: string) {
        this.widget.custom.icon = icon;
        const display: string[] = icon ? ['icon'] : [];
        if (this.widget.custom.display.includes('text')) {
            display.push('text');
        }
        this.widget.custom.display = display;
        this.changed.emit();
    }

    onResizeChanged(resize: boolean) {
        this.widget.custom.resize = resize;
        this.changed.emit();
    }

    onSortChanged(sort: boolean) {
        this.widget.custom.sort = sort;
        this.changed.emit();
    }

    onFilterChanged(filter: boolean) {
        this.widget.custom.filter = filter;
        this.changed.emit();
    }

    onFormatChanged(format: any) {
        this.widget.custom.format = _.cloneDeep(format);
        this.changed.emit();
    }

    onDisplayTextChanged(displayText: boolean) {
        const display: string[] = displayText ? ['text'] : [];
        if (this.widget.custom.display.includes('icon')) {
            display.push('icon');
        }
        this.widget.custom.display = display;
        this.changed.emit();
    }

    onChangedFormatKeys(formatKey: string) {
        this.widget.custom.format.key = formatKey;
        this.checkIfShowCustomFormat();
        this.onFormatChanged(this.widget.custom.format);
    }

    onChangeColumns(columns: string[]) {
        this.widget.custom.format = columns;
        this.checkIfShowCustomFormat();
        this.onFormatChanged(this.widget.custom.format);
    }

    onLineBreakChanged(lineBreak: boolean) {
        this.widget.custom.lineBreak = lineBreak;
        this.changed.emit();
    }

    checkIfShowCustomFormat() {
        this.showCustomFormat = !this.isSoType && this.customFormats.includes(this.widget.custom.format.key);
    }

    onCustomChanged(custom: string, type: string) {
        switch (this.propertyKeyType) {
            case 'number':
            case 'date':
            case 'datetime':
            case 'time':
                this.widget.custom.format.custom = custom;
                break;
            case 'boolean':
                this.widget.custom.format.custom = this.widget.custom.format.custom || {};
                this.widget.custom.format.custom[type] = custom;
                break;
        }
        this.onFormatChanged(this.widget.custom.format);
    }

    private setDateFormats() {
        this.isDateType = true;
        switch (this.propertyKeyType) {
            case 'date':
                this.dateFormats.unshift(this.dateFormat);
                break;
            case 'datetime':
                this.dateFormats.unshift(this.timeFormat);
                this.dateFormats.unshift(this.timeSecondsFormat);
                this.dateFormats.unshift(this.dateFormat);
                this.dateFormats.unshift(this.dateTimeFormat);
                this.dateFormats.unshift(this.dateTimeSecondsFormat);
                break;
            case 'time':
                this.dateFormats.unshift(this.timeFormat);
                this.dateFormats.unshift(this.timeSecondsFormat);
                break;
        }
    }

    private setSoFormats() {
        const model = this.appCustomService.getModel(this.widget.custom.propertyType);
        this.soFormats = model?.properties.map(prop =>
            ({ key: prop.key, value: this.translateLangDtoService.transform(prop.displayName) })
        ) || [];
    }

}
