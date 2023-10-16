import { SmartNodesService } from '@algotech-ce/angular';
import { SnSynoticSearchDto, SnVersionDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from '../../../services';
import { SearchBase } from '../search.base';

@Component({
    selector: 'local-search',
    templateUrl: 'local-search.component.html',
    styleUrls: ['./local-search.component.scss']
})

export class LocalSearchComponent extends SearchBase implements OnInit {
    filter = '';

    @Input()
    snModelUuid: string;

    @Input()
    version: SnVersionDto;

    @Output()
    closed = new EventEmitter();

    results: SnSynoticSearchDto[] = [];
    current = -1;

    constructor(protected ref: ChangeDetectorRef,
        protected smartNodesService: SmartNodesService,
        protected messageService: MessageService,) {
        super(smartNodesService, messageService, ref);
    }

    ngOnInit() {
        this.focusSearch();
    }

    onClose() {
        this.onClear();
        this.closed.emit();
    }

    getVersions() {
        return [this.version.uuid];
    }

    onClear() {
        this.applyClear();
        this.messageService.send('search', null);
    }

    onMatchCase() {
        this.matchCase = !this.matchCase;
        this.search();
    }

    onMatchExactValue() {
        this.matchExactValue = !this.matchExactValue;
        this.search();
    }

    applyClear() {
        this.filter = null;
        this.moreResult = false;
        this.page = 0;
        this.current = -1;
        this.results = [];
        this.focusSearch();
    }

    search() {
        if (!this.filter) {
            this.onClear();
            return;
        }
        this.loading = true;
        this.moreResult = false;
        this.results = [];
        this.page = 0;
        this.current = -1;
        this.obsSearch.next(null);
    }

    buildResults(results: SnSynoticSearchDto[]) {
        if (this.page === 0) {
            this.results = [];
        }
        this.results.push(...results.filter((res) => res.type !== 'view' && res.type !== 'app'));
        this.selectResource(this.current === -1 ? null : this.results[this.current], this.snModelUuid, this.version, this.results);
    }

    next() {
        if (this.results.length === 0) {
            return ;
        }
        this.current++;
        if (this.current + 1 > this.results.length) {
            if (this.moreResult) {
                this.loadMore();
                return ;
            }
            this.current = 0;
        }
        this.selectResource(this.results[this.current], this.snModelUuid, this.version, this.results);
    }

    previous() {
        if (this.results.length === 0) {
            return ;
        }
        this.current--;
        if (this.current < 0) {
            this.current = this.results.length - 1;
        }
        this.selectResource(this.results[this.current], this.snModelUuid, this.version, this.results);
    }

    onKeydown(event) {
        if (event.key === 'Escape') {
            this.onClose();
        }
    }
}
