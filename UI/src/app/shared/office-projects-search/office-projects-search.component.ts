import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderCarouselComponent } from '../header-carousel/header-carousel.component';
import { HeaderImageComponent } from '../header-image/header-image.component';
import { OfficeProjectItemComponent } from '../office-project-item/office-project-item.component';
import { OfficeProjectsSearchResultsFiltersComponent } from '../office-projects-search-results-filters/office-projects-search-results-filters.component';

import { DesignOffice } from '../../models/design-office';
import { OfficeProjectCategory } from '../../models/office-project-category';
import { OfficeProjectSearch } from '../../models/office-project-search';
import { AuthService } from '../../services/auth.service';
import { BasicDataService } from '../../services/basic-data.service';

@Component({
  selector: 'app-office-projects-search',
  templateUrl: './office-projects-search.component.html',
  styleUrls: ['./office-projects-search.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatCardModule, ReactiveFormsModule]
})
export class OfficeProjectsSearchComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() variant = 1;
  @Input() vertical = false;
  @Input() searchOnBtnClick = false;
  @Input()
  removedSearchField!: string;
  @Output() SearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() SearchClick: EventEmitter<any> = new EventEmitter<any>();
  public searchInput: FormControl = new FormControl('');
  public selectedCategories: any[] = [];
  public selectedDesigners: any[] = [];
  public showMore = false;
  public verticalForm!: FormGroup;
  @Input()
  categories!: BehaviorSubject<OfficeProjectCategory[]>;
  @Input()
  designers!: BehaviorSubject<DesignOffice[]>;
  public projectCategories!: OfficeProjectCategory[];
  public designOffices!: DesignOffice[];
  
  public propertyTypes = [];
  public searchFields = new OfficeProjectSearch({
    searchId: 1,
    designers: [],
    categories: [],
    searchBox: ''
  });
  private authService= inject(AuthService);
  public fb= inject( FormBuilder);
  public basicDataService= inject( BasicDataService);
  private cdr= inject( ChangeDetectorRef);



  constructor(
              ) { }

  ngOnInit() {
    this.basicDataService.getProjectCategories().subscribe((x: any) => {
      this.projectCategories = x.projectType.map((x1:any) => ({
       id: x1.idNumeric,
       categoryName: x1.displayText,
      
      } as OfficeProjectCategory));
      this.categories.next(this.projectCategories);
     })
     this.basicDataService.getDesignOffices().subscribe((x: any) => {
      this.designOffices = x.designOffice.map((x1:any) => ({
       id: x1.contentItemId,
       name: x1.displayText,
      
      } as DesignOffice));
      this.designers.next(this.designOffices);
     })
    if (this.vertical) {
      this.verticalForm = this.fb.group({
        searchBox: null,
        categories: null,
        designers: null
      });
      this.showMore = true;
    }

    

   
  }




  ngOnChanges() {
    if (this.removedSearchField) {
      if (this.removedSearchField.indexOf('.') > -1) {
        const arr = this.removedSearchField.split('.');
        // this.verticalForm.controls[arr[0]]['controls'][arr[1]].reset();
      } else if (this.removedSearchField.indexOf(',') > -1) {
        const arr = this.removedSearchField.split(',');
        if (arr[0] === 'categories'){
          this.selectedCategories = this.selectedCategories.filter(x => x.id !== +arr[1]);
          this.searchFields.categories = this.selectedCategories;
        }
        if (arr[0] === 'designers'){
          
          this.selectedDesigners = this.selectedDesigners.filter(x => x.id !== arr[1]);
          this.searchFields.designers = this.selectedDesigners;
        }
        
        this.verticalForm.get('categories')!.setValue(this.selectedCategories);
        this.verticalForm.get('designers')!.setValue(this.selectedDesigners);
        this.SearchChange.emit(this.verticalForm);
      }
      else if(this.removedSearchField === "hashtagObject") {
        this.SearchChange.emit(this.verticalForm);
      }
      else {
        this.verticalForm.controls[this.removedSearchField].reset();
      }
    }
  }

  public reset() {
    this.verticalForm.reset({
      fileType: null,
      searchBox: this.searchInput,
      categories: null,
      brandsBox: null
    });
  }

  public search() {
    this.SearchClick.emit();
  }

 

  public getAppearance() {
    return (this.variant !== 3) ? 'outline' : '';
  }
  public getFloatLabel() {
    return (this.variant === 1) ? 'always' : '';
  }
  ngAfterViewInit() {
   
    this.cdr.detectChanges();
    this.searchInput.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.SearchChange.emit(this.verticalForm);
        })
    )
    .subscribe();
  }
  public categoryChanged(event: { value: any; }) {
    if (event) {
      this.selectedCategories = [...event.value];
      this.searchFields.categories = this.selectedCategories;
      // this.store.dispatch(new SaveOfficeProjectSearchForRequest(this.searchFields));
      this.SearchChange.emit(this.verticalForm);
    }
  }
  public designerChanged(event: { value: any; }) {
    if (event) {
      this.selectedDesigners = [...event.value];
      this.searchFields.designers = this.selectedDesigners;
      // this.store.dispatch(new SaveOfficeProjectSearchForRequest(this.searchFields));
      this.SearchChange.emit(this.verticalForm);
    }
  }
}
