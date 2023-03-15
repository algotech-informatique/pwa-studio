import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDataComponent } from './import-data.component';

describe('ImportDataComponent', () => {
    let component: ImportDataComponent;
    let fixture: ComponentFixture<ImportDataComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ImportDataComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImportDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
