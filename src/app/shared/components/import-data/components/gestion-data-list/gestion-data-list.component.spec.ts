import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDataListComponent } from './gestion-data-list.component';

describe('GestionDataListComponent', () => {
    let component: GestionDataListComponent;
    let fixture: ComponentFixture<GestionDataListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GestionDataListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GestionDataListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
