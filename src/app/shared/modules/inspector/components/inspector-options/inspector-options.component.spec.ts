import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InspectorOptionsComponent } from './inspector-options.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InspectorOptionsComponent', () => {
  let component: InspectorOptionsComponent;
  let fixture: ComponentFixture<InspectorOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectorOptionsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectorOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
