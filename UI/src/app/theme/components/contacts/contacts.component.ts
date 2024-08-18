import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class ContactsComponent implements OnInit {
  @Input() dividers:boolean = true;
  @Input() iconSize:string = 'sm';
  @Input() iconColor:string = '';
  constructor() { }

  ngOnInit() {
  }

}
