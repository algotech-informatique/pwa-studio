import { EnvService } from '@algotech/angular';
import { SnAppDto, SnPageWidgetDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import { AppContextmenuActionExtension, WidgetTypeDto } from '../../../app/dto';
import { AppActionsService, AppContextmenuService, AppSelectionService, PageWidgetService } from '../../../app/services';
import * as _ from 'lodash';
import { ReportsUtilsService } from '@algotech/business';
import { PatchesService, SessionsService } from '../../../../services';
import { templatesLibrary } from '../../widgets/templates/templates';
import { allTypes } from '../../widgets/_data/data';

@Injectable()
export class AppExportTemplateService {
    private exportTemplate = false;

    constructor(
        private env: EnvService,
        private appSelection: AppSelectionService,
        private pageWidget: PageWidgetService,
        private reportUtils: ReportsUtilsService,
        private appActions: AppActionsService,
        private patchesService: PatchesService,
        private session: SessionsService) {
        this.env.environment.subscribe((e) => {
            this.exportTemplate = !!e.EXPORT_TEMPLATE;
        });
    }

    objToString(obj, ndeep?) {
        if (obj == null) { return String(obj); }
        switch (typeof obj) {
            case 'string': return '\'' + (obj.includes('\'') ? obj.replace(/'/g, '\\\'') : obj) + '\'';
            case 'function': return obj.name || obj.toString();
            case 'object':
                const indent = Array(ndeep || 1).join('\t');
                const isArray = Array.isArray(obj);

                return '{['[+isArray] + Object.keys(obj).map((key) =>
                    '\n\t' + indent + (isArray ? '' : (key.includes('-') ? `'${key}'`
                        : key) + ': ') + this.objToString(obj[key], (ndeep || 1) + 1)
                ).join(',') + '\n' + indent + '}]'[+isArray];
            default: return obj.toString();
        }
    }

    extendedContextMenu(snApp: SnAppDto): AppContextmenuActionExtension[] {
        if (!this.exportTemplate) {
            return [];
        }

        const types: WidgetTypeDto[] = _.difference(
            allTypes.filter((t) => !t.strictParents).map((t) => t.typeKey),
            _.uniq(
                _.flatMap(
                    _.flatMap(templatesLibrary, 'subCategories'),
                    'widgets'
                ).map((widget: SnPageWidgetDto) => widget.typeKey)
            ),
        ).map((t: string) => allTypes.find((type) => type.typeKey === t));

        const addWidgets: AppContextmenuActionExtension[] = types.map((type) => ({
            filter: () => this.appSelection.selections.pages.length === 1,
            onClick: (e) => {
                const page = this.appSelection.selections.pages[0];
                const widget = this.pageWidget.buildWidget(type.typeKey, {
                    x: e.x - page.canvas.x,
                    y: e.y - page.canvas.y,
                    width: type.defaultWidth ? type.defaultWidth : type.minWidth,
                    height: type.defaultHeight ? type.defaultHeight : type.minHeight,
                }, this.session.active.datas.read.customer.languages);

                page.widgets.push(widget);
                this.appActions.notifyUpdate(snApp);
            },
            title: 'SN-CONTEXTMENU.SCHEMA.ADD-WIDGET',
            content: type.typeKey
        }));

        const exportTemplate: AppContextmenuActionExtension = {
            filter: () => this.appSelection.selections.widgets.length === 1,
            onClick: () => {
                const widget: SnPageWidgetDto = this.patchesService.removeDisplayState(
                    _.cloneDeep(this.appSelection.selections.widgets[0])
                );
                widget.box.x = 0;
                widget.box.y = 0;

                const widgetName = widget.name[0].toLowerCase() + widget.name.slice(1);
                const fileName = Array.from(widgetName).reduce((result, char) => {
                    if (char.toUpperCase() === char) {
                        result += `-${char.toLocaleLowerCase()}`;
                    } else {
                        result += char;
                    }
                    return result;
                }, '') + '.ts';

                const fileContent =
                    `
import { SnPageWidgetDto } from '@algotech/core';
export const ${widgetName}: SnPageWidgetDto = ${this.objToString(widget)};
`;

                this.reportUtils.createTextFile(fileName, fileContent, '.ts', true);
            },
            title: 'SN-CONTEXTMENU.SCHEMA.EXPORT-TEMPLATE',
            icon: 'fa-solid fa-clipboard',
        };

        return [
            ...addWidgets,
            exportTemplate,
        ];
    }
}
