import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Property } from 'src/app/app.models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductsService } from 'src/app/services/products.service';
import { UserFavorites } from 'src/app/models/user-favorites';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { tap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
    imports: [CommonModule, MatIconModule,MatTableModule, MatChipsModule, MatListModule, MatFormFieldModule,MatProgressSpinnerModule,  FlexLayoutModule, ReactiveFormsModule, MatPaginatorModule],
})
export class FavoritesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'actions' ];
  favoriteProducts: Product[] = [];
  dataSource: MatTableDataSource<Product>;
  initializeDataSource = true;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(public productService: ProductsService,
              public authService: AuthService) { }

  ngOnInit() {
    // this.store.pipe(select(getAllUserFavorites),
    // map((userFavorites) => {
    //   this.favoriteProducts = userFavorites.map(f => f.product);
    //   this.dataSource = new MatTableDataSource(this.favoriteProducts);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // })).subscribe();
  }

  public remove(product: Product) {
    // this.store.dispatch(new UserUnLikeRequest(this.authService.getDecodedToken().nameid, product.productId));
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
