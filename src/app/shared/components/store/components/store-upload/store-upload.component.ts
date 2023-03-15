import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { OptionsObjectDto } from '../../../../dtos';
import * as _ from 'lodash';

@Component({
    selector: 'store-upload',
    templateUrl: './store-upload.component.html',
    styleUrls: ['./store-upload.component.scss'],
})
export class StoreUploadComponent implements OnChanges {

    @Input() listObjects: OptionsObjectDto[] = [];
    @Input() selectedId = '';
    @Output() selectObject = new EventEmitter<OptionsObjectDto>();

    listObjectsFiltered: OptionsObjectDto[] = [];

    constructor(
    ) { }

    ngOnChanges() {
        this.listObjectsFiltered = this.listObjects;
    }

    onSelectedObject(event) {
        this.selectObject.emit(event);
    }

    onSearch(data: string) {
        this.listObjectsFiltered = _.reduce(this.listObjects, (result, object: OptionsObjectDto) => {
            if (object.title.toUpperCase().includes(data.toUpperCase())
                || object.mainLine.toUpperCase().includes(data.toUpperCase())
                || object.detailLine?.toUpperCase().includes(data.toUpperCase())) {
                result.push(object);
            }
            return result;
        }, []);
    }

}
