import {
    ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output,
    SimpleChanges, ViewChild
} from '@angular/core';
import { SnSynoticSearchDto, SnModelDto, SnVersionDto } from '@algotech-ce/core';
import { MessageService, SessionsService, SnModelsService } from '../../../services';
import { ListItem } from '../../../modules/inspector/dto/list-item.dto';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, defer, Subject, Subscription, tap } from 'rxjs';
import { SmartNodesService, TranslateLangDtoService } from '@algotech-ce/angular';
import { SnSearchDto } from '../../../dtos';
import { SearchBase } from '../search.base';
import { SearchUtils } from '../search.utils';


interface IVersion {
    version: SnVersionDto;
    active: boolean;
    elements: SnSynoticSearchDto[];
}
interface ITree {
    color: string;
    icon: string;
    snModel: SnModelDto;
    displayName: string;
    open: boolean;
    versions: IVersion[];
}

@Component({
    selector: 'global-search',
    templateUrl: 'global-search.component.html',
    styleUrls: ['./global-search.component.scss']
})

export class GlobalSearchComponent extends SearchBase implements OnInit, OnChanges {

    @Input()
    type: 'search' | 'reference';

    @Input()
    ressource = null;

    @Output()
    clear = new EventEmitter();

    allVersions = false;
    filterActive = false;
    expand = false;

    categoriesList: ListItem[] = [];
    categoriesKeys: string[] = [];

    tree: ITree[] = [];

    constructor(protected ref: ChangeDetectorRef,
        private sessionsService: SessionsService,
        private snModelsService: SnModelsService,
        protected smartNodesService: SmartNodesService,
        private translate: TranslateService,
        private translateLang: TranslateLangDtoService,
        protected messageService: MessageService,) {
        super(smartNodesService, messageService, ref);
    }

    ngOnInit() {
        this.initialize();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.ressource?.currentValue) {
            this.search();
            return;
        }
        this.focusSearch();
    }

    initialize() {
        this.categoriesList = SearchUtils.categoriesList(this.translate);

        for (const item of this.categoriesList) {
            this.categoriesKeys.push(item.key);
        }
    }

    onCheck() {
        this.allVersions = !this.allVersions;
        this.refresh();
    }

    onActiveFilter() {
        this.filterActive = !this.filterActive;
    }

    onOpenSnModel(snModel) {
        snModel.open = !snModel.open;
        this.refreshExpand();
    }

    expandAll() {
        this.tree.forEach((elt) => elt.open = this.expand);
        this.refreshExpand();
    }

    refreshExpand() {
        this.expand = !this.tree.some((elt) => elt.open);
    }

    getVersions() {
        return this.sessionsService.active.datas.write.snModels
            .flatMap((snModel) => snModel.versions.map((version) => ({ version, snModel })))
            .filter((res) => {
                if (!this.allVersions) {
                    const version = this.snModelsService.getActiveVersion(res.snModel);
                    if (!version) {
                        return false;
                    }
                    if (version.uuid !== res.version.uuid) {
                        return false;
                    }
                }
                return this.categoriesKeys.includes(res.snModel.type);
            })
            .map((res) => res.version.uuid);
    }

    onMatchCase() {
        this.matchCase = !this.matchCase;
        this.search();
    }

    onMatchExactValue() {
        this.matchExactValue = !this.matchExactValue;
        this.search();
    }

    onClear() {
        this.filter = null;
        this.moreResult = false;
        this.page = 0;
        this.tree = [];
        this.focusSearch();
        this.clear.emit();
        this.messageService.send('search', null);
    }

    search() {
        this.loading = true;
        this.moreResult = false;
        this.tree = [];
        this.page = 0;
        this.obsSearch.next(null);
    }

    refresh() {
        this.search();
    }

    onChangeCategories(categoriesKeys: string[]) {
        this.categoriesKeys = categoriesKeys;
        this.refresh();
    }

    buildResults(results: SnSynoticSearchDto[]) {
        if (this.page === 0) {
            this.tree = [];
        }
        for (const result of results) {
            const snModel = this.sessionsService.active.datas.write.snModels.find((sn) => sn.uuid === result.snModelUuid);
            if (!snModel) {
                continue;
            }
            const version = snModel.versions.find((v) => v.uuid === result.snVersionUuid);
            if (!version) {
                continue;
            }
            let findSnModel = this.tree.find((sn) => sn.snModel.uuid === snModel.uuid);
            if (!findSnModel) {
                const category = this.categoriesList.find((c) => c.key === snModel.type);
                findSnModel = {
                    open: !this.expand,
                    snModel,
                    versions: [],
                    displayName: snModel.type === 'smartmodel' ?
                        this.translate.instant('EXPLORER-MODELER') :
                        this.translateLang.transform(snModel.displayName),
                    color: category.color,
                    icon: category.icon
                };
                this.tree.push(findSnModel);
            }
            let findVersion = findSnModel.versions.find((v) => v.version.uuid === result.snVersionUuid);
            if (!findVersion) {
                findVersion = {
                    active: snModel.publishedVersion === version.uuid,
                    version,
                    elements: [
                    ]
                };
                findSnModel.versions.push(findVersion);
            }
            findVersion.elements.push(result);
        }

    }
}
