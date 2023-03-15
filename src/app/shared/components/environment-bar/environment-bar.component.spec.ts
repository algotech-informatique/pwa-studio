import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentBarComponent } from './environment-bar.component';

describe('ExplorerComponent', () => {
  let component: EnvironmentBarComponent;
  let fixture: ComponentFixture<EnvironmentBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironmentBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
