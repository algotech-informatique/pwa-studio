import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreUploadListComponent } from './store-upload-list.component';

describe('StoreUploadListComponent', () => {
    let component: StoreUploadListComponent;
    let fixture: ComponentFixture<StoreUploadListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StoreUploadListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StoreUploadListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
