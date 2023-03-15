import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckListPopUpComponent } from './check-list-pop-up.component';

describe('CheckListPopUpComponent', () => {
    let component: CheckListPopUpComponent;
    let fixture: ComponentFixture<CheckListPopUpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CheckListPopUpComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CheckListPopUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
