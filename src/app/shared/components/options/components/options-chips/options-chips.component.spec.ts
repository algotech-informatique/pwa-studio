import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsChipsComponent } from './options-chips.component';

describe('OptionsChipsComponent', () => {
  let component: OptionsChipsComponent;
  let fixture: ComponentFixture<OptionsChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsChipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
