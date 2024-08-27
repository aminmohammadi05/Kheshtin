import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet'; 
import { Property } from '../../app.models';
import { Settings, AppSettings } from '../../app.settings';

import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
@Component({
  selector: 'app-compare-overview',
  templateUrl: './compare-overview.component.html',
  styleUrls: ['./compare-overview.component.scss'] ,
  standalone: true,
  imports: [CommonModule, MatIconModule,  FlexLayoutModule, MatSelectModule, MatToolbarModule, MatButtonModule, MatListModule],
})
export class CompareOverviewComponent implements OnInit {

  public products: Product[] = [];
  public settings: Settings;
  constructor(public productService: ProductsService,
              public appSettings: AppSettings,
              private bottomSheetRef: MatBottomSheetRef<CompareOverviewComponent>) {
    this.settings = this.appSettings.createNew()
  }

  ngOnInit() {
    this.products = this.productService.Data.compareList;
  }

  public hideSheet(isRedirect: boolean) {
    this.bottomSheetRef.dismiss(isRedirect);
  }

  public remove(product: any, event: any) {
    const index: number = this.productService.Data.compareList.indexOf(product);
    if (index !== -1) {
      this.productService.Data.compareList.splice(index, 1);
    }
    if (this.productService.Data.compareList.length === 0) {
      this.hideSheet(false);
    }
    event.preventDefault();
  }

}
