import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsColorComponent } from './options-color.component';

describe('OptionsColorComponent', () => {
    let component: OptionsColorComponent;
    let fixture: ComponentFixture<OptionsColorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OptionsColorComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionsColorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
