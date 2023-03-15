import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'display-check-element',
    template: `
        <div class="options" [ngClass]="{'disabled': disabled}">
            <div class="option search" (click)="onCheck()">
                <div [class]="mode === 'check' ? 'square mode' : 'circle mode'" [ngClass]="{'selected': value}">
                    <i *ngIf="value" class="fa-solid fa-check"></i>
                </div>
                <div class="label">{{ title }}</div>
            </div>
        </div>
    `,
    styleUrls: ['./display-check-element.component.scss'],
})
export class DisplayCheckElementComponent {

    @Input() value = false;
    @Input() title = '';
    @Input() disabled = false;
    @Input() mode: 'check' | 'radio' = 'check';
    @Output() changed = new EventEmitter();

    onCheck() {
        if ((this.mode === 'radio' && !this.value) || this.mode === 'check') {
            this.value = !this.value;
            this.changed.emit(this.value);
        }
    }

}
