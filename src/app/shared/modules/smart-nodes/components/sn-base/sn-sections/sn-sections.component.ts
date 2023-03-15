import {
    Component, Input, Output, EventEmitter
} from '@angular/core';
import { SnSection, SnView, SnNode } from '../../../models';
import { SnSectionClickEvent } from '../../../dto';
import { SnSettings } from '../../../dto/sn-settings';

@Component({
    selector: 'sn-sections',
    templateUrl: './sn-sections.component.html',
    styleUrls: ['./sn-sections.component.scss'],
})
export class SnSectionsComponent {
    @Input()
    sections: SnSection[] = [];

    @Input()
    snView: SnView;

    @Input()
    node: SnNode;

    @Input()
    settings: SnSettings;

    @Output()
    sectionClicked = new EventEmitter();

    onSectionClicked(section: SnSectionClickEvent) {
        section.event.stopPropagation();
        this.sectionClicked.emit(section);
    }
}
