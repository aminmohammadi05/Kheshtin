import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, FlexLayoutModule],
})
export class OurServicesComponent implements OnInit {
  @Input()
  services!: any[];
  constructor() { }

  ngOnInit() {
  }

}
