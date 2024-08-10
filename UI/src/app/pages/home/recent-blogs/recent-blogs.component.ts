import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Blog } from 'src/app/models/blog';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-recent-blogs',
  templateUrl: './recent-blogs.component.html',
  styleUrls: ['./recent-blogs.component.css']
})
export class RecentBlogsComponent implements OnInit {
  @Input() recentBlogs: any[];
  @Input() viewType: string = 'grid';
  @Input() viewCol: number = 32;
  constructor() { }

  ngOnInit() {
  }


}
