import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { OfficeProjectsCarouselComponent } from '../../../shared/office-projects-carousel/office-projects-carousel.component';

@Component({
  selector: 'app-recent-office-projects',
  templateUrl: './recent-office-projects.component.html',
  styleUrls: ['./recent-office-projects.component.css'],
  standalone: true,
  imports: [CommonModule,  FlexLayoutModule, MatFormFieldModule,  OfficeProjectsCarouselComponent ]
})
export class RecentOfficeProjectsComponent implements OnInit {
  @Input() recentOfficeProjects: any;
  @Input() viewType: string = 'grid';
  @Input() viewCol: number = 25;
  constructor() { }

  ngOnInit() {
  }


}
