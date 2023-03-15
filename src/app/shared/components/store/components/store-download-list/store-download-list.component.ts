import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { OptionsObjectDto } from '../../../../dtos';
import { StoreFrontService } from '../../services/store-front.service';
import * as _ from 'lodash';

@Component({
    selector: 'store-download-list',
    templateUrl: './store-download-list.component.html',
    styleUrls: ['./store-download-list.component.scss'],
})
export class StoreDownloadListComponent implements OnChanges {

    @Input() listObjects: OptionsObjectDto[] = [];
    @Input() clearLog: string;
    @Input() inputLog: string;
    @Output() deployItems = new EventEmitter<OptionsObjectDto[]>();

    deployAll = false;

    constructor(
        private storeFrontService: StoreFrontService,
    ) { }

    ngOnChanges() {
        this.deployAll = false;
    }

    onDeploy() {
        const elements: OptionsObjectDto[] = this.selectedOptionList();
        this.deployItems.emit(elements);
    }

    onChecked() {
        this.deployAll = !this.deployAll;
        if (this.deployAll) {
            this.listObjects = this.storeFrontService.allOptionListActivate(this.listObjects);
        }
    }

    onClickObject(data) {
        this.storeFrontService.activateOptionList(data);
    }

    deployList(): boolean {
        const elements: OptionsObjectDto[] = this.selectedOptionList();
        return (elements.length === 0);
    }

    selectedOptionList(): OptionsObjectDto[] {
        return  _.reduce(this.listObjects, (result, object: OptionsObjectDto) => {
            if (object.statusIcon.status) {
                result.push(object);
            }
            return result;
        }, []);
    }
}
