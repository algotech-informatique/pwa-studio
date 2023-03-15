import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPopoverComponent } from './color-popover.component';

describe('ColorPopoverComponent', () => {
    let component: ColorPopoverComponent;
    let fixture: ComponentFixture<ColorPopoverComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPopoverComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPopoverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
