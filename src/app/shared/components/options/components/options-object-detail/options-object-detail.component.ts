import { Component, Input, OnInit } from '@angular/core';
import { OptionsObjectDto } from '../../../../dtos';

@Component({
    selector: 'options-object-detail',
    templateUrl: './options-object-detail.component.html',
    styleUrls: ['./options-object-detail.component.scss'],
})
export class OptionsObjectDetailComponent implements OnInit {

    @Input() object: OptionsObjectDto;
    @Input() showLine = true;

    constructor() { }

    ngOnInit() { }
}
