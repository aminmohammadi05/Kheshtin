import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { OfficeProject } from '../../models/office-project';
import { ProjectItemComponent } from '../project-item/project-item.component';
import { SmallOfficeProjectItemComponent } from '../small-office-project-item/small-office-project-item.component';

@Component({
  selector: 'app-related-office-projects-carousel',
  templateUrl: './related-office-projects-carousel.component.html',
  styleUrls: ['./related-office-projects-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatChipsModule, SmallOfficeProjectItemComponent]
})
export class RelatedOfficeProjectsCarouselComponent implements OnInit, AfterViewInit {
  @Input() officeProjects: Array<OfficeProject> = [];
  @Input() viewType: string = 'grid';
  @Input() viewCol: number = 25;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
  }

}
