import { AfterViewInit, OnInit, Component, Input, Inject, ChangeDetectorRef, ElementRef, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridsterModule, GridType } from 'angular-gridster2';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Category } from 'src/app/models/category';
import { MoodBoardProduct } from 'src/app/models/moodboard-product';
import { Pagination } from 'src/app/models/pagination';
import { ProductMoodBoardSearch } from 'src/app/models/product-mood-board-search';
import { AuthService } from 'src/app/services/auth.service';
import { UserMoodBoard } from 'src/app/models/user-moodboard';
import * as uuid from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { MoodBoardExtraInfoComponent } from './mood-board-extra-info-dialog.component';
import { MoodBoardDataSource } from 'src/app/services/mood-board-data-source';
import { MoodBoardProductDataSource } from 'src/app/services/mood-board-product-data-source';
import { MoodBoardCandidateProductDataSource } from 'src/app/services/mood-board-candidate-product-data-source';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';
import { UserMoodBoardCandidateProductSearch } from 'src/app/models/user-mood-board-candidate-product-search';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { UserMoodBoardCandidateProduct } from 'src/app/models/user-mood-board-candidate-product';
import { DesignMoodBoardProduct } from 'src/app/models/design-mood-board-product';
import { DesignMoodBoardProductSearch } from 'src/app/models/design-mood-board-product-search';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ProductMoodBoardSearchComponent } from 'src/app/shared/product-mood-board-search/product-mood-board-search.component';
import { MoodBoardProductItemComponent } from 'src/app/shared/mood-board-product-item/mood-board-product-item.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TileLayersComponent } from './tile-layers/tile-layers.component';
import { FlexLayoutModule } from '@angular/flex-layout';

export interface ProductMoodBoardData {
  isCandidateProducts: boolean;
  products: Observable<DesignMoodBoardProduct[]>;
  candidateProducts: Observable<UserMoodBoardCandidateProduct[]>;
  currentProducts: DesignMoodBoardProduct[];
  selectedProducts: DesignMoodBoardProduct[];
  moodBoard: UserMoodBoard;
  index: number;
}
export interface Tile {
  product: DesignMoodBoardProduct;
  cols: number;
  rows: number;
}

