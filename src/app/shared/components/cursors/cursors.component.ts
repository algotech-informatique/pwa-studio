import { Component, Input, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription, timer, fromEvent } from 'rxjs';
import { SessionsService, DatasService } from '../../services';
import { sample } from 'rxjs/operators';
import { SnZoomService } from '../../modules/smart-nodes';
import { CursorMoveDto } from '../../dtos';
import { WsUserDto } from '@algotech/core';
import * as _ from 'lodash';
import { WS_USERS_COLORS } from '@algotech/angular';
import { AppZoomService } from '../../modules/app/services';

@Component({
    selector: 'cursors',
    templateUrl: './cursors.component.html',
    styleUrls: ['./cursors.component.scss']
})
export class CursorsComponent implements AfterViewInit, OnChanges, OnDestroy {

    @Input()
    editor: HTMLElement;

    @Input()
    customerKey: string;

    @Input()
    host: string;

    @Input()
    viewId: string;

    @Input()
    zoomService: SnZoomService|AppZoomService;

    cursors: {
        wsUser: WsUserDto,
        color: string,
        initalPosition: {
            x: number,
            y: number,
        }
        position: {
            x: number,
            y: number,
        }
    }[] = [];

    subscription: Subscription;

    constructor(
        public sessionsService: SessionsService,
        private datasService: DatasService) {
    }

    ngAfterViewInit() {
        const datas = this.datasService.findData(this.customerKey, this.host);

        // cursor move (me)
        this.subscription = fromEvent<MouseEvent>(this.editor, 'mousemove').pipe(
            sample(
                timer(0, 100)
            )
        ).subscribe(($event) => {
            // emit only if multi users on same view
            if (this.sessionsService.active.datas.status === 1 && datas.socket.users.some((u) => u.focus && u.focus.zone === this.viewId)) {
                const cursorMove: CursorMoveDto = {
                    position: this.getAbsolutePosition($event),
                    viewId: this.viewId
                };
                this.datasService.notifyMouseMove(this.customerKey, this.host, cursorMove);
            }
        });

        // cursor move (other)
        this.subscription.add(
            this.datasService.on(datas, 'event.cursor.focus.chg',
                (data: { color: number, zone: CursorMoveDto }) => {
                    this.onCursorMove(data);
                })
        );

        // view changed, users changed
        this.subscription.add(this.datasService.on(datas, 'event.view.focus.chg', () => this.refreshCursor()));
        this.subscription.add(datas.socket.uniqueUsers.subscribe(() => this.refreshCursor()));

        // zoom changed
        this.subscription.add(
            this.zoomService.zoomed.subscribe(() => {
                for (const cursor of this.cursors) {
                    cursor.position = this.getRelativePosition(cursor.initalPosition);
                }
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ngOnChanges() {
        this.cursors = [];
    }

    refreshCursor() {
        const datas = this.datasService.findData(this.customerKey, this.host);
        this.cursors = this.cursors.filter(
            (c) => datas.socket.users.some(
                (u) => u.color === c.wsUser.color && u.focus && u.focus.zone === this.viewId));
    }

    onCursorMove(data: { color: number, zone: CursorMoveDto }) {
        const datas = this.datasService.findData(this.customerKey, this.host);
        if (data.zone.viewId === this.viewId) {
            const aUser: WsUserDto = _.find(datas.socket.users, user => user.color === data.color);
            if (!aUser) {
                return;
            }
            const findCursor = this.cursors.find((c) => c.wsUser.color === data.color);

            if (findCursor) {
                findCursor.initalPosition = data.zone.position;
                findCursor.position = this.getRelativePosition(findCursor.initalPosition);
            } else {
                this.cursors.push({
                    wsUser: aUser,
                    color: WS_USERS_COLORS[aUser.color],
                    initalPosition: data.zone.position,
                    position: this.getRelativePosition(data.zone.position),
                });
            }
        }
    }

    getAbsolutePosition(event: MouseEvent) {
        const rect = this.editor.getBoundingClientRect();
        return {
            x: ((event.x - rect.left - this.zoomService.transform.x) / this.zoomService.transform.k),
            y: ((event.y - rect.top - this.zoomService.transform.y) / this.zoomService.transform.k)
        };
    }

    getRelativePosition(absolutePosition) {
        return {
            x: (absolutePosition.x + (this.zoomService.transform.x / this.zoomService.transform.k)) * this.zoomService.transform.k,
            y: (absolutePosition.y + (this.zoomService.transform.y / this.zoomService.transform.k)) * this.zoomService.transform.k
        };
    }
}
