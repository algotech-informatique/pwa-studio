import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LangSelectorPopUpComponent } from './lang-selector-pop-up.component';

describe('LangSelectorPopUpComponent', () => {
    let component: LangSelectorPopUpComponent;
    let fixture: ComponentFixture<LangSelectorPopUpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LangSelectorPopUpComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LangSelectorPopUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
