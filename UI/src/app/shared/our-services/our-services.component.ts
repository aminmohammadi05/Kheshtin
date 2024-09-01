import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, ],
})
export class OurServicesComponent implements OnInit {
  @Input()
  services!: any[];
  constructor() { }

  ngOnInit() {
  }

}
