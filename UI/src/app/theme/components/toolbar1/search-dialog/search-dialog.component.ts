import { Component, OnInit,  Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HomeSearch } from 'src/app/models/home-search';

@Component({
  selector: 'search-dialog',
  templateUrl: 'search-dialog.component.html',
})
export class SearchDialogComponent implements OnInit{
    @ViewChild('searchField', { static: true }) searchField: any;
    public searchFields = new HomeSearch({
        searchId: 1,
        brandsBox: [],
        categoriesBoxNested: [],
        brandCollectionBox: [],
        categoriesBox: [],
        fileTypes: [],
        searchBox: '',
        imageUploaded: ''
      });
  constructor(
    private _router: Router,
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  filterData: any;
  
  ngOnInit() {
    this.filterData = this.data;
    const rightMostPos = window.innerWidth - Number(this.filterData.right);
    this.dialogRef.updatePosition({ top: `${this.filterData.bottom}px`,
    right: `${rightMostPos}px`});
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  search() {
    this.searchFields.searchBox = this.searchField.nativeElement.value;
    // this.store.dispatch(new SaveHomeSearchForRequest(this.searchFields));
    // this._router.navigate(['/products']);
    this._router.navigate(['/blogs/1', {search: this.searchFields.searchBox ? this.searchFields.searchBox : null, categories: null}]);
    this.dialogRef.close();
  }
}