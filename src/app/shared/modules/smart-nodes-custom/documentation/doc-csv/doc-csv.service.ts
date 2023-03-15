import { TranslateLangDtoService } from '@algotech/angular';
import { SnLang } from '@algotech/business/src/lib/app/models';
import { LangDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { SnNode } from '../../../smart-nodes/models';
import { SnTranslateService } from '../../../smart-nodes/services';
import { DocUtilsService, InOut, SnEntryComponentEx } from '../doc-utils/doc-utils.service';

@Injectable()
export class DocCsvService {
    constructor(
        private snTranslate: SnTranslateService,
        private translateLang: TranslateLangDtoService,
        private docUtils: DocUtilsService) { }

    generateCsvNodes(languages: LangDto[], nodes?: SnNode[]) {
        const matrices = [];
        if (!nodes) {
            const groups = this.docUtils.buildCmps(languages);
            for (const group of groups) {
                for (const cmp of group.components) {
                    const inputs = this.docUtils.getInputs(cmp.schema);
                    const outputs = this.docUtils.getOutputs(cmp.schema);
                    this.pushNode(matrices, cmp, languages, group.displayName, inputs, outputs);
                }
            }
        } else {
            for (const node of nodes) {
                const cmp = this.docUtils.findEntryComponent(node, languages);
                const groups = this.docUtils.buildCmps(languages);
                const group = groups.find((g) => g.components.some((c) => _.isEqual(c.schema, cmp.schema)));
                const inputs = this.docUtils.getInputs(cmp.schema);
                const outputs = this.docUtils.getOutputs(cmp.schema);
                this.pushNode(matrices, cmp, languages, group?.displayName, inputs, outputs);
            }
        }

        this.generateCsv(matrices);
    }

    generateCsv(matrices: any[]) {
        const csvContent = 'data:text/csv;charset=utf-8,' + matrices.map(e => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    }

    pushNode(matrices: any[], cmp: SnEntryComponentEx, languages: LangDto[], category: any, inputs: InOut[], outputs: InOut[]) {
        const node = this.getLang(cmp.displayName, 'fr-FR', languages);
        const nodeKey = cmp.displayName as string;

        matrices.push([nodeKey, node, 'Name', ...this.getLangs(cmp.displayName, languages)]);
        matrices.push([nodeKey, node, 'Tag', ...this.getLangs(cmp.tags.join(';'))]);
        matrices.push([nodeKey, node, 'Category', ...this.getLangs(category, languages)]);
        matrices.push([nodeKey, node, 'DescriptionHeader', ...this.getLangs('')]);
        matrices.push([nodeKey, node, 'DescriptionBody', ...this.getLangs('')]);

        // IN
        for (const input of inputs) {
            const name = input.name ? this.getLangs(input.name as string, languages) :
                (input.key ? this.getLangs(input.key) : null);
            if (name) {
                matrices.push([nodeKey, node, 'InputName', ...name]);
            }
            matrices.push([nodeKey, node, 'InputType', ...this.getLangs(input.type)]);
            matrices.push([nodeKey, node, 'InputDescription', ...this.getLangs('')]);
        }

        // OUT
        for (const output of outputs) {
            if (Array.isArray(output.name)) {
                matrices.push([nodeKey, node, 'OutputName',
                    ...languages.map((l) => this.translateLang.transform(output.name as SnLang[], l.lang))
                ]);
            } else {
                const name = output.name ? this.getLangs(output.name as string, languages) :
                    (output.key ? this.getLangs(output.key) : null);
                if (name) {
                    matrices.push([nodeKey, node, 'OutputName', ...name]);
                }
            }
            matrices.push([nodeKey, node, 'OutputType', ...this.getLangs(output.type)]);
            matrices.push([nodeKey, node, 'OutputDescription', ...this.getLangs('')]);
        }
    }

    private getLangs(key: any, languages?: SnLang[]) {
        if (!languages) {
            return [
                key, key, key
            ];
        }
        return languages.map((l) => this.getLang(key, l.lang, languages));
    }

    private getLang(key: any, lang: string, languages?: SnLang[]) {
        const langs = this.snTranslate.initializeLangsByKey(key, languages);
        return this.translateLang.transform(langs as SnLang[], lang);
    }
}
