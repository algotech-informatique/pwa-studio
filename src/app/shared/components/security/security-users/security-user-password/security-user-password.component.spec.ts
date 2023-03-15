import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityUserPasswordComponent } from './security-user-password.component';

describe('SecurityUserPasswordComponent', () => {
    let component: SecurityUserPasswordComponent;
    let fixture: ComponentFixture<SecurityUserPasswordComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SecurityUserPasswordComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SecurityUserPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
