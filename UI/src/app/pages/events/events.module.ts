import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventsComponent } from './events.component';
import { EventDetailsComponent} from './event-details/event-details.component';



@NgModule({
  imports: [
    CommonModule,    
    RouterModule.forChild([
      { path: ':page', component: EventsComponent, pathMatch: 'full' },
      { path: ':eventId/:urlTitle', component: EventDetailsComponent }
    ])
    
  ],
  declarations: [
  ]
})
export class EventsModule {
}
