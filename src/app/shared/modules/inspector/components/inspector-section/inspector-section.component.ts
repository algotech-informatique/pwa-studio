import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InspectorSectionButton } from '../../dto/inspector-section-button.dto';

@Component({
    selector: 'inspector-section',
    templateUrl: './inspector-section.component.html',
    styleUrls: ['./inspector-section.component.scss'],
})
export class InspectorSectionComponent implements OnInit {

    @Input() title: string;
    @Input() titleIcon: string;
    @Input() subTitle: string;
    @Input() subTitleIcon: string;
    @Input() defaultOpen = true;
    @Input() display: 'section' | 'card' = 'section';
    @Input() color: string;
    @Input() button: InspectorSectionButton;
    @Input() showLock = false;
    @Input() locked = false;
    @Input() section: string = '';
    @Output() closeSection = new EventEmitter();
    @Output() clickButton = new EventEmitter<string>();
    @Output() lockChange = new EventEmitter<{ section: string; locked: boolean }>();
    isOpen = true;

    ngOnInit() {
        this.isOpen = this.defaultOpen;
    }

    openSection() {
        if (this.display !== 'card') { return; }
        this.isOpen = !this.isOpen;
        if (!this.isOpen) {
            this.closeSection.emit();
        }
    }

    onClickButton(event: any) {
        event.stopPropagation();
        this.button.selected = !this.button.selected;
        this.clickButton.emit(this.button.selected ? this.button.onKey : this.button.offKey);
    }

    onLockChange(event: any) {
        this.lockChange.emit(event);
    }

}
