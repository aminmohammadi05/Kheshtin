import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Product } from '../../models/product';
import { ProductItemComponent } from '../product-item/product-item.component';

@Component({
  selector: 'app-products-carousel',
  templateUrl: './products-carousel.component.html',
  styleUrls: ['./products-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatChipsModule, ProductItemComponent]
})
export class ProductsCarouselComponent implements OnInit, AfterViewInit {
  @Input() products: Array<Product> = [];
 
  @Input() viewType: string = 'grid';
  @Input() viewCol: number = 20;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
  }

}
