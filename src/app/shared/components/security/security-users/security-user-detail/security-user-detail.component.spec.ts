import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityUserDetailComponent } from './security-user-detail.component';

describe('SecurityUserDetailComponent', () => {
    let component: SecurityUserDetailComponent;
    let fixture: ComponentFixture<SecurityUserDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SecurityUserDetailComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SecurityUserDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
