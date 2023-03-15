import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'goto-button',
  template: `
      <div class="open-button">
          <div class="button" (click)="buttonClicked($event)">
              <i class="fa-solid fa-sign-in-alt icon"></i>
          </div>
      </div>
  `,
  styleUrls: ['./goto-button.component.scss']
})
export class GotoButtonComponent {

    @Output() goto = new EventEmitter();

    buttonClicked(ev: any) {
        ev.stopPropagation();
        this.goto.emit();
    }

}
