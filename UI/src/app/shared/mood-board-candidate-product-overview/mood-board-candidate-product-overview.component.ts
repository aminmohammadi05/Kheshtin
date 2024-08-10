import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet'; 
import { Property } from '../../app.models';
import { Settings, AppSettings } from '../../app.settings';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mood-board-candidate-product-overview',
  templateUrl: './mood-board-candidate-product-overview.component.html',
  styleUrls: ['./mood-board-candidate-product-overview.component.scss'] 
})
export class MoodBoardCandidateProductOverviewComponent implements OnInit {

  public products: Observable<Product[]>;
  public settings: Settings;
  constructor(public productService: ProductsService,
              public appSettings: AppSettings,
              public authService: AuthService,
              public route: Router,
              private bottomSheetRef: MatBottomSheetRef<MoodBoardCandidateProductOverviewComponent>) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    // this.products = this.store.pipe(select(getAllMoodBoardProducts));
  }

  public hideSheet(isRedirect: boolean) {
    this.bottomSheetRef.dismiss(isRedirect);
  }

  public remove(product, event: any) {
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
