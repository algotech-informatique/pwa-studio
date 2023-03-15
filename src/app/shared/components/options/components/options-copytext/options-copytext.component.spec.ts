import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsCopyTextComponent } from './options-copytext.component';

describe('OptionsCopyTextComponent', () => {
  let component: OptionsCopyTextComponent;
  let fixture: ComponentFixture<OptionsCopyTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsCopyTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsCopyTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
