import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { MonacoEditorConstructionOptions, MonacoEditorLoaderService, } from '@materia-ui/ngx-monaco-editor';
import { take, filter } from 'rxjs/operators';
import { SnParam } from '../../../../smart-nodes/models';
import * as _ from 'lodash';

@Component({
    selector: 'sn-json-monaco-edit',
    templateUrl: './sn-json-monaco-edit.component.html',
    styleUrls: ['./sn-json-monaco-edit.component.scss']
})
export class SnJsonMonacoEditComponent implements OnDestroy {


    @Input() json: string;
    @Input() params: SnParam[];
    @Output() changeJson = new EventEmitter();
    completionItemProvider: monaco.IDisposable;
    editor;
    editorOptions: MonacoEditorConstructionOptions = {
        theme: 'vs-dark',
        language: 'json',
        automaticLayout: true,
        formatOnPaste: true,
        formatOnType: true,
        minimap: {
            enabled: false
        }
    };
    constructor(private monacoLoaderService: MonacoEditorLoaderService,
        private navParams: NavParams) {
        this.json = this.navParams.data.json;
        this.monacoLoaderService.isMonacoLoaded$.pipe(
            filter(loaded => loaded),
            take(1)
        ).subscribe(() => {
            this.completionItemProvider = monaco.languages.registerCompletionItemProvider("json", this.getJSonCompletionProvider());
        });
    }

    ngOnDestroy(): void {
        if (this.completionItemProvider) {
            this.completionItemProvider.dispose();
        }
    }

    onChange(data) {
        if (this.validateJson(data)) {
            this.changeJson.emit(data);
        }
    }

    validateJson(json: string): boolean {
        try {
            JSON.parse(json);
        } catch (e) {
            return false;
        }

        return true;
    }

    getJSonCompletionProvider(): any {
        return {
            provideCompletionItems: (model, position) => ({
                suggestions: this.params.map((param: SnParam) => ({
                    label: param.key,
                    kind: monaco.languages.CompletionItemKind.Value,
                    insertText: `"{{${param.key}}}"`
                }))
            })
        };
    }

}
