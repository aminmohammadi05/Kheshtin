import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-properties-toolbar',
  templateUrl: './properties-toolbar.component.html',
  styleUrls: ['./properties-toolbar.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule,MatSidenavModule, MatCardModule, MatChipsModule, MatListModule, MatFormFieldModule,  FlexLayoutModule, MatMenuModule],
})
export class PropertiesToolbarComponent implements OnInit, OnChanges {
  @Input() isHomePage = false;
  @Input() showSidenavToggle = false;
  @Output() SidenavToggle: EventEmitter<any> = new EventEmitter<any>();
  @Output() ChangeCount: EventEmitter<any> = new EventEmitter<any>();
  @Output() ChangeSorting: EventEmitter<any> = new EventEmitter<any>();
  @Output() ChangeViewType: EventEmitter<any> = new EventEmitter<any>();

  public viewType = 'grid';
  public viewCol = 25;
  public counts = [8, 12, 16, 24, 36];
  public count: any;
  public sortings = ['مرتب سازی پیش فرض', 'جدیدترین', 'قدیمی ترین', 'عمومی ترین'];
  public sort: any;

  constructor() { }

  ngOnInit() {
    this.count = (this.isHomePage) ? this.counts[0] : this.counts[1];
    this.sort = this.sortings[0];
  }

  ngOnChanges(){
   
  }

  public changeCount(count){
    this.count = count;
    this.ChangeCount.emit(count);
    // this.getAllProducts();
  }

  public changeSorting(sort){
    this.sort = sort;
    this.ChangeSorting.emit(sort);
  }

  public changeViewType(viewType, viewCol){
    this.viewType = viewType;
    this.viewCol = viewCol;
    this.ChangeViewType.emit({viewType:viewType, viewCol:viewCol});
  }

  public sidenavToggle(){
    this.SidenavToggle.emit();
  }

}
