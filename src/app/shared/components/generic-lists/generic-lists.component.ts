import { GenericListDto, LangDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { SessionsService } from '../../services';
import { GenericListsDetailService } from './components/services/generic-lists.detail.service';
import { GenericListService } from './components/services/generic-lists.service';
import { GenericFormatedLine } from './dto/generic-formated-line.dto';

@Component({
    selector: 'app-generic-lists',
    templateUrl: './generic-lists.component.html',
    styleUrls: ['./generic-lists.component.scss'],
})
export class GenericListsComponent implements OnChanges {

    @Input() customerKey: string;
    @Input() host: string;

    customerLangs: LangDto[];
    selectedUuid = '';
    _genericLists: GenericListDto[] = [];
    selectedGList: GenericListDto | undefined;
    search = '';
    formatedDetailLines: GenericFormatedLine[] = [];

    set genericLists(value: GenericListDto[]) {
        this._genericLists = value;
        this.sessionService.active.datas.read.glists = this._genericLists;
    }

    constructor(
        private genericListService: GenericListService,
        private genericListsDetailService: GenericListsDetailService,
        private sessionService: SessionsService,
        private ref: ChangeDetectorRef,
    ) { }

    ngOnChanges() {
        this.genericListService.load().subscribe({
            next: (gLists: GenericListDto[]) => {
                this.genericLists = _.orderBy(gLists, 'key');
            },
            error: (err) => console.error(err)
        });
        this.customerLangs = this.sessionService.active.datas.read.customer.languages;
        this._restart();
    }

    onSelectedGlist(data: GenericListDto) {
        this._selectList(data.uuid as string);
    }

    onCreateNewList() {
        this.selectedGList = this.genericListService.createNewGenericList(this.customerLangs);
        this.selectedUuid = this.selectedGList.key;
        this.formatedDetailLines = [];
    }

    onUpdateGList(data: {data: GenericListDto; updateLine: boolean}) {

        if (data.data.key === 'new-list') {
            this.genericListService.createList(data.data).subscribe(
                (result: GenericListDto) => {
                    if (result) {
                        this._genericLists.push(result);
                        this.genericLists = _.orderBy(this._genericLists, 'key');
                        this._selectList(result.uuid as string);
                        this.ref.detectChanges();
                    }
            });
        } else {
            this.genericListService.updateList(data.data).subscribe({
                next: (result: GenericListDto) => {
                    if (result) {
                        const index = _.findIndex(this._genericLists, (gList: GenericListDto) => gList.uuid === this.selectedUuid);
                        if (index !== -1) {
                            this._genericLists[index] = result;
                            this.selectedGList = result;
                            this.genericLists = [...this._genericLists];
                            if (data.updateLine) {
                                this._updateFormatedLines(this.selectedGList.values);
                            }
                            this.ref.detectChanges();
                        }
                    }
                },
                error: (err) => {
                   this.genericListService.sendErrorMessage('GENERIC-LIST.UPDATE-LIST-KO');
                }
            });
        }
    }

    _restart() {
        this.selectedUuid = '';
        this.selectedGList = undefined;
        this.search = '';
    }

    _selectList(uuid: string) {

        this.selectedUuid = uuid;
        const index = _.findIndex(this._genericLists, (glist: GenericListDto) => glist.uuid === uuid);
        if (index !== -1) {
            this.selectedGList = this._genericLists[index];
            this.selectedGList.values = _.orderBy(this.selectedGList.values, 'key');
            this.selectedGList.displayName =
                this.genericListsDetailService.getDisplayName(this.selectedGList.displayName, this.customerLangs);
            this._updateFormatedLines(this.selectedGList.values);
        }
    }

    _updateFormatedLines(lines) {
        this.formatedDetailLines = this.genericListsDetailService.returnFormatedLines(lines, this.customerLangs);
    }

    onRemoveLine(data: GenericListDto) {

        this.genericListService.deleteList(data.uuid as string).subscribe({
            next: (result) => {
                if (result) {
                    const index = _.findIndex(this._genericLists, (gList: GenericListDto) => gList.uuid === data.uuid);
                    this._genericLists.splice(index, 1);
                    this._restart();
                }
            },
            error: (err) => {
                this.genericListService.sendErrorMessage('GENERIC-LIST.DELETE-LIST-KO');
            }
        });
    }
}
