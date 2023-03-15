import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericListsDetailLineComponent } from './generic-lists-detail-line.component';

describe('GenericListsDetailLineComponent', () => {
    let component: GenericListsDetailLineComponent;
    let fixture: ComponentFixture<GenericListsDetailLineComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GenericListsDetailLineComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GenericListsDetailLineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
