import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from '../../app.service';
import { Category } from 'src/app/models/category';
import { BehaviorSubject, Observable } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { ProjectCategory } from 'src/app/models/project-category';
import { User } from 'src/app/models/user';
import { ProjectSearch } from 'src/app/models/project-search';
import { map } from 'rxjs/operators';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-projects-search',
  templateUrl: './projects-search.component.html',
  styleUrls: ['./projects-search.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, FlexLayoutModule, ReactiveFormsModule],
})
export class ProjectsSearchComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() variant = 1;
  @Input() vertical = false;
  @Input() searchOnBtnClick = false;
  @Input() removedSearchField: string;
  @Output() SearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() SearchClick: EventEmitter<any> = new EventEmitter<any>();
  public selectedCategories: any[] = [];
  public showMore = false;
  public verticalForm: FormGroup;
  @Input() categories: BehaviorSubject<ProjectCategory[]> = new BehaviorSubject([]);
  public designers: Observable<User[]>;
  public propertyTypes = [];
  public searchFields = new ProjectSearch({
    searchId: 1,
    designersBox: [],
    categoriesBox: [],
    searchBox: ''
  });
  public allFileTypes: any[] = [
    {label: 'تصاویر', value: {id: 1, name: 'تصاویر', code: 'im'}},
    {label: 'اشیا', value: {id: 2, name: 'اشیا', code: 'ob'}},
    {label: 'بافت ها', value: {id: 3, name: 'بافت ها', code: 'tx'}},
    {label: 'کاتالوگ', value: {id: 4, name: 'کاتالوگ', code: 'cg'}},
    {label: 'اطلاعات فنی', value: {id: 5, name: 'اطلاعات فنی', code: 'ti'}}
];

  public cities = [];
  public neighborhoods = [];
  public streets = [];
  public features = [];

  constructor(public appService: AppService,
    public basicDataService: BasicDataService,
              public fb: FormBuilder) { }

  ngOnInit() {
    if (this.vertical) {
      // this.store.pipe(select(getAllProjectSearches),
      // map((search) => {
      //   if (search[0]) {
      //     this.searchFields = search[0];
      //     this.selectedCategories = search[0].categoriesBox;
      //   }
      // })).subscribe();
      this.showMore = true;
    }

    this.verticalForm = this.fb.group({
      searchBox: null,
      categoriesBox: null,
      designersBox: null
    });

    this.SearchChange.emit(this.verticalForm);
  }

  public buildFeatures() {
    const arr = this.features.map(feature => {
      return this.fb.group({
        id: feature.id,
        name: feature.name,
        selected: feature.selected
      });
    });
    return this.fb.array(arr);
  }


  ngOnChanges() {
    if (this.removedSearchField) {
      if (this.removedSearchField.indexOf('.') > -1) {
        const arr = this.removedSearchField.split('.');
        this.verticalForm.controls[arr[0]]['controls'][arr[1]].reset();
      } else if (this.removedSearchField.indexOf(',') > -1) {
        const arr = this.removedSearchField.split(',');
        this.selectedCategories = this.selectedCategories.filter(x => x.id !== +arr[1]);
        this.searchFields.categoriesBox = this.selectedCategories;
        this.SearchChange.emit(this.verticalForm);
        this.verticalForm.get('categoriesBox').setValue(this.selectedCategories);
      } else {
        this.verticalForm.controls[this.removedSearchField].reset();
      }
    }
  }

  public reset() {
    this.verticalForm.reset({
      fileType: null,
      searchBox: null,
      categoriesBox: null,
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
    // this.designers = this.store.select(getAllDesigners);
    // this.projectCategories = this.store.select(getAllProjectCategories);
  }
  public categoryChanged(event) {
    if (event) {
      this.selectedCategories = [...event];
      this.searchFields.categoriesBox = this.selectedCategories;
      // this.store.dispatch(new SaveProjectSearchForRequest(this.searchFields));
      this.SearchChange.emit(this.verticalForm);
    }
  }
}
