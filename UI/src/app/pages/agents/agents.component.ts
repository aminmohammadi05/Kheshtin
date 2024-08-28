import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { HeaderImageComponent } from '../../shared/header-image/header-image.component';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormFieldModule,  FlexLayoutModule, RouterModule, HeaderImageComponent],
})
export class AgentsComponent implements OnInit {
  public agents: any;
  constructor() { }

  ngOnInit() {
  
  }

}
