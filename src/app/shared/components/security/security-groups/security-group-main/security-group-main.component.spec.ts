import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGroupMainComponent } from './security-group-main.component';

describe('SecurityGroupMainComponent', () => {
    let component: SecurityGroupMainComponent;
    let fixture: ComponentFixture<SecurityGroupMainComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SecurityGroupMainComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SecurityGroupMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
