import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsLoggerComponent } from './options-logger.component';

describe('OptionsLoggerComponent', () => {
    let component: OptionsLoggerComponent;
    let fixture: ComponentFixture<OptionsLoggerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OptionsLoggerComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionsLoggerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
