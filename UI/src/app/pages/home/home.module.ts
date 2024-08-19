import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HotOfferTodayComponent } from './hot-offer-today/hot-offer-today.component';
import { RecentProductsComponent } from './recent-products/recent-products.component';
import { RecentOfficeProjectsComponent } from './recent-office-projects/recent-office-projects.component';
import { OfficeProjectsCarouselComponent } from 'src/app/shared/office-projects-carousel/office-projects-carousel.component';
import { RecentBlogsComponent } from './recent-blogs/recent-blogs.component';
import { HorizontalPropertiesSearchComponent } from 'src/app/shared/horizontal-properties-search/horizontal-properties-search.component';
import { HomeEventTimelineComponent } from './home-event-timeline/home-event-timeline.component';
import { DxGanttModule } from 'devextreme-angular';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent, pathMatch: 'full'  }
    ])
    
    
  ]
})
export class HomeModule { }
