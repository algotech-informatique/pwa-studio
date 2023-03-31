import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { LangDto, SnModelDto } from '@algotech-ce/core';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { SnView } from '../../../smart-nodes';
import { InspectorOptionsService } from './inspector-options.service';
import { ListItem } from '../../dto/list-item.dto';

@Component({
    selector: 'inspector-options',
    templateUrl: './inspector-options.component.html',
    styleUrls: ['./inspector-options.component.scss'],
})
export class InspectorOptionsComponent implements OnChanges {

    @Input() snModel: SnModelDto;
    @Input() snView: SnView;
    @Input() sources;
    @Input() options;
    @Output() changed = new EventEmitter();

    tagsList: ListItem[];

    constructor(
        public translate: TranslateService,
        private inspectorService: InspectorOptionsService,
    ) { }

    ngOnChanges() {
        this.tagsList = this.inspectorService.creationDataList();
    }

    onChangedDisplayKey(key: string) {
        this.snModel.key = key;
        this.changed.emit();
    }

    onChangedDisplayName(displayName: LangDto[]) {
        this.snModel.displayName = displayName;
        this.changed.emit();
    }

    updateTags(event: string[]) {
        if (!event) { return; }
        this.options.tags = event;
        this.changed.emit();
    }

    onChanged() {
        this.changed.emit();
    }

    onPopupClosed() {
        this.changed.emit();
    }

    onIconChanged(data: string) {
        this.snView.options.iconName = data;
        this.changed.emit();
    }

    onChangedSubWorkflow(checked: boolean) {
        this.snView.options.subWorkflow = checked;
        this.changed.emit();
    }

}
