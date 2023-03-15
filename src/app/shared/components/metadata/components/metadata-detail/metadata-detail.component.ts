import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'metadata-detail',
    templateUrl: './metadata-detail.component.html',
    styleUrls: ['./metadata-detail.component.scss'],
})
export class MetadataDetailComponent {

    @Input() metadata;

    @Output() updateMetadata = new EventEmitter<{data: any, option: string}>();
    @Output() removeMetadata = new EventEmitter();

    constructor() { }

    updateKey(data) {
        const mData = _.cloneDeep(this.metadata);
        mData.key = data;
        this.updateMetadata.emit({data: mData, option: 'add'});
    }

    updateName(data) {
        const mData = _.cloneDeep(this.metadata);
        mData.displayName = data;
        this.updateMetadata.emit({data: mData, option: 'update'});
    }

    onDeleteMetadata() {
        this.removeMetadata.emit(this.metadata);
    }
}
