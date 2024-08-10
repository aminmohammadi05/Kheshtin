import { Component, OnInit, forwardRef, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormBuilder, Form, FormGroup, FormControl } from '@angular/forms';
import { BrandCollectionService } from 'src/app/services/brand-collection.service';
import { AuthService } from 'src/app/services/auth.service';
import { OfficeProjectCategoriesListDatabase } from 'src/app/services/office-project-categories-list-database';
import { OfficeProjectCategory } from 'src/app/models/office-project-category';
import { OfficeProjectService } from 'src/app/services/office-project.service';

@Component({
  selector: 'app-office-project-categories',
  templateUrl: './office-project-categories.component.html',
  styleUrls: ['./office-project-categories.component.css'],
  providers: [OfficeProjectCategoriesListDatabase,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OfficeProjectCategoriesComponent),
      multi: true
    }]
})
export class OfficeProjectCategoriesComponent implements OnInit, AfterViewInit {
  officeProjectCategoriesForm: FormGroup;
  officeProjectCategoriesList: OfficeProjectCategory[] = [];
  @Input() selectedIdList: OfficeProjectCategory[] = [];
  @Output() OfficeProjectCategoryChange: EventEmitter<any> = new EventEmitter<any>();
  constructor(private database: OfficeProjectCategoriesListDatabase,
              public fb: FormBuilder,
              private officeProjectService: OfficeProjectService,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService) {
              }

  toFormGroup(collections: OfficeProjectCategory[] ) {
    let group: any = {};

    collections.forEach(coll => {
      group[coll.id] = new FormControl(false);
    });
    return new FormGroup(group);
  }
  ngOnInit() {
    this.database.dataChange.subscribe(data => {
      this.officeProjectCategoriesList = data;
      this.officeProjectCategoriesForm = this.toFormGroup(this.officeProjectCategoriesList);
    });
  }
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }


  writeValue(value: OfficeProjectCategory[]) {
    if (value != null && value) {

      this.selectedIdList = value;
      // if (this.selectedIdList && this.selectedIdList.length > 0 ) {
      //   const diff = this.checklistSelection.selected.map(x => x.id)
      //    .filter(x => !this.selectedIdList.map(z => z.categoryId).includes(x));
      //   this.selectedIdList.map(y => {
      //     const catFlat = this.treeControl.dataNodes.filter(x => x.id === y.categoryId)[0];
      //     if (catFlat.expandable) {
      //       this.checklistSelection.select(catFlat);
      //       const descendants = this.treeControl.getDescendants(catFlat);
      //       this.checklistSelection.select(...descendants);
      //             } else {
      //               this.checklistSelection.select(catFlat);
      //     }
      //   });
      //   diff.map(y => {
      //     const catFlat = this.treeControl.dataNodes.filter(x => x.id === y)[0];
      //     if (catFlat.expandable) {
      //       this.checklistSelection.deselect(catFlat);
      //       const descendants = this.treeControl.getDescendants(catFlat);
      //       this.checklistSelection.deselect(...descendants);
      //     } else {
      //       this.checklistSelection.deselect(catFlat);
      //     }
      //   });
      // }
    }
  }
  propagateChange = (_: any) => {};

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  selectNodes(event, id: OfficeProjectCategory) {
    if (event.checked) {
      this.selectedIdList.push(id);
    } else {
      const index = this.selectedIdList.indexOf(id);
      if (index !== -1) {
        this.selectedIdList.splice(index, 1);
      }
    }
    this.propagateChange(this.selectedIdList);
    const selectedOfficeProjectCategories: OfficeProjectCategory[] = [];
    this.OfficeProjectCategoryChange.emit(this.selectedIdList);
  }
}
