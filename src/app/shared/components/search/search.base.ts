import { SmartNodesService } from '@algotech-ce/angular';
import { SnModelDto, SnSynoticSearchDto, SnVersionDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, defer, map, of, Subject, Subscription, tap } from 'rxjs';
import { SnSearchDto } from '../../dtos';
import { MessageService } from '../../services';

interface IVersion {
    version: SnVersionDto;
    active: boolean;
    elements: SnSynoticSearchDto[];
}

interface ITree {
    color: string;
    icon: string;
    snModel: SnModelDto;
    open: boolean;
    versions: IVersion[];
}

@Component({
    selector: 'search',
    template: ''
})

export abstract class SearchBase {
    @ViewChild('input', { static: false }) input: ElementRef;

    obsSearch = new Subject();
    ressource: string;
    filter = '';
    loading = false;
    moreResult = false;
    matchCase = false;
    matchExactValue = false;
    page = 0;
    limit = 100;

    constructor(
        protected smartNodesService: SmartNodesService,
        protected messageService: MessageService,
        protected ref: ChangeDetectorRef) {
        let subscription: Subscription = null;
        this.obsSearch.pipe(
            debounceTime(300),
            tap(() => {
                if (subscription) {
                    subscription.unsubscribe();
                }
            }),
            tap(() => {
                subscription = this.executeSearch().subscribe();
            })).subscribe();
    }

    public executeSearch() {
        return defer(() => {
            const search$ = this.ressource ?
                this.smartNodesService.references({ ressource: this.ressource, versions: this.getVersions() }, this.page, this.limit) :
                this.filter ? this.smartNodesService.search({ search: this.filter, versions: this.getVersions(),
                    caseSensitive: this.matchCase, exactValue: this.matchExactValue }, this.page, this.limit) :
                    of([]);
            return search$.pipe(
                tap((res: SnSynoticSearchDto[]) => {
                    this.loading = false;
                    this.moreResult = res.length === this.limit;
                    this.buildResults(res);
                }));
        });
    }

    focusSearch() {
        this.ref.detectChanges();
        if (this.input?.nativeElement) {
            setTimeout(() => {
                this.input.nativeElement.select();
            }, 0);
        }
    }

    loadMore() {
        this.loading = true;
        this.moreResult = false;
        this.page++; // todo
        this.obsSearch.next(null);
    }

    selectResource(element: SnSynoticSearchDto, snModelUuid: string, version: SnVersionDto, elements: SnSynoticSearchDto[]) {
        const search: SnSearchDto = {
            version,
            snModelUuid,
            element,
            elements,
        };
        this.messageService.send('search', search);
    }

    public abstract buildResults(res: SnSynoticSearchDto[]);
    public abstract getVersions(): string[];
}
