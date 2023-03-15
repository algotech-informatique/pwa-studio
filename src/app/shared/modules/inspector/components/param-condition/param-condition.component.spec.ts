import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LauchParamConditionComponent } from './param-condition.component';

describe('LauchParamConditionComponent', () => {
  let component: LauchParamConditionComponent;
  let fixture: ComponentFixture<LauchParamConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LauchParamConditionComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LauchParamConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
