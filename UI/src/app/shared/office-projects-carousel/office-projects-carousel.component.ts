import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { OfficeProject } from 'src/app/models/office-project';
import { OfficeProjectItemComponent } from '../office-project-item/office-project-item.component';


@Component({
  selector: 'app-office-projects-carousel',
  templateUrl: './office-projects-carousel.component.html',
  styleUrls: ['./office-projects-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, OfficeProjectItemComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OfficeProjectsCarouselComponent implements OnInit, AfterViewInit {
  @Input() officeProjects: Array<OfficeProject> = [];
  public config = {};
  @Input() viewType: string = 'grid';
  @Input() viewCol: number = 25;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: 4,
      spaceBetween: 16,
      keyboard: true,
      navigation: { nextEl: '.prop-next', prevEl: '.prop-prev'},
      pagination: true,
      grabCursor: true,
      loop: false,
      preloadImages: true,
      lazy: false,
      breakpoints: {
        600: {
          slidesPerView: 1
        },
        960: {
          slidesPerView: 2,
        },
        1280: {
          slidesPerView: 3,
        }
      }
    };
  }

}
