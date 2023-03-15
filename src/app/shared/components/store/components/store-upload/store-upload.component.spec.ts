import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreUploadComponent } from './store-upload.component';

describe('StoreUploadComponent', () => {
    let component: StoreUploadComponent;
    let fixture: ComponentFixture<StoreUploadComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StoreUploadComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StoreUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
