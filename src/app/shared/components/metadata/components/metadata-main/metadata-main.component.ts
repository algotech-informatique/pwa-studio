import { TranslateLangDtoService } from '@algotech/angular';
import { DocumentsMetaDatasSettingsDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import * as _ from 'lodash';
import { OptionsObjectDto } from '../../../../dtos';

@Component({
    selector: 'metadata-main',
    templateUrl: './metadata-main.component.html',
    styleUrls: ['./metadata-main.component.scss'],
})
export class MetadataMainComponent implements OnChanges {

    @Input() metadataList: DocumentsMetaDatasSettingsDto[];
    @Input() selectedId: string;

    _search = '';
    @Input()
    get search() {
        return this._search;
    }
    @Output() searchChange = new EventEmitter();
    set search(data) {
        this._search = data;
        this.searchChange.emit(data);
    }

    @Output() selectedMetadata = new EventEmitter();
    @Output() createNewMetadata = new EventEmitter();

    optionList:  OptionsObjectDto[] = [];
    optionListFiltered: OptionsObjectDto[] = [];

    constructor(
        private translateService: TranslateLangDtoService,
    ) { }

    ngOnChanges() {
        this.onLoad();
    }

    onLoad() {
        this.optionList = _.map(this.metadataList, (data) => {
            const option: OptionsObjectDto = {
                title: this.translateService.transform(data.displayName),
                mainLine: data.key,
                uuid: data.key,
            };
            return option;
        });
        this._filterList(this.search);
    }

    onSelectedObject(data) {
        this.selectedMetadata.emit(data);
    }

    onSearch(data) {
        this._filterList(data);
    }

    _filterList(filter: string) {

        this.optionListFiltered = _.reduce(this.optionList, (result, opt: OptionsObjectDto) => {
            if (opt.title.toUpperCase().includes(filter.toUpperCase()) || opt.mainLine.toUpperCase().includes(filter.toUpperCase())) {
                result.push(opt);
            }
            return result;
        }, []);
    }

    onCreateMetadata() {
        this.createNewMetadata.emit();
    }

}
