import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionsSourcesComponent } from './options-sources.component';

describe('OptionsSourcesComponentt', () => {
  let component: OptionsSourcesComponent;
  let fixture: ComponentFixture<OptionsSourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsSourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
