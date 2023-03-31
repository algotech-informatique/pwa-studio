import { Injectable } from '@angular/core';
import { SnSelectionEvent, SnParam, SnUtilsService, SnView } from '../../smart-nodes';
import { PairDto } from '@algotech-ce/core';
import * as _ from 'lodash';
import { SessionsService } from '../../../services/sessions/sessions.service';
import { SmartModelDto, SmartPropertyModelDto } from '@algotech-ce/core';
import { ParamEditorDto } from '../dto/param-editor.dto';
import { ParamConditionDto } from '../dto/param-condition.dto';

@Injectable()
export class ParamEditorService {

    displayText: PairDto[] = [
        {
            key: 'text',
            value: 'SN-PARAM-DISPLAY-TEXT-SIMPLE'
        },
        {
            key: 'textarea',
            value: 'SN-PARAM-DISPLAY-TEXT-ZONE'
        },
        {
            key: 'combobox',
            value: 'SN-PARAM-DISPLAY-COMBOBOX'
        },
        {
            key: 'dropdown',
            value: 'SN-PARAM-DISPLAY-DROPDOWN'
        },
    ];

    displayBool: PairDto[] = [
        {
            key: 'switch',
            value: 'SN-PARAM-DISPLAY-BOOL-SWITCH'
        },
        {
            key: 'checkbox',
            value: 'SN-PARAM-DISPLAY-BOOL-CHECK'
        },
        {
            key: 'yes-no',
            value: 'SN-PARAM-DISPLAY-BOOL-YESNO'
        }
    ];

    displayNumber: PairDto[] = [
        {
            key: 'standart',
            value: 'SN-PARAM-DISPLAY-NUMBER-MULTIPLE'
        },
        {
            key: '0',
            value: 'SN-PARAM-DISPLAY-NUMBER-SINGLE'
        },
        {
            key: '2',
            value: 'SN-PARAM-DISPLAY-NUMBER-DECIMAL'
        }
    ];

    displayList: PairDto[] = [
        {
            key: 'select',
            value: 'SN-PARAM-DISPLAY-LIST-ZONE'
        },
        {
            key: 'list',
            value: 'SN-PARAM-DISPLAY-LIST-LIST'
        },
        {
            key: 'bubble',
            value: 'SN-PARAM-DISPLAY-LIST-BUBBLE'
        }
    ];

    displayListOrdre: PairDto[] = [
        {
            key: 'default',
            value: 'SN-PARAM-DISPLAY-LIST-ORDRE-DEFAULT'
        },
        {
            key: 'asc',
            value: 'SN-PARAM-DISPLAY-LIST-ORDRE-ASC'
        },
        {
            key: 'desc',
            value: 'SN-PARAM-DISPLAY-LIST-ORDRE-DESC'
        },
        {
            key: 'random',
            value: 'SN-PARAM-DISPLAY-TRI-RANDOM'
        }
    ];

    displayTri: PairDto[] = [
        {
            key: 'asc',
            value: 'SN-PARAM-DISPLAY-TRI-ALPHA'
        },
        {
            key: 'random',
            value: 'SN-PARAM-DISPLAY-TRI-RANDOM'
        }
    ];

    constructor(
        private snUtils:  SnUtilsService,
        private sessionsService: SessionsService,
    ) {}

    paramIsFormOptions(snView: SnView, param: SnParam) {
        // get associate node
        const findNode = this.snUtils.getParamsWithNode(snView).find((elt) => elt.param === param);
        if (!findNode || findNode.node.type !== 'SnFormNode') {
            return false;
        }
        const section = findNode.node.sections.find((s) => s.key === 'options');
        if (!section || section.params.indexOf(param as SnParam) === -1) {
            return false;
        }

        return true;
    }

    constructionParam(event: SnSelectionEvent): ParamEditorDto {
        const eleParam: SnParam = event.element as SnParam;
        const type = _.isArray(eleParam.types) ? eleParam.types[0] : eleParam.types as string;
        switch (type) {
            case 'string':
                return this.constructionString(eleParam);
            case 'number':
                return this.constructionParamNumber(eleParam);
            case 'boolean':
                return this.constructionParamBoolean(eleParam);
            case 'sys:glistvalue':
                return this.constructionParamList(eleParam);
            default:
                return this.constructionParamOther(eleParam);
        }
    }

