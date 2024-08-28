import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { BrandCollectionsComponent } from '../brand-collections/brand-collections.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrandSearch } from '../../models/brand-search';
import { Category } from '../../models/category';
import { CategoriesComponent } from '../../pages/categories/categories.component';

@Component({
  selector: 'app-brand-detail-search',
  templateUrl: './brand-detail-search.component.html',
  styleUrls: ['./brand-detail-search.component.css'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatCardModule, MatExpansionModule,  FlexLayoutModule, BrandCollectionsComponent, CategoriesComponent, ReactiveFormsModule],
})
export class BrandDetailSearchComponent implements OnInit, AfterViewInit {
  @Input() brandId = '';
  @Input() variant = 1;
  @Input() vertical = false;
  @Input() searchOnBtnClick = false;
  @Input()
  removedSearchField!: string;
  @Output() SearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() SearchClick: EventEmitter<any> = new EventEmitter<any>();
  public selectedCategories: any[] = [];
  public selectedFileTypes: any[] = [];
  public selectedBrands: any[] = [];
  public selectedBrandCollections: any[] = [];
  public searchFields: BrandSearch = new BrandSearch({
    searchId: 1,
    categoriesBoxNested: [],
    brandCollectionBox: [],
    searchBox: ''
  });
  public showMore = false;
  public form!: FormGroup;
  public categories!: Observable<Category[]>;
  public fb= inject( FormBuilder);
  private route= inject( ActivatedRoute);
  private router= inject( Router);
  constructor(
              ) {
                // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
               }

  ngOnInit() {
    if (this.vertical) {
      this.route.queryParams
      .subscribe(params => {
        this.searchFields.categoriesBoxNested = [];
        if (params['categories']) {
          this.searchFields.categoriesBoxNested.push(params['categories']);
        }
        if (params['filter']) {
          this.searchFields.searchBox = params['filter'];
        }
      });
      // this.store.pipe(select(getAllBrandSearches),
      // map((search) => {
      //   if (search[0]) {
      //     this.searchFields = search[0];
      //     this.selectedCategories = search[0].categoriesBoxNested;
      //   }
      // })).subscribe();
      this.showMore = true;
    }

    this.form = this.fb.group({
      searchBox: null,
      categoriesBoxNested: null,
      brandCollectionBox: null
    });
    this.SearchChange.emit(this.form);
  }

  ngOnChanges() {
    if (this.removedSearchField) {
      if (this.removedSearchField.indexOf('.') > -1) {
        const arr = this.removedSearchField.split('.');
        // this.form.controls[arr[0]]['controls'][arr[1]].reset();
      } else if (this.removedSearchField.indexOf(',') > -1) {
        const arr = this.removedSearchField.split(',');
        this.selectedCategories = this.selectedCategories.filter(x => !x.categoryId.toString().startsWith(arr[1]));
        this.searchFields.categoriesBoxNested = this.selectedCategories;
        // this.store.dispatch(new SaveBrandSearchForRequest(this.searchFields));
        this.form.get('categoriesBoxNested')!.setValue(this.selectedCategories);
      } else {
        this.form.controls[this.removedSearchField].reset();
      }
    }
  }

  public reset() {
    this.form.reset({
      searchBox: null,
      categoriesBoxNested: null,
      brandCollectionBox: null
    });
  }

  public search() {
    this.SearchClick.emit();
  }

  public onSelectCity() {
    this.form.controls['neighborhood'].setValue(null, {emitEvent: false});
    this.form.controls['street'].setValue(null, {emitEvent: false});
  }
  public onSelectNeighborhood() {
    this.form.controls['street'].setValue(null, {emitEvent: false});
  }

  public getAppearance() {
    return (this.variant !== 3) ? 'outline' : '';
  }
  public getFloatLabel() {
    return (this.variant === 1) ? 'always' : '';
  }
  ngAfterViewInit() {
    // this.categories = this.store.select(getAllCategories);
    if (this.searchFields.categoriesBoxNested.length > 0) {
      this.SearchChange.emit(this.form);
      // this.store.pipe(select(getCategoryListById(this.searchFields.categoriesBoxNested.map(x => x.categoryId))),
      // map(cat => {
      //   if (cat && cat.length > 0 && cat[0]) {
      //     this.selectedCategories = [...cat];
      //     this.form.get('categoriesBoxNested').setValue(this.selectedCategories);
      //   }
      // })).subscribe();
    }
  }

  public categoryChanged(event: any) {
    if (event) {
      this.selectedCategories = [...event];
      this.searchFields.categoriesBoxNested = this.selectedCategories;
      // this.store.dispatch(new SaveBrandSearchForRequest(this.searchFields));
      this.form.get('categoriesBoxNested')!.setValue(this.selectedCategories);
      this.SearchChange.emit(this.form);
    }
  }
  public brandCollectionsChanged(event: any) {
    if (event) {
      this.selectedBrandCollections = [...event];
      this.searchFields.brandCollectionBox = this.selectedBrandCollections;
      // this.store.dispatch(new SaveBrandSearchForRequest(this.searchFields));
      this.form.get('brandCollectionBox')!.setValue(this.selectedBrandCollections);
      this.SearchChange.emit(this.form);
    }
  }
}