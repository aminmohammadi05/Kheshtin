import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LockScreenComponent } from './pages/lock-screen/lock-screen.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';


export const routes: Routes = [
        {
        path: '',
        component: 
        PagesComponent
       , children: [
            // { path: '', redirectTo: '/landing', pathMatch: 'full' },
          { path: '', component: HomeComponent },
            // { path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule) },
            // { path: 'brands', loadChildren: () => import('./pages/brands/brands.module').then(m => m.BrandsModule) },
            // { path: 'contact', loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule) },
            // { path: 'products', loadChildren: () => import('./pages/product/products.module').then(m => m.ProductsModule) },
            // // { path: 'projects', loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule) },
            // { path: 'officeprojects', loadChildren:
            //     () => import('./pages/office-projects/office-projects.module').then(m => m.OfficeProjectsModule) },
            // { path: 'designoffices', loadChildren:
            //     () => import('./pages/design-offices/design-offices.module').then(m => m.DesignOfficesModule) },
            // { path: 'blogs', loadChildren: () => import('./pages/blogs/blogs.module').then(m => m.BlogsModule) },
            // { path: 'textureshowroom',
            //     runGuardsAndResolvers: 'always',
            //     canActivate: [AuthGuard],
            //     loadChildren: () => import('./pages/texture-show-room/texture-show-room.module')
            //     .then(m => m.TextureShowRoomModule) },
            // { path: 'designmoodboard',
            //     runGuardsAndResolvers: 'always',
            //     canActivate: [AuthGuard],
            //     loadChildren: () => import('./pages/design-mood-board/design-mood-board.module')
            //     .then(m => m.DesignMoodBoardModule) },
            // { path: 'moodboard',
            //     loadChildren: () => import('./pages/mood-board/mood-board.module')
            //     .then(m => m.MoodBoardModule) },
            // { path: 'events',
            //     loadChildren: () => import('./pages/events/events.module')
            //     .then(m => m.EventsModule) },
            // { path: 'agents', loadChildren: () => import('./pages/agents/agents.module').then(m => m.AgentsModule) },
            // { path: 'compare', loadChildren: () => import('./pages/compare/compare.module').then(m => m.CompareModule) },
            // { path: 'confirmation',
            //     loadChildren: () => import('./pages/confirmation/confirmation.module').then(m => m.ConfirmationModule) },
            // { path: 'mood-board-candidate-products',
            //     runGuardsAndResolvers: 'always',
            //     canActivate: [AuthGuard],
            //     loadChildren: () =>
            //     import('./pages/mood-board-candidate-products/mood-board-candidate-products.module')
            //     .then(m => m.MoodBoardCandidateProductsModule) },
            // { path: 'faq', loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqModule) },
            // { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
            // { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
            // {
            //     path: 'account',
            //     runGuardsAndResolvers: 'always',
            //     canActivate: [AuthGuard],
            //     loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule) }
      ]
    },
    // { path: 'landing', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule) },
    // { path: 'lock-screen', component: LockScreenComponent },
    // { path: '**', component: NotFoundComponent }
];
