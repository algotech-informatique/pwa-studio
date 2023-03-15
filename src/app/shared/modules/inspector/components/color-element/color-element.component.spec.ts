import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorElementComponent } from './color-element.component';

describe('ColorElementComponent', () => {
  let component: ColorElementComponent;
  let fixture: ComponentFixture<ColorElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorElementComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
