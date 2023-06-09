import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataSelectorComponent } from './data-selector.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DataSelectorComponent', () => {
    let component: DataSelectorComponent;
    let fixture: ComponentFixture<DataSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [ DataSelectorComponent ],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
