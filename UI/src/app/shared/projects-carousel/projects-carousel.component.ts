import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Project } from '../../models/project';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ProjectItemComponent } from '../project-item/project-item.component';

@Component({
  selector: 'app-projects-carousel',
  templateUrl: './projects-carousel.component.html',
  styleUrls: ['./projects-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatChipsModule, ProjectItemComponent]
})
export class ProjectsCarouselComponent implements OnInit, AfterViewInit {
  @Input() projects: Array<Project> = [];
 

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
  }

}
