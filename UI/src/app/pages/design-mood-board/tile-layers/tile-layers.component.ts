import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {DragDropModule} from '@angular/cdk/drag-drop'
import { MoodBoardProduct } from '../../../models/moodboard-product';
import { Product } from '../../../models/product';
import { ProductMoodBoardSearch } from '../../../models/product-mood-board-search';

@Component({
    selector: 'app-tile-layers',
    templateUrl: './tile-layers.component.html',
    styleUrls: ['./tile-layers.component.css'],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatFormFieldModule, DragDropModule]
  })
export class TileLayersComponent implements OnInit {
    @Input()
  products!: MoodBoardProduct[];
    @Input()
  currentProducts!: Product[];
    @Input()
  searchFields!: ProductMoodBoardSearch;
    @Output() LayerChange: EventEmitter<any> = new EventEmitter<any>();
    constructor(private cdr: ChangeDetectorRef) {

    }

    ngOnInit() {

    }
    drop(event: CdkDragDrop<number[]>) {
        moveItemInArray(this.products, event.previousIndex, event.currentIndex);
        this.products.map((product, i) => {
          this.setProductLayerIndex(product, i);
        });
      }
      setProductLayerIndex(product: MoodBoardProduct, index: number) {
          if (index !== product.layerIndex) {
            product.layerIndex = index;
            this.LayerChange.emit(product);
            this.cdr.detectChanges();
          }
      }

      public getFileIdByColor(product: MoodBoardProduct)  {
        const prod = this.currentProducts.filter(x => x.productId === product.productId)[0];
        return this.searchFields.colorsBox.length > 0 && prod.productFiles.filter(x => x.color === this.searchFields.colorsBox[0])[0] ?
        '../../assets/products/big/' +
        product.productId + '_12_-1_' + prod.productFiles.filter(x => x.color === this.searchFields.colorsBox[0])[0].productFileId + '_0.png'
        : '../../assets/products/big/' + product.productId + '_12_-1_1_0.png';
        // return {"background-image" : "url(' "+ prod.productFiles[0].reservedField2 + "');"};
      }
}
