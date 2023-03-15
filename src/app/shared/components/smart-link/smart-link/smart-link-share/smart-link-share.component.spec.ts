import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartLinkShareComponent } from './smart-link-share.component';

describe('SmartLinkShareComponent', () => {
    let component: SmartLinkShareComponent;
    let fixture: ComponentFixture<SmartLinkShareComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ SmartLinkShareComponent ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SmartLinkShareComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
