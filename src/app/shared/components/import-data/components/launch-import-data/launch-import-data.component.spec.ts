import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchImportDataComponent } from './launch-import-data.component';

describe('LaunchImportDataComponent', () => {
    let component: LaunchImportDataComponent;
    let fixture: ComponentFixture<LaunchImportDataComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LaunchImportDataComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LaunchImportDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
