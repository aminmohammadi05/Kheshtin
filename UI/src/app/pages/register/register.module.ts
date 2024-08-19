import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';

export const routes = [
  { path: '', component: RegisterComponent, pathMatch: 'full'  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: RegisterComponent, pathMatch: 'full'  }
    ])
    
  ]
})
export class RegisterModule { }
