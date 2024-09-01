import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { BlogItemHomeComponent } from '../../../shared/blog-item-home/blog-item-home.component';


@Component({
  selector: 'app-recent-blogs',
  templateUrl: './recent-blogs.component.html',
  styleUrls: ['./recent-blogs.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, BlogItemHomeComponent]
})
export class RecentBlogsComponent implements OnInit {
  @Input()
  recentBlogs: any[] = [];
  @Input() viewType: string = 'grid';
  @Input() viewCol: number = 32;
  constructor() { }

  ngOnInit() {
  }


}
