import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignerProjectsComponent } from './designer-projects.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

export const routes = [
  { path: '', component: DesignerProjectsComponent, pathMatch: 'full'  }
];

@NgModule({
  imports: [
    // CommonModule,
    // ReactiveFormsModule,
    // FormsModule,
    // RouterModule.forChild(routes),
    // SharedModule
  ],
  declarations: [
   
]
})
export class DesignerProjectModule { }
