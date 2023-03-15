import { Component, Input, ViewChildren, QueryList, ElementRef, Output, EventEmitter } from '@angular/core';
import { SnCanvas, SnNode, SnParam, SnSection } from '../../../../smart-nodes/models';
import { PopoverController } from '@ionic/angular';
import { SnJsonMonacoEditComponent } from '../sn-json-monaco-edit/sn-json-monaco-edit.component';
import { SnDOMService } from '../../../../smart-nodes/services';

@Component({
    selector: 'sn-json-edit',
    templateUrl: './sn-json-edit.component.html',
    styleUrls: ['./sn-json-edit.component.scss']
})
export class SnJsonEditComponent {

    @ViewChildren('txtAreas') txtAreas: QueryList<ElementRef>;
    @Input() node: SnNode;
    @Input() section: SnSection;
    @Input() jsonText: string;
    @Input() params: SnParam[];
    @Output() changeJson = new EventEmitter();


    error = false;

    constructor(
        protected popoverController: PopoverController,
        private snDom: SnDOMService) { }

    onChangeArea() {
        const data = this.txtAreas.last.nativeElement.value;
        this.onChange(data);
    }

    onChange(data) {
        if (this.validateJson(data)) {
            this.error = false;
            this.changeJson.emit(data);
        } else {
            this.error = true;
        }
    }

    validateJson(jsonText: string): boolean {
        try {
            JSON.parse(jsonText);
        } catch (e) {
            return false;
        }
        return true;
    }

    onKeyDown(key: KeyboardEvent) {
        if (key.code === 'Tab') {
            this.tabText();
            key.preventDefault();
            key.stopPropagation();
        }
    }

    tabText() {
        const data: string = this.txtAreas.last.nativeElement.value;
        const startPosition = this.txtAreas.last.nativeElement.selectionStart;
        const endPosition = this.txtAreas.last.nativeElement.selectionEnd;

        const value = data.substring(0, startPosition) + '\t' + data.substring(endPosition);
        this.txtAreas.last.nativeElement.value = value;
        this.txtAreas.last.nativeElement.selectionStart = endPosition + 1;
        this.txtAreas.last.nativeElement.selectionEnd = endPosition + 1;
    }

    popoverEventPosition(ev): any {
        // fix open ionic popup whith zoom css option
        return !ev || !ev.srcElement ? null : {
            target: {
                getBoundingClientRect: () => {
                    const canvas: SnCanvas = this.snDom.getAbsolutNodeCanvas(this.node);
                    return {
                        left: canvas.x - 150,
                        bottom: canvas.y
                    };
                }
            }
        };
    }

    async openEditor(ev) {
        const changeJson = new EventEmitter<any>();
        const modalPopover = await this.popoverController.create({
            component: SnJsonMonacoEditComponent,
            componentProps: {
                changeJson,
                params: this.params,
                json: this.jsonText,
            },
            cssClass: 'popover_class_text_formatting',
            showBackdrop: true,
            backdropDismiss: true,
        });
        changeJson.subscribe((data) => {
            this.onChange(data);
        });
        return await modalPopover.present();
    }
}
