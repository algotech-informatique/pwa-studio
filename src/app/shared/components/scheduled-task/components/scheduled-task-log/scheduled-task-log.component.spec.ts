import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledTaskLogComponent } from './scheduled-task-log.component';

describe('ScheduledTaskLogComponent', () => {
    let component: ScheduledTaskLogComponent;
    let fixture: ComponentFixture<ScheduledTaskLogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ScheduledTaskLogComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ScheduledTaskLogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
