import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericListsComponent } from './generic-lists.component';

describe('GenericListsComponent', () => {
    let component: GenericListsComponent;
    let fixture: ComponentFixture<GenericListsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GenericListsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GenericListsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
