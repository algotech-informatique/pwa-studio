import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsTextAreaMultilangComponent } from './options-text-area-multilang.component';

describe('OptionsTextAreaMultilangComponent', () => {
  let component: OptionsTextAreaMultilangComponent;
  let fixture: ComponentFixture<OptionsTextAreaMultilangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsTextAreaMultilangComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsTextAreaMultilangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
