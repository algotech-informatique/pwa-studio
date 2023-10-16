import { KeyFormaterService, TranslateLangDtoService } from '@algotech-ce/angular';
import { LangDto, SnModelDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnvironmentService, MessageService } from '../../../services';
import { SessionsService } from '../../../services/sessions/sessions.service';
import { SearchUtils } from '../search.utils';

interface IElement {
    path: string;
    displayName: LangDto[];
    type: string;
    icon: string;
    color: string;
    snModel: SnModelDto;
}

@Component({
    selector: 'resource-search',
    templateUrl: 'resource-search.component.html',
    styleUrls: ['./resource-search.component.scss']
})

export class ResourceSearchComponent {
    @ViewChild('input', { static: false }) input: ElementRef;

    show = false;
    filter = '';

    elements: IElement[] = [];
    results: IElement[] = [];

    selectedIndex = 0;

    constructor(
        private ref: ChangeDetectorRef,
        private translate: TranslateService,
        private translateLang: TranslateLangDtoService,
        private keyFormater: KeyFormaterService,
        private messageService: MessageService,
        private environmentService: EnvironmentService,
        private sessionService: SessionsService) { }

    ngOnInit() { }

    @HostListener('document:keydown', ['$event'])
    handleModuledEvent(e: KeyboardEvent) {
        // ctrl + e
        if (e.ctrlKey && e.code === 'KeyP') {
            e.preventDefault();
            this.show = true;
            this.initialize();
            this.focusSearch();
            return;
        }
    }

    initialize() {
        this.elements = this.buildResults(this.sessionService.active.datas.write.snModels.sort((a, b) =>
            b.updateDate.localeCompare(a.updateDate)));
        this.search();
    }

    focusSearch() {
        this.ref.detectChanges();
        if (this.input?.nativeElement) {
            setTimeout(() => {
                this.input.nativeElement.select();
            }, 0);
        }
    }

    onFocusOut() {
        setTimeout(() => {
            this.close();
        }, 200);
    }

    onKeydown(event) {
        if (event.key === 'Escape') {
            this.close();
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (this.selectedIndex < this.results.length - 1) {
                this.selectedIndex++;
            }
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (this.selectedIndex > 0) {
                this.selectedIndex--;
            }
        }

        if (event.key === 'Enter') {
            const item = this.results[this.selectedIndex];
            if (item) {
                this.openResource(item);
                this.close();
            }
        }
    }

    close() {
        this.selectedIndex = 0;
        this.show = false;
        this.filter = '';
    }

    search() {
        this.selectedIndex = 0;
        this.results = (this.filter ? this.elements
            .filter((ele) =>
                this.keyFormater.format(
                    this.translateLang.transform(ele.displayName)
                        .toUpperCase()
                )
                    .includes(this.keyFormater.format(this.filter.toUpperCase()))
            )
        : [...this.elements]).splice(0, 100);
    }

    buildResults(snModels: SnModelDto[]): IElement[] {
        const categoriesList = SearchUtils.categoriesList(this.translate);
        return snModels.map((snModel) => {
            const category = categoriesList.find((c) => c.key === snModel.type);

            return {
                color: category.color,
                displayName: snModel.displayName,
                type: snModel.type,
                icon: category.icon,
                path: this.environmentService.getPath([this.sessionService.active.environment], snModel.dirUuid),
                snModel,
            };
        });
    }

    openResource(element: IElement) {
        this.messageService.send('open-tab', element.snModel);
    }
}
