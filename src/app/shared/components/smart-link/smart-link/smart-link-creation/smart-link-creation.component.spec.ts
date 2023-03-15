import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartLinkCreationComponent } from './smart-link-creation.component';

describe('SmartLinkCreationComponent', () => {
    let component: SmartLinkCreationComponent;
    let fixture: ComponentFixture<SmartLinkCreationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SmartLinkCreationComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SmartLinkCreationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
