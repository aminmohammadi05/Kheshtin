import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet'; 
import { Property } from '../../app.models';
import { Settings, AppSettings } from '../../app.settings';
import { AppService } from 'src/app/app.service';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-compare-overview',
  templateUrl: './compare-overview.component.html',
  styleUrls: ['./compare-overview.component.scss'] 
})
export class CompareOverviewComponent implements OnInit {

  public products: Product[];
  public settings: Settings;
  constructor(public productService: ProductsService,
              public appSettings: AppSettings,
              private bottomSheetRef: MatBottomSheetRef<CompareOverviewComponent>) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.products = this.productService.Data.compareList;
  }

  public hideSheet(isRedirect: boolean) {
    this.bottomSheetRef.dismiss(isRedirect);
  }

  public remove(product, event: any) {
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
