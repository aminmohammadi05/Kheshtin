import { Component, OnInit, forwardRef, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormBuilder, Form, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { BrandCollection } from '../../models/brand-collection';
import { AuthService } from '../../services/auth.service';
import { BrandCollectionListDatabase } from '../../services/brand-collection-list-database';
import { BrandCollectionService } from '../../services/brand-collection.service';

@Component({
  selector: 'app-brand-collections',
  templateUrl: './brand-collections.component.html',
  styleUrls: ['./brand-collections.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, MatCheckboxModule],
  providers: [BrandCollectionListDatabase,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrandCollectionsComponent),
      multi: true
    }]
})
export class BrandCollectionsComponent implements OnInit, AfterViewInit {
  brandCollectionsForm!: FormGroup;
  brandCollectionList: BrandCollection[] = [];
  @Input() brandId = '';
  @Input() selectedIdList: BrandCollection[] = [];
  @Output() BrandCollectionChange: EventEmitter<any> = new EventEmitter<any>();
  constructor(private database: BrandCollectionListDatabase,
              public fb: FormBuilder,
              private brandCollectionService: BrandCollectionService,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService) {
              }

  toFormGroup(collections: BrandCollection[] ) {
    let group: any = {};

    collections.forEach(coll => {
      group[coll.brandCollectionId] = new FormControl(false);
    });
    return new FormGroup(group);
  }
  ngOnInit() {
    this.database.dataChange.subscribe(data => {
      this.brandCollectionList = data.filter(x => x.brandId === this.brandId);
      this.brandCollectionsForm = this.toFormGroup(this.brandCollectionList);
    });
  }
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }


  writeValue(value: BrandCollection[]) {
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

  selectNodes(event: { checked: any; }, id: BrandCollection) {
    if (event.checked) {
      this.selectedIdList.push(id);
    } else {
      const index = this.selectedIdList.indexOf(id);
      if (index !== -1) {
        this.selectedIdList.splice(index, 1);
      }
    }
    this.propagateChange(this.selectedIdList);
    const selectedBrandCollections: BrandCollection[] = [];
    this.BrandCollectionChange.emit(this.selectedIdList);
  }
}
