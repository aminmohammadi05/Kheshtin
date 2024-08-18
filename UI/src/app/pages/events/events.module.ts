import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { SafeHtmlPipe } from 'src/app/theme/pipes/safe-html.pipe';
import { FileTypePipe } from 'src/app/theme/pipes/file-type.pipe';
import { FileValueAccessorDirective } from 'src/app/theme/directives/file-value-accessor.directive';
import { FileValidatorDirective } from 'src/app/theme/directives/file-validator.directive';
import { ProjectsSearchComponent } from 'src/app/shared/projects-search/projects-search.component';
import { EventsComponent } from './events.component';
import { EventDetailsComponent} from './event-details/event-details.component';
import { Event } from 'src/app/models/event';
import { EventHeaderCarouselComponent } from 'src/app/shared/event-header-carousel/event-header-carousel.component';



@NgModule({
  imports: [
    CommonModule,    
    RouterModule.forChild([
      { path: ':page', component: EventsComponent, pathMatch: 'full' },
      { path: ':eventId/:urlTitle', component: EventDetailsComponent }
    ]),
    SharedModule
  ],
  declarations: [
    EventDetailsComponent,
    EventHeaderCarouselComponent,
  ]
})
export class EventsModule {
}
