import { Component, OnInit, Input } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';

@Component({
  selector: 'app-social-icons',
  templateUrl: './social-icons.component.html',
  styleUrls: ['./social-icons.component.scss']
})
export class SocialIconsComponent implements OnInit {
  @Input() iconSize:string = '';
  @Input() iconColor:string = '';
  constructor(public appSettings: AppSettings) { }

  ngOnInit() {
  }

}
