import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsToggleComponent } from './options-toggle.component';

describe('OptionsToggleComponent', () => {
    let component: OptionsToggleComponent;
    let fixture: ComponentFixture<OptionsToggleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OptionsToggleComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionsToggleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
