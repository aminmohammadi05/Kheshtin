import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignerProjectsComponent } from './designer-projects.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from 'src/app/theme/pipes/safe-html.pipe';

export const routes = [
  { path: '', component: DesignerProjectsComponent, pathMatch: 'full'  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    DesignerProjectsComponent
]
})
export class DesignerProjectModule { }
