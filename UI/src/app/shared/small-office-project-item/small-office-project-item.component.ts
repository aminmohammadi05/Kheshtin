import { Component, OnInit, Input, ViewChild, SimpleChange, AfterViewInit, OnChanges, inject } from '@angular/core';
import { Settings, AppSettings } from '../../app.settings';

import * as moment from 'jalali-moment'; // add this 1 of 4
import { Route, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-small-office-project-item',
  templateUrl: './small-office-project-item.component.html',
  styleUrls: ['./small-office-project-item.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatChipsModule, ]
})
export class SmallOfficeProjectItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() officeProject: any;
  @Input() viewType = 'grid';
  @Input() viewColChanged = false;
  @Input() fullWidthPage = true;
  liked!: Observable<boolean>;
  categoryList = '';
  brandName = '';
  public column = 4;
  // public address:string;
 
  public settings: Settings;
  public appSettings= inject( AppSettings);
  public authService= inject( AuthService);
  public route= inject( Router);
  public productService= inject( ProductsService);
  constructor() {
    this.settings = this.appSettings.createNew()
  }

  ngOnInit() {
    
    if (this.officeProject && this.officeProject.imageList && this.officeProject.imageList.contentItems && this.officeProject.imageList.contentItems[0]) {
      this.officeProject.imageList.contentItems.sort((a: { contentItemId: any; }, b: { contentItemId: any; }) => {
        const fileIda = a.contentItemId;
        const fileIdb = b.contentItemId;
        if (fileIda < fileIdb) {
          return -1;
        }
        if (fileIda > fileIdb) {
          return 1;
        }
  
        return 0;
      });
    }
    
   }

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
        if (this.officeProject.imageList.contentItems.length > 1) {
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

  getOfficeProjectImages(project: { bag: { contentItems: any[]; }; }){
   
    return project.bag.contentItems.filter((x: { __typename: string; }) => x.__typename === "ProjectImage");
  }
  public initCarousel() {
    
  }



  public getCategoriesNames() {
    if (this.officeProject) {
      return this.officeProject.projectType.contentItems.map((x: { displayText: any; }) => x.displayText).join(', ')
    } else {
      return '';
    }

  }
  public getDesignOfficeName() {
    if (this.officeProject) {
      return this.officeProject.designOffice.contentItems.map((x: { displayText: any; }) => x.displayText).join(', ')
    } else {
      return '';
    }

  }

}

