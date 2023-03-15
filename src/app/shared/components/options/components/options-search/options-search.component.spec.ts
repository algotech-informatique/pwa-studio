import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsSearchComponent } from './options-search.component';

describe('OptionsSearchComponent', () => {
    let component: OptionsSearchComponent;
    let fixture: ComponentFixture<OptionsSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OptionsSearchComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionsSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
