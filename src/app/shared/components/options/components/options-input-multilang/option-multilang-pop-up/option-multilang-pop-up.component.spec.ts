import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionMultilangPopUpComponent } from './option-multilang-pop-up.component';

describe('OptionMultilangPopUpComponent', () => {
    let component: OptionMultilangPopUpComponent;
    let fixture: ComponentFixture<OptionMultilangPopUpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OptionMultilangPopUpComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionMultilangPopUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
