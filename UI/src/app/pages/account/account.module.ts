import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InputFileModule } from 'ngx-input-file';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProfileComponent } from './profile/profile.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { EditProjectComponent, EditProductsDialogComponent } from './edit-project/edit-project.component';
import { SafeHtmlPipe } from 'src/app/theme/pipes/safe-html.pipe';
import { InsertProjectComponent } from './insert-project/insert-project.component';
import { StepOneComponent } from './insert-project/step-one/step-one.component';
import { StepTwoComponent } from './insert-project/step-two/step-two.component';
import { StepThreeComponent, ChooseProductsDialogComponent } from './insert-project/step-three/step-three.component';
import { PreviewComponent } from './insert-project/preview/preview.component';
import { FormsModule } from '@angular/forms';
import { MyMoodBoardsComponent } from './my-moodboards/my-moodboards.component';
import { GridsterModule } from 'angular-gridster2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { PaginationModule,PaginationConfig } from 'ngx-bootstrap/pagination';



@NgModule({
  declarations: [
    DashboardComponent,
    AccountComponent,
    MyProjectsComponent,
    FavoritesComponent,
    ProfileComponent,
    EditProjectComponent,
    InsertProjectComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    PreviewComponent,
    ChooseProductsDialogComponent,
    EditProductsDialogComponent,
    MyMoodBoardsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule,
    RouterModule.forChild([
      {
        path: '',
        component: AccountComponent, children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'my-projects', component: MyProjectsComponent },
          { path: 'my-projects/:id', component: EditProjectComponent },
          { path: 'insert-project', component: InsertProjectComponent },
          { path: 'mymoodboards', component: MyMoodBoardsComponent },
          { path: 'favorites', component: FavoritesComponent },
          { path: 'profile', component: ProfileComponent }
        ]
      }
    ]),
    SharedModule,
    InputFileModule,
    FontAwesomeModule
  ]
})
export class AccountModule { 
  constructor() {
  }
}
