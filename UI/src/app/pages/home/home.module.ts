import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';




@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent, pathMatch: 'full'  }
    ])
    
    
  ],
  providers: [
     
  ]
})
export class HomeModule { }
