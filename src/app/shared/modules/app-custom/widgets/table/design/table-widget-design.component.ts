import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { AppSelectionService, PageWidgetService } from '../../../../app/services';
import { StyleInterface } from '../../../models/design-style.interface';
import { WidgetParametersInterface } from '../../../models/widget-parameters.interface';

@Component({
    selector: 'table-widget-design',
    templateUrl: './table-widget-design.component.html',
    styleUrls: ['./table-widget-design.component.scss'],
})
export class TableWidgetDesignComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    snApp: SnAppDto;
    page: SnPageDto;
    widget: SnPageWidgetDto;
    styles: StyleInterface[] = [];

    constructor(
        public appSelection: AppSelectionService,
        private widgetService: PageWidgetService,
    ) { }

    initialize() {
        this.styles = this.widgetService.loadStylesWidget([this.widget]);
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

    onHeaderBorderBottomChanged(showBorderBottom: boolean) {
        this.onChanged({path: 'border-bottom-width', value: (showBorderBottom ? 2 : 0) + 'px'}, 'header');
    }

    onBorderChanged(showBorder: boolean, styleKey: string) {
        this.onChanged({path: 'border-width', value: (showBorder ? 1 : 0) + 'px'}, styleKey);
    }

    onColumnWidthChanged(columnWidth: number) {
        this.widget.group?.widgets.map(column => {
            if (column.box.width === +this.widget.css?.column?.width?.slice(0, -2)) {
                column.box.width = columnWidth;
            }
            return column;
        });
        this.onChanged({path: 'width', value: columnWidth + 'px'}, 'column');
        this.changed.emit();
    }

}
