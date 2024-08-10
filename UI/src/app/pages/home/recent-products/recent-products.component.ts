import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-recent-products',
  templateUrl: './recent-products.component.html',
  styleUrls: ['./recent-products.component.css']
})
export class RecentProductsComponent implements OnInit {
  @Input() recentProductsObjects: any[];
  @Input() viewType: string = 'grid';
  @Input() viewCol: number = 25;
  constructor() { }

  ngOnInit() {
  }


}
