import { Injectable } from '@angular/core';
import { SnNode, SnParam, SnLang } from '../../smart-nodes';
import * as _ from 'lodash';
import { IconsService } from '../../../services';
import { ListItem } from '../dto/list-item.dto';
import { TranslateLangDtoService } from '@algotech/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class DataModelInspectorService {

    constructor(
        private iconsService: IconsService,
        private translateLangDtoService: TranslateLangDtoService,
        private translateService: TranslateService,
    ) { }

    createSkills(model: SnNode): { radioList: ListItem[]; selected: string[] } {
        const skills: string[] = Object.keys(model.custom.skills);
        const radioList = [];
        const selected = [];
        for (const skill of skills) {
            radioList.push({
                key: skill,
                value: this.translateService.instant('SKILLS_' + skill.replace('at', '').toUpperCase()),
                icon: this.iconsService.getIcon('sk:' + skill).value,
            });
            if (model.custom.skills[skill]) {
                selected.push(skill);
            }
        }
        return { radioList, selected };
    }

    createPropertiesList(element: SnNode): ListItem[] {
        return (!element.sections[0].params) ? [] : _.map(element.sections[0].params, (param: SnParam) => {
            const paramType = _.isArray(param.types) ? param.types[0] : param.types as string;
            return {
                key: param.key,
                value: this.translateLangDtoService.transform(param.displayName as SnLang[]),
                icon: this.iconsService.getIconByType(param.types).value,
                color: this.iconsService.getIconColor(paramType),
            };
        });
    }

    createFieldProperties(param: SnParam): { radioList: ListItem[]; selected: string[] } {
        const selected = [];
        if (param.required) { selected.push('required'); }
        if (param.value.hidden) { selected.push('value.hidden'); }
        if (param.multiple) { selected.push('multiple'); }

        const radioList = [
            { key: 'required', value: this.translateService.instant('SMART_MODEL.FIELDS.FIRST_PANEL.SECOND_PARAM') },
            { key: 'value.hidden', value: this.translateService.instant('SMART_MODEL.FIELDS.FIRST_PANEL.THIRD_PARAM') },
            { key: 'multiple', value: this.translateService.instant('SMART_MODEL.FIELDS.FIRST_PANEL.FOURTH_PARAM') },
        ];

        return { radioList, selected };
    }

    createComposition(param: SnParam): { radioList: ListItem[]; selected: string[] } {
        const selected = param.value.composition ? ['value.composition'] : [];
        const radioList = [{
            key: 'value.composition',
            value: this.translateService.instant('SMART_MODEL.FIELDS.SECOND_PANEL.SECOND_PARAM_COMPOSITION'),
        }];
        return { radioList, selected };
    }
}
