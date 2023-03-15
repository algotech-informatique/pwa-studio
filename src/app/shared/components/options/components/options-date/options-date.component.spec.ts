import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsDateComponent } from './options-date.component';

describe('OptionsDateComponent', () => {
  let component: OptionsDateComponent;
  let fixture: ComponentFixture<OptionsDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
