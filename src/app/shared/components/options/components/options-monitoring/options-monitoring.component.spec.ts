import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsMonitoringComponent } from './options-monitoring.component';

describe('OptionsMonitoringComponent', () => {
    let component: OptionsMonitoringComponent;
    let fixture: ComponentFixture<OptionsMonitoringComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OptionsMonitoringComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionsMonitoringComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
