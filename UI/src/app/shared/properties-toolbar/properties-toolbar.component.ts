import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-properties-toolbar',
  templateUrl: './properties-toolbar.component.html',
  styleUrls: ['./properties-toolbar.component.scss']
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
