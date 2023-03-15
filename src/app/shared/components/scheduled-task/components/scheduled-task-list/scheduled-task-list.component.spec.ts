import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledTaskListComponent } from './scheduled-task-list.component';

describe('ScheduledTaskListComponent', () => {
    let component: ScheduledTaskListComponent;
    let fixture: ComponentFixture<ScheduledTaskListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ScheduledTaskListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ScheduledTaskListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
