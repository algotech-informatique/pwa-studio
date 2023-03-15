import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataDetailComponent } from './metadata-detail.component';

describe('MetadataDetailComponent', () => {
    let component: MetadataDetailComponent;
    let fixture: ComponentFixture<MetadataDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MetadataDetailComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MetadataDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
