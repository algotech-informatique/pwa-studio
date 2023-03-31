import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WorkflowProfilModelDto } from '@algotech-ce/core';
import { UUID } from 'angular2-uuid';
import { SnView } from '../../../smart-nodes';

@Component({
    selector: 'profiles',
    templateUrl: './profiles.component.html',
    styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent {

    @Input() profiles: WorkflowProfilModelDto[] = [];
    @Input() snView: SnView;
    @Input() top: number;
    @Output() changed = new EventEmitter();

    addedIndex: number;

    constructor() { }

    addProfile() {
        this.profiles.push({
            uuid: UUID.UUID(),
            name: '',
            color: '',
        });
        this.addedIndex = this.profiles.length - 1;
        this.changed.emit();
    }

    deleteElement(i) {
        this.profiles.splice(i, 1);
        this.changed.emit();
    }

    onChange(name: string, index: number) {
        this.profiles[index].name = name;
        this.changed.emit();
    }

    onColorChange(color, index: number) {
        this.profiles[index].color = color;
        this.changed.emit();
    }

}
