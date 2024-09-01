import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet'; 
import { Property } from '../../app.models';
import { Settings, AppSettings } from '../../app.settings';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mood-board-candidate-product-overview',
  templateUrl: './mood-board-candidate-product-overview.component.html',
  styleUrls: ['./mood-board-candidate-product-overview.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule, MatListModule]
})
export class MoodBoardCandidateProductOverviewComponent implements OnInit {

  public products!: Observable<Product[]>;
  public settings: Settings;
  constructor(public productService: ProductsService,
              public appSettings: AppSettings,
              public authService: AuthService,
              public route: Router,
              private bottomSheetRef: MatBottomSheetRef<MoodBoardCandidateProductOverviewComponent>) {
    this.settings = this.appSettings.createNew()
  }

  ngOnInit() {
    // this.products = this.store.pipe(select(getAllMoodBoardProducts));
  }

  public hideSheet(isRedirect: boolean) {
    this.bottomSheetRef.dismiss(isRedirect);
  }

  public remove(product: any, event: any) {
    if (this.authService.loggedIn()) {
      // this.store.dispatch(new UserUnSelectRequest(this.authService.getDecodedToken().nameid, product.productId));
    } else {
      this.route.navigate(['/login']);
    }
    this.products.subscribe(x => {
      if (x.length === 0) {
        this.hideSheet(false);
      }
      event.preventDefault();
    });
    
  }

}
