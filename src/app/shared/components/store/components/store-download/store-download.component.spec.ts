import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDownloadComponent } from './store-download.component';

describe('StoreDownloadComponent', () => {
    let component: StoreDownloadComponent;
    let fixture: ComponentFixture<StoreDownloadComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StoreDownloadComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StoreDownloadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
