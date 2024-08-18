import { Component, Input, ViewChild, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  standalone: true,
})
export class LogoComponent implements OnInit {
  @Input() logoWidth = '11.0625rem';
  @ViewChild('logo', { static: true }) logo: ElementRef;
  constructor(private renderer: Renderer2) {

  }

  ngOnInit() {
    this.renderer.setStyle(this.logo.nativeElement, 'width', this.logoWidth);
  }
 }
