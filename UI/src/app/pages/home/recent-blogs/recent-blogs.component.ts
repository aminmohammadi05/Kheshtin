import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { Blog } from 'src/app/models/blog';
import { Product } from 'src/app/models/product';
import { BlogItemHomeComponent } from 'src/app/shared/blog-item-home/blog-item-home.component';

@Component({
  selector: 'app-recent-blogs',
  templateUrl: './recent-blogs.component.html',
  styleUrls: ['./recent-blogs.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FlexLayoutModule, BlogItemHomeComponent]
})
export class RecentBlogsComponent implements OnInit {
  @Input() recentBlogs: any[];
  @Input() viewType: string = 'grid';
  @Input() viewCol: number = 32;
  constructor() { }

  ngOnInit() {
  }


}
