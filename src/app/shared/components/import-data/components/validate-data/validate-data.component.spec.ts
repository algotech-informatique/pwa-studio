import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateDataComponent } from './validate-data.component';

describe('ValidateDataComponent', () => {
    let component: ValidateDataComponent;
    let fixture: ComponentFixture<ValidateDataComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ValidateDataComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ValidateDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
