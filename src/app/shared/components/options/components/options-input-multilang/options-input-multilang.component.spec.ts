import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsInputMultilangComponent } from './options-input-multilang.component';

describe('OptionsInputMultilangComponent', () => {
    let component: OptionsInputMultilangComponent;
    let fixture: ComponentFixture<OptionsInputMultilangComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OptionsInputMultilangComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionsInputMultilangComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
