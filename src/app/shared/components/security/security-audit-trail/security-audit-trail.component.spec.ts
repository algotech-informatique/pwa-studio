import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityAuditTrailComponent } from './security-audit-trail.component';

describe('SecurityAuditTrailComponent', () => {
    let component: SecurityAuditTrailComponent;
    let fixture: ComponentFixture<SecurityAuditTrailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SecurityAuditTrailComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SecurityAuditTrailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
