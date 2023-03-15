import {
    Component, Input, Output, EventEmitter, ChangeDetectorRef
} from '@angular/core';
import { SnSection, SnView, SnNode } from '../../../models';
import { SnLinksService, SnDragService } from '../../../services';
import { SnSectionClickEvent } from '../../../dto';
import { SnSettings } from '../../../dto/sn-settings';
import * as d3 from 'd3';

@Component({
    selector: 'sn-section',
    templateUrl: './sn-section.component.html',
    styleUrls: ['./sn-section.component.scss'],
})
export class SnSectionComponent {
    @Input()
    section: SnSection;

    @Input()
    snView: SnView;

    @Input()
    node: SnNode;

    @Input()
    settings: SnSettings;

    @Output()
    sectionClicked = new EventEmitter();

    constructor(private snLinksService: SnLinksService, private snDragService: SnDragService, private ref: ChangeDetectorRef) {}

    addParam(event: any, section: SnSection) {
        const sectionClick: SnSectionClickEvent = {
            event: event,
            section: section
        };
        this.sectionClicked.emit(sectionClick);
    }

    openClose(section: SnSection) {
        section.open = !section.open;
        if (this.node) {
            this.ref.detectChanges();
            this.snLinksService.drawTransitions(this.snView, this.node);
            this.snDragService.drag(this.snView, d3.select('#svg'), this.settings);
        }
    }
}
