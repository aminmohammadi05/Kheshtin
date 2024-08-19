import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgentsComponent } from './agents.component';
import { AgentComponent } from './agent/agent.component';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AgentsComponent, pathMatch: 'full' },
      { path: ':id', component: AgentComponent }
    ])
    
  ]
})
export class AgentsModule { }
