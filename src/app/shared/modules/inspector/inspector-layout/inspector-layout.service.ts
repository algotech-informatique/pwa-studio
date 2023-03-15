import { TranslateLangDtoService } from '@algotech/angular';
import { SnLang } from '@algotech/business/src/lib/app/models';
import { LangDto, PairDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import { IconsService } from 'src/app/shared/services';
import { SnNode, SnParam, SnSelectionEvent, SnSelectionType, SnUtilsService, SnView } from '../../smart-nodes';
import { InspectorBarButton } from '../dto/inspector-bar-button.dto';

@Injectable()
export class InspectorLayoutService {

    nodeChildTypes: SnSelectionType[] = ['param', 'flow'];
    elementTypes: SnSelectionType[] = ['group', 'box', 'link'];

    constructor(
        private translateLangDtoService: TranslateLangDtoService,
        private snUtilsService: SnUtilsService,
        private iconsService: IconsService,
    ) { }

    contextIsWithoutName(context: SnSelectionEvent): boolean {
        const concernedTypes = ['flow', 'box', 'group'];
        if (concernedTypes.indexOf(context.type) > -1 && Array.isArray(context.element?.displayName)) {
            const name: LangDto = context.element?.displayName?.find((l: LangDto) => l.lang === this.translateLangDtoService.lang);
            if (name?.value === '') {
                return true;
            }
        }
        return false;
    }

    getNodeElement(context: SnSelectionEvent, snView: SnView): SnNode {
        if (context?.type === 'param' || context?.type === 'flow') {
            const parent = this.snUtilsService.findParent(snView, context.element.id, context.type);
            return parent;
        }

        if (context?.type === 'node') {
            return context.element as SnNode;
        }
    }

    removeButtonsIfPresent(buttons: InspectorBarButton[], buttonKeys: SnSelectionType[]) {
        for (const key of buttonKeys) {
            const index = buttons.findIndex((button) => button.key === key);
            if (index > -1) {
                buttons.splice(index, 1);
            }
        }
    }

    addButtonOrUpdate(buttons: InspectorBarButton[], name: string | SnLang[], type: SnSelectionType, icon?: string | string[]) {
        const index = buttons.findIndex((button) => {
            if (type === 'node') {
                return button.key === type;
            }

            if (this.isNodeChildType(type)) {
                return this.isNodeChildType(button.key as SnSelectionType);
            }

            if (this.isElementType(type)) {
                return this.isElementType(button.key as SnSelectionType);
            }
        });

        const iconOrImage = this.returnIconOrImage(type, icon);
        const title = Array.isArray(name) ? this.translateLangDtoService.transform(name as SnLang[]) : name;

        if (index > -1) {
            buttons[index].title = title;
            if (buttons[index].key !== type) {
                buttons[index].key = type;
                buttons[index].icon = '';
                buttons[index].img = '';
                buttons[index][iconOrImage.key] = iconOrImage.value;
            }
        } else {
            const button: InspectorBarButton = { title, key: type };
            button[iconOrImage.key] = iconOrImage.value;
            buttons.push(button);
        }
    }

    setElementButton(buttons: InspectorBarButton[], name: string | SnLang[], type: SnSelectionType) {
        this.removeButtonsIfPresent(buttons, ['node' as SnSelectionType].concat(this.nodeChildTypes));
        this.addButtonOrUpdate(buttons, name, type);
    }

    setNodeButton(buttons: InspectorBarButton[], displayName: string | SnLang[], icon: string, contextType: SnSelectionType) {
        this.removeButtonsIfPresent(buttons, this.elementTypes);
        this.addButtonOrUpdate(buttons, displayName, 'node', icon);

        if (contextType === 'node') {
            this.removeButtonsIfPresent(buttons, this.nodeChildTypes);
        }
    }

    updateBarButtons(buttons: InspectorBarButton[], context: SnSelectionEvent, nodeContextElement: SnNode) {
        if (context.type !== 'node' && !this.isNodeChildType(context.type)) {
            this.setElementButton(buttons, context.element.displayName, context.type);
            return;
        }

        this.setNodeButton(buttons, nodeContextElement.displayName, nodeContextElement.icon, context.type);

        if ((context.type === 'param' && (context.element as SnParam).direction === 'in') || context.type === 'flow') {
            this.addButtonOrUpdate(buttons, context.element.displayName, context.type, (context.element as SnParam).types);
        }
    }

    private isNodeChildType(type: SnSelectionType): boolean {
        return this.nodeChildTypes.indexOf(type) > -1;
    }

    private isElementType(type: SnSelectionType): boolean {
        return this.elementTypes.indexOf(type) > -1;
    }

    private returnIconOrImage(type: SnSelectionType, icon?: string | string[]): PairDto {
        switch (type) {
            case 'box':
                return { key: 'icon', value: 'fa-solid fa-box' };
            case 'group':
                return { key: 'icon', value: 'fa-solid fa-layer-group' };
            case 'flow':
                return { key: 'img', value: 'flow' };
            case 'param':
                return { key: 'icon', value: this.iconsService.getIconByType(icon)?.value };
            default:
                return { key: 'icon', value: icon };
        }
    }

}
