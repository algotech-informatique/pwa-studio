import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsCheckboxComponent } from './options-checkbox.component';

describe('OptionsCheckboxComponent', () => {
  let component: OptionsCheckboxComponent;
  let fixture: ComponentFixture<OptionsCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
