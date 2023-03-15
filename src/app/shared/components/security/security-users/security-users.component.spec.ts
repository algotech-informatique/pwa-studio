import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityUsersComponent } from './security-users.component';

describe('SecurityUsersComponent', () => {
    let component: SecurityUsersComponent;
    let fixture: ComponentFixture<SecurityUsersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SecurityUsersComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SecurityUsersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
