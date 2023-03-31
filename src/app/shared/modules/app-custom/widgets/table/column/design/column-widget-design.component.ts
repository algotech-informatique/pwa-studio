import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { AppSelectionService, PageUtilsService, PageWidgetService } from '../../../../../app/services';
import { StyleInterface } from '../../../../models/design-style.interface';
import { WidgetParametersInterface } from '../../../../models/widget-parameters.interface';

@Component({
    selector: 'column-widget-design',
    templateUrl: './column-widget-design.component.html',
    styleUrls: ['./column-widget-design.component.scss'],
})
export class ColumnWidgetDesignComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    snApp: SnAppDto;
    page: SnPageDto;
    widget: SnPageWidgetDto;
    tableContainer: SnPageWidgetDto;
    styles: StyleInterface[] = [];

    constructor(
        public appSelection: AppSelectionService,
        private pageUtilsService: PageUtilsService,
        private widgetService: PageWidgetService,
    ) { }

    initialize() {
        this.tableContainer = this.pageUtilsService.getParent(this.snApp, this.widget) as SnPageWidgetDto;
        this.styles = this.widgetService.loadStylesWidget([this.widget]);
    }

    onWidgetWidthChanged(width: number) {
        this.widget.box.width = width;
        this.changed.emit();
    }

    onChanged(value: { path: string; value: any }, styleKey: string) {
        const style = this.styles.find((s) => s.style === styleKey);
        if (!style) { return; }
        for (const element of style.elements) {
            element.ref.css = this.widgetService.buildCss([{
                style: style.style,
                path: `${element.path}.${value.path}`,
                value: value.value
            }], element.ref.css);
            this.widgetService.updateRule(element.widget as SnPageWidgetDto);
        }
        this.styles = this.widgetService.loadStylesWidget([this.widget]);
        this.changed.emit();
    }

    onOverloadStyleChanged(overloadStyle: boolean) {
        this.widget.custom.overloadStyle = overloadStyle;
        this.changed.emit();
    }

}
