import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericListsMainComponent } from './generic-lists-main.component';

describe('GenericListsMainComponent', () => {
    let component: GenericListsMainComponent;
    let fixture: ComponentFixture<GenericListsMainComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GenericListsMainComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GenericListsMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
