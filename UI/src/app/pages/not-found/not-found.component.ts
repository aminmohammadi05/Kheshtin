import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule,MatCardModule, MatButtonModule, FlexLayoutModule, MatFormFieldModule, MatSidenavModule]
})
export class NotFoundComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit() {
  }

  public goHome(): void {
    this.router.navigate(['/']);
  }

  ngAfterViewInit(){
   // document.getElementById('preloader')!.classList.add('hide');    
  }

}
