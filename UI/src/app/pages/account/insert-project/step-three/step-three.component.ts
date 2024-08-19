import { Component, OnInit, Input, Inject, Output, forwardRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Product } from 'src/app/models/product';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/products.service';
import { Project } from 'src/app/models/project';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map, switchMap, tap, mergeMap } from 'rxjs/operators';
import { Pagination } from 'src/app/models/pagination';
import { FileValidatorDirective } from 'src/app/theme/directives/file-validator.directive';
import { Search } from 'src/app/models/search';
import { Category } from 'src/app/models/category';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';

const noop = () => {
};

export const STEP_THREE_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StepThreeComponent),
    multi: true
};

export interface ChooseProductDialogData {
  brandList: Observable<Brand[]>;
  selectedProducts: Product[];
}
@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.css'],
  providers: [STEP_THREE_CONTROL_VALUE_ACCESSOR],
  standalone: true,
  imports: [CommonModule, MatIconModule,MatChipsModule, MatListModule, MatButtonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatDividerModule],
})
export class StepThreeComponent implements OnInit, ControlValueAccessor {
  private innerProject = new Project();

  visible = true;
  selectable = true;
  removable = true;
  thirdFormGroup: FormGroup;
  selectedProducts: Product[] = [];
  listOfProducts = '';
  brandList: Observable<Brand[]>;

  constructor(private brandService: BrandService,
              private fb: FormBuilder,
              public dialog: MatDialog,
              private authService: AuthService) {
      this.thirdFormGroup = this.fb.group({
        productList: ['', Validators.required]
      });
    }
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;
  ngOnInit() {
    // this.brandList = this.store.pipe(select(getAllBrands));
  }
  remove(product: Product): void {
    const index = this.selectedProducts.indexOf(product);

    if (index >= 0) {
      this.selectedProducts.splice(index, 1);
      this.listOfProducts = this.selectedProducts.map(x => x.name).join(',');
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ChooseProductsDialogComponent, {
      width: '800px',
      data: {brandList: this.brandList, selectedProducts: this.selectedProducts}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.product.length > 0) {
        this.selectedProducts = result.product;
      } else {
        this.selectedProducts = [];
      }
      this.listOfProducts = this.selectedProducts.map(x => x.name).join(',');
    });
  }

  addDataToProject() {
    this.selectedProducts.map(c => {
      this.innerProject.projectProductList.push({
          projectId: this.innerProject.projectId,
          project: null,
          product: c,
          productId: c.productId,
          createUserId: this.authService.getDecodedToken().nameid
      });
    });
    this.listOfProducts = this.selectedProducts.map(x => x.name).join(',');
    this.onChangeCallback(this.innerProject);
  }

  writeValue(value: any) {
    if (value !== this.innerProject) {
        this.innerProject = value;
    }
  }


  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }


  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}

@Component({
  selector: 'app-choose-products-dialog',
  templateUrl: 'choose-products-dialog.html',
  styleUrls: ['./step-three.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule, MatDialogModule],
})
export class ChooseProductsDialogComponent implements OnInit {
  productForm: FormGroup;
  productItems: FormArray;
  selectedBrand: Brand;
  selectedCategoryList: Observable<Category[]>;
  brandProducts: Product[] = [];
  public allProducts: Product[] = [];
  public count = 12;
  public sort: string;
  public viewType = 'grid';
  public viewCol = 33.3;
  public searchFields: Search = new Search({
    brandsBox: [],
    categoriesBoxNested: [],
    categoriesBox: [],
    brandCollectionBox: [],
    fileTypes: [],
    imageUploaded: '',
    searchBox: '',
    vertical: false
  });
  public pagination: Pagination = new Pagination(0, this.count, null, null);
  public isLoading = false;
  public message: string;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ChooseProductsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChooseProductDialogData,
    private authService: AuthService) {
    }
    ngOnInit() {
      this.productForm = this.formBuilder.group({
        brandList:          new FormControl(''),
        categoryList:               new FormControl(''),
        productItems: this.formBuilder.array([])
      });
    }
    selectBrand(event) {
      // this.store.pipe(select(getBrandById(this.productForm.get('brandList').value.displayId)),
      // tap((brand) => {
      //   if (brand) {
      //     this.selectedBrand = brand;
      //     this.searchFields.brandsBox = [];
      //     this.selectedCategoryList =
      //       this.store.pipe(select(getCategoryListById(this.selectedBrand.brandCategoryList.map(y => y.categoryId))));
      //     this.searchFields.brandsBox.push(this.selectedBrand);
      //   }
      // })).subscribe();
    }
    selectCategory(event) {
      this.searchFields.categoriesBoxNested = [];
      this.searchFields.categoriesBoxNested.push(this.productForm.get('categoryList').value);
      this.getBrandProducts();
    }
    getBrandProducts() {
      this.searchFields.brandsBox.push(this.selectedBrand);
      this.isLoading = true;
    //   this.store.pipe(select(getBrandCategoryProducts(this.selectedBrand.brandId,
    //     this.searchFields.categoriesBoxNested[0].categoryId)),
    // tap((product) => {
    //   this.isLoading = false;
    //   this.brandProducts = product;
    //   this.productItems = this.productForm.get('productItems') as FormArray;
    //   if (product.length === this.selectedBrand.brandCategoryList
    //     .filter(x => x.categoryId === this.searchFields.categoriesBoxNested[0].categoryId)[0].totalProducts) {
    //       product.map(x => {
    //         this.productItems.push(this.createProductItem());
    //       });
    //     }
    //   if (product.length <
    //       this.selectedBrand.brandCategoryList
    //       .filter(x => x.categoryId === this.searchFields.categoriesBoxNested[0].categoryId)[0].totalProducts) {
    //                 this.store.dispatch(new GetBrandProductsByCategoryRequest(
    //                   this.authService.getDecodedToken().nameid,
    //                   this.selectedBrand.brandId,
    //                   this.searchFields.categoriesBoxNested[0].categoryId));
    //             }
    // })).subscribe();
    }
    selectProduct(event, product) {
      if (event.checked) {
        this.data.selectedProducts.push(product);
      } else {
        this.data.selectedProducts.splice(this.data.selectedProducts.indexOf(product)[0], 1);
      }
    }


    //////////// VRAY //////////////////
  createProductItem(): FormGroup {
    return this.formBuilder.group({
      productItem: false
    });
  }
  productDeleted(event) {
    const index = this.productForm.get('productVRayFiles').value.indexOf(event);
    this.productItems.removeAt(index);
  }

  productSelected(event) {
    this.productForm.get('productItems').value.map((product, i) => {
    this.data.selectedProducts.push(product);
  });
  }
  ////////////////////////////////////
  

  onNoClick(): void {
    this.dialogRef.close();
  }
  save() {
    this.data.selectedProducts = this.productForm.get('productItems').value
      .map((v, i) => {
        return v.productItem ? this.brandProducts[i] : null;
      })
      .filter(v => v !== null);
    this.dialogRef.close({action: 'save', product: this.data.selectedProducts});
  }

  public onPageChange(e) {
    this.pagination.currentPage = e.pageIndex ;
    this.getBrandProducts();
    window.scrollTo(0, 0);
  }

}
