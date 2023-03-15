import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGroupDetailComponent } from './security-group-detail.component';

describe('SecurityGroupDetailComponent', () => {
    let component: SecurityGroupDetailComponent;
    let fixture: ComponentFixture<SecurityGroupDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SecurityGroupDetailComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SecurityGroupDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
