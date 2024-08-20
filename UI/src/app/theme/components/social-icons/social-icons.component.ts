import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AppSettings } from '../../../app.settings';


@Component({
  selector: 'app-social-icons',
  templateUrl: './social-icons.component.html',
  styleUrls: ['./social-icons.component.scss'],
  standalone: true,
  imports:[CommonModule, MatIconModule]
})
export class SocialIconsComponent implements OnInit {
  @Input() iconSize:string = '';
  @Input() iconColor:string = '';
  constructor(public appSettings: AppSettings) { }

  ngOnInit() {
  }

}
