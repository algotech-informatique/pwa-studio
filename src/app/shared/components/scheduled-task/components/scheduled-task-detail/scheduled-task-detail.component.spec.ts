import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledTaskDetailComponent } from './scheduled-task-detail.component';

describe('ScheduledTaskDetailComponent', () => {
    let component: ScheduledTaskDetailComponent;
    let fixture: ComponentFixture<ScheduledTaskDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ScheduledTaskDetailComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ScheduledTaskDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