    getCondition(eleParam: SnParam): ParamConditionDto {
        if (eleParam.value) {
            return (eleParam.value.condition === undefined) ? null : eleParam.value.condition;
        }
        return null;
    }

    private constructionString(eleParam: SnParam) {
        if (this.recuperationType(eleParam.key)) {
            return this.constructionParamString(eleParam);
        } else {
            return this.constructionParamList(eleParam);
        }
    }

    private recuperationType(key: string): boolean {
        const split = _.compact(key.split(/\.(.*)/));
        if (split.length <= 1) {
            return true;
        }
        const model: SmartModelDto = _.find(this.sessionsService.active.datas.read.smartModels, (md: SmartModelDto) => md.key === split[0]);
        if (model) {
            const prop: SmartPropertyModelDto = _.find(model.properties, (pr: SmartPropertyModelDto) => pr.key === split[1]);
            if (prop) {
                return (prop.items) ? false : true;
            }
        }
        return true;
    }

    private constructionParamString(eleParam: SnParam): ParamEditorDto {
        let type = this.displayText[0].key;
        let minLen = null;
        let maxLen = null;
        let defaultValue = null;

        if (eleParam.value) {
            type =  (eleParam.value.type === undefined) ? this.displayText[0].key : eleParam.value.type;
            minLen = (eleParam.value.minlen !== undefined) ? eleParam.value.minlen : null;
            maxLen = (eleParam.value.maxlen !== undefined) ? eleParam.value.maxlen : null;
            defaultValue = (eleParam.value.defaultValue !== undefined) ? eleParam.value.defaultValue : '';
        }

        return {
            params: this.displayText,
            type: 'string',
            value: {
                type,
                minlen: minLen,
                maxlen: maxLen,
                condition: this.getCondition(eleParam),
                defaultValue,
            }
        };
    }

    private constructionParamNumber(eleParam: SnParam): ParamEditorDto {
        let format = this.displayNumber[0].key;
        let defaultValue = null;

        if (eleParam.value) {
            format = (eleParam.value.format === undefined) ? this.displayNumber[0].key : eleParam.value.format;
            defaultValue = (eleParam.value.defaultValue !== undefined) ? eleParam.value.defaultValue : 0;
        }

        return {
            params: this.displayNumber,
            type: 'number',
            value: {
                format,
                condition: this.getCondition(eleParam),
                defaultValue,
            }
        };
    }

    private constructionParamBoolean(eleParam: SnParam): ParamEditorDto {
        let display = this.displayBool[0].key;
        if (eleParam.value) {
            display = (eleParam.value.display === undefined) ? this.displayBool[0].key : eleParam.value.display;
        }
        return {
            params: this.displayBool,
            type: 'boolean',
            value: {
                display,
                condition: this.getCondition(eleParam),
            }
        };
    }

    private constructionParamList(eleParam: SnParam): ParamEditorDto {

        let display = this.displayList[0].key;
        let sort = this.displayListOrdre[0].key;
        let pluggable = false;
        if (eleParam.value) {
            display = (eleParam.value.display === undefined) ? this.displayList[0].key : eleParam.value.display;
            sort = (eleParam.value.sort === undefined) ? this.displayListOrdre[0].key : eleParam.value.sort;
            pluggable = (eleParam.value.pluggable === undefined) ? false : eleParam.value.pluggable;
        }

        return {
            params: this.displayList,
            optParams: this.displayListOrdre,
            plugged: {
                key: 'pluggable',
                value: 'SN-PARAM-DISPLAY-LIST-PLUGGED'
            },
            type: 'list',
            value: {
                type: (pluggable) ? 'pluggable' : '',
                display,
                sort,
                pluggable,
                condition: this.getCondition(eleParam),
            }
        };
    }

    private constructionParamOther(eleParam: SnParam): ParamEditorDto {
        return {
            params: [],
            value: {
                condition : this.getCondition(eleParam),
            }
        };
    }

}
