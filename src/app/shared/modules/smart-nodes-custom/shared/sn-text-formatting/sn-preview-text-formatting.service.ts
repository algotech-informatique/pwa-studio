import { Injectable } from '@angular/core';
import { SnParam } from '../../../smart-nodes/models';
import * as _ from 'lodash';
import { SessionsService } from '../../../../services';

@Injectable()
export class SnTextFormattingService {

    constructor(private sessionsService:  SessionsService) {
    }

    updateTextFormatting(mappedMessage: any[], langKey: string, changedValue: string): any[] {
        return _.map(mappedMessage, (message) => {
            if (message.lang === langKey) {
                return {
                    lang: langKey,
                    value: changedValue
                };
            } else {
                return message;
            }
        });
    }

    constructionMapPreview(mappedMessage: any[], nodesParam: SnParam[]) {
        return _.map(mappedMessage, (message) => {
            return {
                lang: message.lang,
                value: this.constructionPreview(message.value, nodesParam)
            };
        });
    }

    constructionPreview(mappedMessage: string, nodesParam: SnParam[]) {
        const keys: string[] = this.readElement(mappedMessage);
        if (keys.length !== 0) {
            return this.replaceElements(mappedMessage, keys, nodesParam);
        } else {
            return mappedMessage;
        }
    }

    readElement(mappedMessage): string[] {
        const res = mappedMessage.match(/{{(?!\[)(.*?)}}/ig);
        if (res) {
            return res;
        }
        return [];
    }

    replaceElements(mappedMessage: string, keys: string[], nodesParam: SnParam[]): string {
        let returnValue: string = mappedMessage;
        _.forEach(keys, (key) => {
            const nodeVal = this.getNodeValue(key, nodesParam);
            returnValue = returnValue.replace(key, nodeVal);
        });
        return returnValue;
    }

    getNodeValue(key: string, nodesParam: SnParam[]) {
        const node = _.find(nodesParam, (param: SnParam) => '{{' + param.key + '}}' === key);
        return (node && node.value) ? node.value : ' //MAPPED// ';
    }


    createParamValue() {
        return this.sessionsService.initializeLangs('');
    }

    mergeParamValue(paramValue: any[]): any[] {
        return this.sessionsService.mergeLangs(paramValue);
    }
}
