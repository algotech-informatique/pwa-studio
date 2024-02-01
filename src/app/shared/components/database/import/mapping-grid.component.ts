import { GridConfigurationDto } from '@algotech-ce/business';
import { PairDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { SnContextmenuAction } from '../../../modules/smart-nodes';
import { Model } from '../interfaces/model.interface';
import { Row } from '../interfaces/row.interface';
import { DataBaseImportService } from '../services/data-base-import.service';
import * as _ from 'lodash';
import { of, Subject, Subscription } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
@Component({
    selector: 'app-data-base-mapping-grid',
    styleUrls: ['./mapping-grid.component.scss'],
    templateUrl: './mapping-grid.component.html',
})

export class AppDataBaseImportMappingComponent implements OnInit, OnDestroy {
    @Input() model: Model;
    @Input() file: File;
    @Input() importState: Subject<'inProgress' | 'succeeded' | 'error'>;
    empty: boolean;
    data: Row[] = [];
    replaceExisting = false;
    columnBreaker = ',';
    encoding = 'utf8';
    moreDataToLoad: boolean;
    loading: boolean;
    configuration: GridConfigurationDto;
    paginate: string;
    count: number;
    actions: SnContextmenuAction[];
    processState: 'notStarted' | 'inProgress' | 'succeeded' | 'error' = 'inProgress';
    message = 'INSPECTOR.DATABASE.FILE.READ.ACTION';
    subscription: Subscription;
    doImport = new EventEmitter<{
        canImport: boolean;
        columns: PairDto[];
        propertiesFormat: PairDto[];
        replaceExisting: boolean;
        columnBreaker: string;
        encoding: string;
    }>();

    constructor(
        private importService: DataBaseImportService,
        private ref: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        const fakeModel = {
            key: 'fakeModel',
            properties: Array.from(Array(10).keys()).map(() => ({
                key: '',
                displayName: [],
                keyType: 'string'
            })),

        };
        this.ref.detectChanges();
        this.configuration = this.importService.setConfigueration([], fakeModel);
        this.data = this.importService.getData([], fakeModel);
        if (this.file && this.model.sm && this.importState) {

            this.subscription = this.importState.subscribe((state) => {
                this.message = 'INSPECTOR.DATABASE.FILE.IMPORT.ACTION';
                this.processState = state;

            });
            this.importService.getPopertyMapping(this.file, this.model, this.columnBreaker, this.encoding).pipe(
                mergeMap((mapping) => {
                    this.processState = 'succeeded';
                    this.ref.detectChanges();
                    return of(mapping);
                }),
                delay(500)
            ).subscribe({
                next: (mapping) => {
                    this.ref.detectChanges();
                    this.configuration = mapping.configueration;
                    this.data = mapping.data;
                    this.processState = 'notStarted';
                    this.ref.detectChanges();
                },
                error: () => {
                    this.processState = 'error';
                    this.ref.detectChanges();
                }
            });
        }
    }
    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onCellValueChanged(value: string, row: Row, key: string) {
        const property = row.properties.find((p) => p.key === key);
        if (!property) {
            return;
        }
        property.value = value;
    }

    onValidate(canImport) {
        const data = (canImport && this.processState !== 'error') ? _.reduce(this.data, (results, r: Row) => {
            const prop = r.properties.find(p => p.key === 'property');
            const modelProp = this.model.sm?.properties.find(smP => smP.key === prop?.realValue);
            const column = r.properties.find(p => p.key === 'column');
            const format = r.properties.find(p => p.key === 'format');

            if (modelProp && column?.value) {
                results.mappings.push(
                    {
                        key: column.value,
                        value: modelProp,
                    }
                );
                if (format) {
                    results.formats.push({ key: modelProp.key, value: format.value });
                }
            }
            return results;
        }, { mappings: [], formats: [] }) : [];

        this.doImport.emit({
            canImport: (canImport && this.processState !== 'error'),
            columns: data.mappings,
            propertiesFormat: data.formats,
            replaceExisting: this.replaceExisting,
            columnBreaker: this.columnBreaker,
            encoding: this.encoding
        });
    }

    changeFormat() {
        this.ngOnInit();
    }
}

