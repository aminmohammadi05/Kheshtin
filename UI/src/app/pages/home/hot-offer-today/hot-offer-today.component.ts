import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-hot-offer-today',
  templateUrl: './hot-offer-today.component.html',
  styleUrls: ['./hot-offer-today.component.scss']
})
export class HotOfferTodayComponent implements OnInit {
  @Input('propertyId') propertyId: any;
  public property: any;
  constructor() { }

  ngOnInit() {
    
  }

}
