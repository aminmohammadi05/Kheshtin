import { CommonModule, NgFor } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../theme/components/footer/footer.component';
import { VerticalMenuComponent } from '../../theme/components/menu/vertical-menu/vertical-menu.component';
import { Toolbar1Component } from '../../theme/components/toolbar1/toolbar1.component';
import { BasicDataService } from '../../services/basic-data.service';
import { Observable, pluck } from 'rxjs';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatSidenavModule, FooterComponent, RouterModule, NgFor, Toolbar1Component, VerticalMenuComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit, AfterViewInit{
  items!: Observable<any[]>;
  public basicDataService = inject(BasicDataService);
  ngOnInit(): void {
    this.items = this.basicDataService.getMenuList().pipe(pluck("menu"));
  }
  ngAfterViewInit(): void {
    
  }

}
