import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsComponent } from './blogs.component';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { SafeHtmlPipe } from 'src/app/theme/pipes/safe-html.pipe';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: ':page', component: BlogsComponent, pathMatch: 'full' },
      { path: ':blogId/:urlTitle', component: BlogPostComponent }
    ]),
    SharedModule
  ],
  declarations: [
    BlogsComponent,
    BlogPostComponent]
})
export class BlogsModule { }
