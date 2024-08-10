import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recent-office-projects',
  templateUrl: './recent-office-projects.component.html',
  styleUrls: ['./recent-office-projects.component.css']
})
export class RecentOfficeProjectsComponent implements OnInit {
  @Input() recentOfficeProjects;
  @Input() viewType: string = 'grid';
  @Input() viewCol: number = 25;
  constructor() { }

  ngOnInit() {
  }


}
