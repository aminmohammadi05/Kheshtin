import { Component, OnInit, Input, ViewChild, SimpleChange, AfterViewInit, OnChanges, inject } from '@angular/core';
import { Settings, AppSettings } from '../../app.settings';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Project } from '../../models/project';
import { ProductItemComponent } from '../product-item/product-item.component';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatChipsModule]
})
export class ProjectItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input()
  project!: Project;
  @Input() viewType = 'grid';
  @Input() viewColChanged = false;
  @Input() fullWidthPage = true;
  public column = 4;
  // public address:string;
  
  public settings: Settings;
  public appSettings = inject(AppSettings);
  constructor() {
    this.settings = this.appSettings.createNew()
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.initCarousel();
    // this.appService.getAddress(this.property.location.lat, this.property.location.lng).subscribe(data=>{
  
    //   this.address = data['results'][0]['formatted_address'];
    // })
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes['viewColChanged']) {
      this.getColumnCount(changes['viewColChanged'].currentValue);
      if (!changes['viewColChanged'].isFirstChange()) {
        if (this.project.projectImageList.length > 1) {
          //  this.directiveRef.update();
        }
      }
    }

    // for (let propName in changes) {
      // let changedProp = changes[propName];
      // if (!changedProp.isFirstChange()) {
      //   if(this.property.gallery.length > 1){
      //     this.initCarousel();
      //     this.config.autoHeight = true;
      //     this.directiveRef.update();
      //   }
      // }
    // }
  }

  public getColumnCount(value: number) {
    if (value === 25) {
      this.column = 4;
    } else if (value === 33.3) {
      this.column = 3;
    } else if (value === 50) {
      this.column = 2;
    } else {
      this.column = 1;
    }
  }

  public getStatusBgColor(status: any) {
    switch (status) {
      case 'For Sale':
        return '#558B2F';
      case 'For Rent':
        return '#1E88E5';
      case 'Open House':
        return '#009688';
      case 'No Fees':
        return '#FFA000';
      case 'Hot Offer':
        return '#F44336';
      case 'Sold':
        return '#000';
      default:
        return '#01579B';
    }
  }


  public initCarousel() {
    
  }


  public addToCompare() {
    // this.appService.addToCompare(this.product, CompareOverviewComponent, (this.settings.rtl) ? 'rtl' : 'ltr');
  }

  public onCompare() {
    // return this.appService.Data.compareList.filter(item => item.productId === this.product.productId)[0];
  }

  public addToFavorites() {
    // this.appService.addToFavorites(this.product, (this.settings.rtl) ? 'rtl':'ltr');
  }

  public onFavorites() {
    // return this.appService.Data.favorites.filter(item=>item.id == this.property.id)[0];
  }


}

