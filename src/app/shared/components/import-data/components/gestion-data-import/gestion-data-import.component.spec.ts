import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDataImportComponent } from './gestion-data-import.component';

describe('GestionDataImportComponent', () => {
     let component: GestionDataImportComponent;
     let fixture: ComponentFixture<GestionDataImportComponent>;

     beforeEach(async(() => {
          TestBed.configureTestingModule({
               declarations: [GestionDataImportComponent],
               schemas: [CUSTOM_ELEMENTS_SCHEMA],
          })
               .compileComponents();
     }));

     beforeEach(() => {
          fixture = TestBed.createComponent(GestionDataImportComponent);
          component = fixture.componentInstance;
          fixture.detectChanges();
     });

     it('should create', () => {
          expect(component).toBeTruthy();
     });
});