@Component({
  selector: 'app-design-mood-board',
  templateUrl: './design-mood-board.component.html',
  styleUrls: ['./design-mood-board.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatTabsModule, MatFormFieldModule, MatCardModule, FlexLayoutModule, MatDividerModule, MatProgressSpinnerModule, MatPaginatorModule, GridsterModule, ReactiveFormsModule, ProductMoodBoardSearchComponent, MoodBoardProductItemComponent, TileLayersComponent]
})
export class DesignMoodBoardComponent implements OnInit, AfterViewInit, OnDestroy {
    options: GridsterConfig;
    tiles: Array<GridsterItem>;
    public settings: Settings;
    public moodBoard: UserMoodBoard;
    public viewType = 'grid';
    public viewCol = 15;
    public allProducts: DesignMoodBoardProduct[] = [];
    public products: DesignMoodBoardProduct[] = [];
    public currentProducts: DesignMoodBoardProduct[] = [];
    public selectedProducts: MoodBoardProduct[] = [];
    public selectedCategories: Category[] = [];
    public isLoading = false;
    public totalProducts: Observable<number>;
    public removedSearchField: string;
    public count = 9;
    public sort: string;
    public message: string;
    @ViewChild('screen', { static: true }) screen: any;
    @ViewChild('gridster', { static: true }) gridster: any;
    public color1 = '#c8c8c8';
    public selectedColor: any = {'background-color' : '#c8c8c8' };
    isCandidateProducts = false;
    isCapturing = false;
    counter = 0;
    public categoryList$: Observable<Category[]>;
    @ViewChild(MatTabGroup, { static: true }) tabGroup: MatTabGroup;
    public searchFields = new DesignMoodBoardProductSearch({
      searchId: 1,
      brandsBox: [],
      categoriesBox: [],
      colorsBox: [],
      materialsBox: [],
      pageQuery: new Pagination(0, this.count, null, null)
    });
    public candidateSearchFields = new UserMoodBoardCandidateProductSearch({
      searchId: 1,
      brandsBox: [],
      categoriesBox: [],
      colorsBox: [],
      materialsBox: [],
      pageQuery: new Pagination(0, this.count, null, null)
    });
    public dataSource: MoodBoardProductDataSource;
    public candidateDataSource: MoodBoardCandidateProductDataSource;
    moodBoardId: string;
    private dialogRef: MatDialogRef<MoodBoardExtraInfoComponent>;
    constructor(public appSettings: AppSettings,
                private authService: AuthService,
                public dialog: MatDialog,
                private activatedRoute: ActivatedRoute,
                private cdr: ChangeDetectorRef,
                private productService: ProductsService,
                private candidateProductService: UserService,
                private router: Router,
                public productsDialog: MatDialog) {
      this.settings = this.appSettings.settings;
    }
    ngOnDestroy(): void {
    }
    public onEventLog(event: string, data: any): void {
      this.selectedColor =  {'background-color' : data } ;
    }
    public saveImage() {

      this.dialogRef = this.dialog.open(MoodBoardExtraInfoComponent, {
        panelClass: 'calendar-form-dialog',
        data: {
          action: 'edit',
          userMoodBoard: this.moodBoard
        },
        width: '800px'
      });
      this.dialogRef.afterClosed()
        .subscribe((res) => {
          if (!res) {
            return;
          }
          let dialogAction = res.action;
          const responseUserMoodBoard = res.userMoodBoard;

          this.moodBoard.moodBoardName = responseUserMoodBoard.moodBoardName;
          this.moodBoard.moodBoardDescription = responseUserMoodBoard.moodBoardDescription;
          this.moodBoard.backgroundColor = this.color1.replace('#', '');
          this.moodBoard.moodBoardProductList = this.selectedProducts;
          this.moodBoard.totalCols = this.gridster.columns;
          this.moodBoard.totalRows = this.gridster.rows;
          this.moodBoard.createUserId = this.authService.getDecodedToken().nameid;
          // this.store.dispatch(new SaveMoodBoardAuthRequest(this.authService.getDecodedToken().nameid, this.moodBoard));
        }
      );

    }
    newMoodBoard() {
      this.moodBoard = new UserMoodBoard({
        moodBoardId: uuid.v4(),
        moodBoardName: '',
        moodBoardDescription: '',
        backgroundColor: '',
        moodBoardProductList:  [],
      });
    }

      ngOnInit() {
         
        // this.store.dispatch(new SaveProductMoodBoardSearchForRequest(this.searchFields));
        // this.store.dispatch(new SaveCandidateProductSearchForRequest(this.candidateSearchFields));
        this.tabGroup.selectedIndex = this.isCandidateProducts ? 1 : 0;
        this.dataSource = new MoodBoardProductDataSource(this.productService, this.authService);
        this.candidateDataSource = new MoodBoardCandidateProductDataSource(this.candidateProductService, this.authService);
        this.activatedRoute.params.subscribe(params => {
          if (params && params.moodBoardId && uuid.validate(params.moodBoardId)) {
            this.moodBoardId = params.moodBoardId;
            // this.store.pipe(select(getMoodBoardByDisplayId(this.moodBoardId)),
            // map((moodBoard) => {
            //   if (moodBoard) {
            //     this.moodBoard = moodBoard;
            //   } else {
            //     this.getMoodBoard(this.moodBoardId);
            //   }
            // })).subscribe();
          } else {
            this.newMoodBoard();
          }
        });
        // this.store.pipe(select(getAllDesignMoodBoardProductSearches),
        // tap((searches) => {
        //   if (searches && searches.length > 0) {
        //     this.searchFields = searches[0];

        //   } else {
        //     this.store.dispatch(new SaveDesignMoodBoardProductSearchForRequest(this.searchFields));
        //   }})).subscribe();
       
        this.options = {
            gridType: GridType.Fit,
            compactType: CompactType.None,
            margin: 0,
            outerMargin: true,
            outerMarginTop: null,
            outerMarginRight: null,
            outerMarginBottom: null,
            outerMarginLeft: null,
            mobileBreakpoint: 640,
            minCols: 10,
            minRows: 10,
            defaultItemCols: 1,
            defaultItemRows: 1,
            fixedColWidth: 105,
            fixedRowHeight: 105,
            enableEmptyCellClick: false,
            enableEmptyCellContextMenu: false,
            enableEmptyCellDrop: false,
            enableEmptyCellDrag: false,
            emptyCellDragMaxCols: 50,
            emptyCellDragMaxRows: 50,
            ignoreMarginInRow: false,
            draggable: {
              delayStart: 0,
              enabled: true,
              ignoreContentClass: 'gridster-item-content',
              ignoreContent: false,
              dragHandleClass: 'drag-handler'
            },
            resizable: {
              delayStart: 0,
              enabled: true,
              handles: {
                s: true, e: true, n: true, w: true,
                se: true, ne: true, sw: true, nw: true
              }
            },
            swap: false,
            pushItems: true,
            disablePushOnDrag: false,
            disablePushOnResize: false,
            pushDirections: {north: true, east: true, south: true, west: true},
            pushResizeItems: false,
            displayGrid: DisplayGrid.OnDragAndResize,
            disableWindowResize: false,
            disableWarnings: false,
            scrollToNewItems: false,
            allowMultiLayer: true,

          };
        this.dataSource.loadProducts();
        // this.candidateDataSource.loadProducts();

        // this.categoryList$ = this.store.pipe(select(getAllCategoriesForQuickAccess));
      }

      changedOptions() {
        this.options.api.optionsChanged();
      }

      removeItem($event, item) {
      $event.preventDefault();
      $event.stopPropagation();
      this.selectedProducts.splice(this.selectedProducts.indexOf(item), 1);
      const prod = this.currentProducts
      .filter(x => x.productId === item.productId && x.productFiles
        .filter(y => y.productFileId === item.productFileId && y.fileType === 12)[0])[0];
      this.currentProducts.splice(this.currentProducts.indexOf(prod), 1);
    }

      addItem() {
        // this.selectedProducts.push({});
      }
    ngAfterViewInit() {

    }
    public searchClicked() {
      this.getProducts();
      window.scrollTo(0, 0);
    }
    public getChildCategories(categories: Category[]): Promise<Category[]>{
      // return this.store.pipe(select(getAllCategoriesFlat),    
      // map(cats => {
      //   let children: Category[] = [];
      //   categories.map(y => {
      //     const c = cats.filter(x => x.categoryId.toString().startsWith(y.categoryId.toString()));
      //     children = [...children, ...c];
      //   });
      //   cats = children;
      //   return cats;
      // }), take(1)).toPromise();
      return of([]).toPromise();
    }
    public async searchChanged(event) {
      if (event) {
        if (!this.isCandidateProducts) {
          this.searchFields = new DesignMoodBoardProductSearch({
            searchId: 1,
            brandsBox: event.brandsBox &&
            event.brandsBox.length > 0 ? event.brandsBox : [],
            categoriesBox: event.categoriesBox &&
               event.categoriesBox.length > 0 ? await this.getChildCategories(event.categoriesBox) : [],
            colorsBox: event.colorsBox &&
            event.colorsBox.length > 0 ? event.colorsBox : [],
            materialsBox: event.materialsBox &&
            event.materialsBox.length > 0 ? event.materialsBox : [],
            searchBox: event.searchBox &&
            event.searchBox.length > 0 ? event.searchBox : 'filter=',
            pageQuery: new Pagination(0, this.count, null, null)
          });
          // this.store.dispatch(new ResetDesignMoodBoardProductsRequest());
          // this.store.dispatch(new SaveDesignMoodBoardProductSearchForRequest(this.searchFields));
        } else {
          this.candidateSearchFields = new UserMoodBoardCandidateProductSearch({
            searchId: 1,
            brandsBox: event.brandsBox &&
            event.brandsBox.length > 0 ? event.brandsBox : [],
            categoriesBox: event.categoriesBox &&
               event.categoriesBox.length > 0 ? await this.getChildCategories(event.value.categoriesBox) : [],
            colorsBox: event.colorsBox &&
            event.colorsBox.length > 0 ? event.colorsBox : [],
            materialsBox: event.materialsBox &&
            event.materialsBox.length > 0 ? event.materialsBox : [],
            searchBox: event.searchBox &&
            event.searchBox.length > 0 ? event.searchBox : 'filter=',
            pageQuery: new Pagination(0, this.count, null, null)
          });
          // this.store.dispatch(new SaveCandidateProductSearchForRequest(this.candidateSearchFields));
        }
        setTimeout(() => {
            this.removedSearchField = null;
          });
        if (!this.settings.searchOnBtnClick) {
            this.products.length = 0;
          }
        if (!this.settings.searchOnBtnClick) {
            this.getProducts();
          }
      }

    }
    onPageChange(event) {
      this.searchFields = new DesignMoodBoardProductSearch({
        searchId: 1,
        pageQuery: new Pagination(event.pageIndex, event.pageSize, event.length, null)
      });
      // this.store.dispatch(new SaveDesignMoodBoardProductSearchForRequest(this.searchFields));
    }
    onCandidatePageChange(event) {
      this.candidateSearchFields = new UserMoodBoardCandidateProductSearch({
        searchId: 1,
        pageQuery: new Pagination(event.pageIndex, event.pageSize, event.length, null)
      });
      // this.store.dispatch(new SaveCandidateProductSearchForRequest(this.candidateSearchFields));
    }

    public getProducts() {
      this.isLoading = true;
      // this.totalProducts = this.store.select(totalProducts);
      if (this.isCandidateProducts) {
        this.candidateDataSource.loadProducts();
      } else {
        this.dataSource.loadProducts();
      }
    }

    public getMyProducts(event) {
     
      this.isCandidateProducts = event.target.checked;
      this.tabGroup.selectedIndex = event.target.checked ? 1 : 0;
      this.getProducts();
    }

    public openPopUpDialog(index) {
      this.productsDialog.open(MoodBoardProductDetailDialogComponent, {
        width: '900px',
        data: {
          products: this.dataSource.products$,
          isCandidateProducts: this.isCandidateProducts,
          candidateProducts: this.candidateDataSource.products$,
          currentProducts: this.currentProducts,
          selectedProducts: this.selectedProducts,
          moodBoard: this.moodBoard,
          index: index
        }
      });
    }

    public categoryChange(category: Category) {
      // this.store.pipe(select(getAllCategoriesFlat),
      //   tap(cats => {
      //     let children = cats.filter(x => x.categoryId.toString().startsWith(category.categoryId.toString()))
      //     this.selectedCategories = children;
      //   })
      // ).subscribe();
    }

    layerChange(event) {
      this.cdr.detectChanges();
    }
    public getFileIdByColor(product: MoodBoardProduct)  {
      const prod = this.currentProducts.filter(x => x.productId === product.productId)[0];
      return this.searchFields.colorsBox.length > 0 && prod.productFiles.filter(x => x.color === this.searchFields.colorsBox[0])[0] ?
      {"background-image" : "url('../../assets/products/big/"+ product.productId + "_12_-1_" + prod.productFiles.filter(x => x.color === this.searchFields.colorsBox[0])[0].productFileId + "_0.png');"}
      : {"background-image" : "url('../../assets/products/big/"+ product.productId + "_12_-1_1_0.png');"};
    }

    public getMoodBoard(id) {
      // if (this.authService.loggedIn()) {
      //   this.store.dispatch(new OneMoodBoardAuthRequest(id, this.authService.getDecodedToken().nameid));
      // } else {
      //   this.store.dispatch(new OneMoodBoardRequest(id));
      // }
    }


}

@Component({
  selector: 'app-mood-board-product-detail-dialog',
  templateUrl: 'mood-board-product-detail-dialog.html',
})
export class MoodBoardProductDetailDialogComponent implements OnInit {
  public settings: Settings;
  public selectedIndex = 1;
  public selectedImageId: number;
  products: Observable<DesignMoodBoardProduct[]>;
  isCandidateProducts: boolean;
  candidateProducts: Observable<UserMoodBoardCandidateProduct[]>;
  moodBoard: UserMoodBoard;
  currentProducts: DesignMoodBoardProduct[] = [];
  selectedProducts: DesignMoodBoardProduct[] = [];
  @Input() variant = 1;
  reqform: FormGroup;
  constructor(public appSettings: AppSettings,
              public dialogRef: MatDialogRef<MoodBoardProductDetailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProductMoodBoardData,
              public fb: FormBuilder) {
      this.settings = this.appSettings.settings;
      this.products = this.data.products;
      this.candidateProducts = this.data.candidateProducts;
      this.isCandidateProducts = this.data.isCandidateProducts;
      this.selectedProducts = this.data.selectedProducts;
      this.selectedIndex = this.data.index;
      this.moodBoard = this.data.moodBoard;
      this.currentProducts = this.data.currentProducts;
}
ngOnInit() {
  this.selectedImageId = 1;
  

}
// selectImage(index) {
//   this.selectedIndex = index;
//   let image = null;
//   this.selectedImageId = this.product.productFiles[index].productFileId;
// }
public getAppearance() {
  return (this.variant !== 3) ? 'outline' : '';
}
public getFloatLabel() {
  return (this.variant === 1) ? 'always' : '';
}
save() {
  this.dialogRef.close({action: 'save', selectedProducts: this.selectedProducts});
}
close() {
  this.dialogRef.close({action: 'delete'});
}

}
