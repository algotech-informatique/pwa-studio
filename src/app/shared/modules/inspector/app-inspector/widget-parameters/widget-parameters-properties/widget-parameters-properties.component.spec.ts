import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetParametersPropertiesComponent } from './widget-parameters-properties.component';

describe('WidgetParametersPropertiesComponent', () => {
    let component: WidgetParametersPropertiesComponent;
    let fixture: ComponentFixture<WidgetParametersPropertiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WidgetParametersPropertiesComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetParametersPropertiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
