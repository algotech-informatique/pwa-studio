import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { PopupElementService } from '../components/popup-element/popup-element.service';
import { InspectorBarButton } from '../dto/inspector-bar-button.dto';

@Component({
    selector: 'inspector-layout',
    templateUrl: './inspector-layout.component.html',
    styleUrls: ['./inspector-layout.component.scss'],
})
export class InspectorLayoutComponent implements AfterViewInit, OnChanges {

    @ViewChild('container') container: ElementRef;
    @Input() barButtons: InspectorBarButton[];
    @Input() selected: string;
    @Input() opened: boolean;
    @Output() selectButton = new EventEmitter<string>();
    @Output() closeInspector = new EventEmitter();
    selectedButton: InspectorBarButton;

    constructor(
        private popupElement: PopupElementService,
    ) { }

    ngAfterViewInit() {
        this.popupElement.view = this.container;
    }

    ngOnChanges() {
        this.selectedButton = this.barButtons.find((button) => button.key === this.selected);
    }

    closeContent() {
        this.closeInspector.emit();
    }

    clickButton(key: string) {
        if (this.opened && this.selected === key) {
            this.closeContent();
        } else {
            this.selectButton.emit(key);
        }
    }

}
