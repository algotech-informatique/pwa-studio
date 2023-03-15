import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataMainComponent } from './metadata-main.component';

describe('MetadataMainComponent', () => {
    let component: MetadataMainComponent;
    let fixture: ComponentFixture<MetadataMainComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MetadataMainComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MetadataMainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
