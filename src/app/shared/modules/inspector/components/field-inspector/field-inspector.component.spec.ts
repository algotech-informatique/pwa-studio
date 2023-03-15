import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldInspectorComponent } from './field-inspector.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FieldInspectorComponent', () => {
  let component: FieldInspectorComponent;
  let fixture: ComponentFixture<FieldInspectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldInspectorComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
