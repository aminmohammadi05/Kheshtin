import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { HeaderImageComponent } from 'src/app/shared/header-image/header-image.component';
import { BlogBagTypePipe } from 'src/app/theme/pipes/blog-bag.pipe';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormFieldModule,  FlexLayoutModule, RouterModule, HeaderImageComponent],
})
export class AgentsComponent implements OnInit {
  public agents;
  constructor(public appService:AppService) { }

  ngOnInit() {
    this.agents = this.appService.getAgents();
  }

}
