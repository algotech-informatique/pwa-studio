import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDownloadListComponent } from './store-download-list.component';

describe('StoreDownloadListComponent', () => {
    let component: StoreDownloadListComponent;
    let fixture: ComponentFixture<StoreDownloadListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StoreDownloadListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StoreDownloadListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
