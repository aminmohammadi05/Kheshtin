import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.scss']
})
export class OurServicesComponent implements OnInit {
  @Input() services: any[]
  constructor() { }

  ngOnInit() {
  }

}
