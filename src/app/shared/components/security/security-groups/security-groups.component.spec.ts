import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGroupsComponent } from './security-groups.component';

describe('SecurityGroupsComponent', () => {
    let component: SecurityGroupsComponent;
    let fixture: ComponentFixture<SecurityGroupsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SecurityGroupsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SecurityGroupsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
