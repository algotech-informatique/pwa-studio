import { TranslateLangDtoService } from '@algotech-ce/angular';
import { SmartModelDto, SmartPropertyModelDto, SnPageBoxDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { SessionsService } from '../../../../../services';
import { PageWidgetService } from '../../../../app/services';

@Injectable()
export class WidgetTableService {

    constructor(
        private pageWidget: PageWidgetService,
        private sessionService: SessionsService,
        private translateLangDto: TranslateLangDtoService,
    ) { }

    setDefaultColumns(table: SnPageWidgetDto, model: SmartModelDto) {
        const properties = model.properties?.slice(0, 5);
        const columnWidgets = properties.map((property) => {
            const col = this.createColumn(table, property);
            col.locked = table.locked;
            return col;
        });
        table.group = this.pageWidget.buildGroup(columnWidgets);
        table.custom.columns = properties.map(prop => prop.key);
    }

    createColumn(table: SnPageWidgetDto, property: SmartPropertyModelDto): SnPageWidgetDto {
        const box: SnPageBoxDto = {
            x: 0,
            y: 0,
            height: table?.box?.height,
            width: +table?.css?.column?.width?.slice(0, -2),
        };
        const columnWidget = this.pageWidget.buildWidget('column', box, this.sessionService.active.datas.read.customer.languages);

        columnWidget.name = this.translateLangDto.transform(property.displayName);
        columnWidget.custom.propertyKey = property.key;
        columnWidget.custom.propertyType = property.keyType;
        columnWidget.custom.value = `{{current-list.item.${property.key}}}`;
        columnWidget.custom.filter = table.custom.filter;
        columnWidget.custom.resize = table.custom.resize;
        columnWidget.custom.sort = table.custom.sort;

        if (property.keyType.startsWith('so:')) {
            columnWidget.custom.format = ['primary', 'secondary'];
        } else {
            columnWidget.custom.format = { key: '', custom: undefined };

            switch (property.keyType) {
                case 'boolean':
                    columnWidget.custom.format.key = 'trueFalse';
                    break;
                case 'number':
                    columnWidget.custom.format.key = 'decimal';
                    break;
                case 'date':
                    columnWidget.custom.format.key = 'L';
                    break;
                case 'datetime':
                    columnWidget.custom.format.key = 'L LT';
                    break;
                case 'time':
                    columnWidget.custom.format.key = 'LT';
                    break;
            }
        }

        return columnWidget;
    }

    removeColumn(table: SnPageWidgetDto, keyRemove: string) {
        if (table.group?.widgets) {
            const indexToRemove = table.group.widgets.findIndex(widget => widget.custom.propertyKey === keyRemove);
            table.group.widgets.splice(indexToRemove, 1);
        }
    }

}

