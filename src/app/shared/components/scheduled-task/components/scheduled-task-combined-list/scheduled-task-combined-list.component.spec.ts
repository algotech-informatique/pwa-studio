import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledTaskCombinedListComponent } from './scheduled-task-combined-list.component';

describe('ScheduledTaskCombinedListComponent', () => {
    let component: ScheduledTaskCombinedListComponent;
    let fixture: ComponentFixture<ScheduledTaskCombinedListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ScheduledTaskCombinedListComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ScheduledTaskCombinedListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
