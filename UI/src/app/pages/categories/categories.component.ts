import { Component, OnInit, AfterViewInit, Output, EventEmitter, forwardRef, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CategorylistDatabase } from 'src/app/services/category-list-database';
import { Category } from 'src/app/models/category';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, MatTreeModule } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { BrandService } from 'src/app/services/brand.service';
import { BrandCategoryService } from 'src/app/services/brand-category.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, Subject, of } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { map } from 'rxjs/operators';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrandCollectionsComponent } from 'src/app/shared/brand-collections/brand-collections.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
export class CategoryFlatNode {
  constructor(public id: number,
              public item: string,
              public level: number,
              public expandable: boolean) {}
}
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [CommonModule, MatTreeModule, MatCheckboxModule, MatButtonModule, MatIconModule],
  providers: [CategorylistDatabase,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoriesComponent),
      multi: true
    }]
})
export class CategoriesComponent implements OnInit, AfterViewInit, ControlValueAccessor, OnDestroy {

  flatNodeMap = new Map<CategoryFlatNode, Category>();
  nestedNodeMap = new Map<Category, CategoryFlatNode>();
  selectedParent: CategoryFlatNode | null = null;
  newItemName = '';
  @Input() selectedIdList: Category[] = [];
  @Output() CategoryChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() categories: EventEmitter<Category[]> = new EventEmitter<Category[]>();
  treeControl: FlatTreeControl<CategoryFlatNode>;

  treeFlattener: MatTreeFlattener<Category, CategoryFlatNode>;

  treeDataSource: MatTreeFlatDataSource<Category, CategoryFlatNode>;
  checklistSelection = new SelectionModel<CategoryFlatNode>(true, []);

  constructor(private database: CategorylistDatabase,
              private brandCategoryService: BrandCategoryService,
              public basicDataService: BasicDataService,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService) {
      this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
        this.isExpandable, this.getChildren);
      this.treeControl = new FlatTreeControl<CategoryFlatNode>(this.getLevel, this.isExpandable);
      this.treeDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      this.database.dataChange.subscribe(data => {
        this.treeDataSource.data = data;
        this.categories.emit(data)
      });

    }


  ngOnInit() {
}




ngAfterViewInit() {
  this.cdRef.detectChanges();
}

writeValue(value: Category[]) {
  if (value != null && value && value.length > 0) {

    this.selectedIdList = value;
    if (this.selectedIdList && this.selectedIdList.length > 0 ) {
      const diff = this.checklistSelection.selected.map(x => x.id).filter(x => !this.selectedIdList.map(z => z.categoryId).includes(x));
      
      diff.map(y => {
        const catFlat = this.treeControl.dataNodes.filter(x => x.id === y)[0];
        if (catFlat.expandable) {
          this.checklistSelection.deselect(catFlat);
          const descendants = this.treeControl.getDescendants(catFlat);
          this.checklistSelection.deselect(...descendants);
        } else {
          this.checklistSelection.deselect(catFlat);
        }
      });
      this.selectedIdList.map(y => {
        const catFlat = this.treeControl.dataNodes.filter(x => x.id === y.categoryId)[0];
        if (catFlat.expandable) {
          this.checklistSelection.select(catFlat);
          const descendants = this.treeControl.getDescendants(catFlat);
          this.checklistSelection.select(...descendants);
                } else {
                  this.checklistSelection.select(catFlat);
        }
      });
    }
  } else {
    let catFlat = this.treeControl.dataNodes.filter(x => x.id === 1)[0];
        if (catFlat && catFlat.expandable) {
          this.checklistSelection.deselect(catFlat);
          const descendants = this.treeControl.getDescendants(catFlat);
          this.checklistSelection.deselect(...descendants);
        } else if (catFlat){
          this.checklistSelection.deselect(catFlat);
        }
    catFlat = this.treeControl.dataNodes.filter(x => x.id === 2)[0];
        if (catFlat && catFlat.expandable) {
          this.checklistSelection.deselect(catFlat);
          const descendants = this.treeControl.getDescendants(catFlat);
          this.checklistSelection.deselect(...descendants);
        } else if (catFlat) {
          this.checklistSelection.deselect(catFlat);
        }
  }
}
propagateChange = (_: any) => {};

registerOnChange(fn: any): void {
  this.propagateChange = fn;
}
registerOnTouched(fn: any): void {
}
setDisabledState?(isDisabled: boolean): void {
}


getLevel = (node: CategoryFlatNode) => node.level;

isExpandable = (node: CategoryFlatNode) => node.expandable;

getChildren = (node: Category): Category[] => node.childrenCategories;

hasChild = (_: number, nodeData: CategoryFlatNode) => nodeData.expandable;

hasNoContent = (_: number, nodeData: CategoryFlatNode) => nodeData.item === '';

/**
 * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
 */
transformer = (node: Category, level: number) => {
  const existingNode = this.nestedNodeMap.get(node);
  const flatNode = existingNode && existingNode.item === node.name
      ? existingNode
      : new CategoryFlatNode(null, null, null, null);
  flatNode.item = node.name;
  flatNode.id = node.categoryId;
  flatNode.level = level;
  flatNode.expandable = !!node.childrenCategories || node.childrenCategories ? node.childrenCategories.length > 0 : false;
  this.flatNodeMap.set(flatNode, node);
  this.nestedNodeMap.set(node, flatNode);
  return flatNode;
}

/** Whether all the descendants of the node are selected. */
descendantsAllSelected(node: CategoryFlatNode): boolean {
  const descendants = this.treeControl.getDescendants(node);
  const descAllSelected = descendants.every(child =>
     this.checklistSelection.selected.filter(x => x.id === child.id).length > 0
  );
  return descAllSelected;
}

/** Whether part of the descendants are selected */
descendantsPartiallySelected(node: CategoryFlatNode): boolean {
  const descendants = this.treeControl.getDescendants(node);
  const result = descendants.some(child =>
    this.checklistSelection.selected.filter(x => x.id === child.id).length > 0
 );
  return result && !this.descendantsAllSelected(node);
}

/** Toggle the to-do item selection. Select/deselect all the descendants node */
todoItemSelectionToggle(node: CategoryFlatNode): void {
  this.checklistSelection.toggle(node);
  const descendants = this.treeControl.getDescendants(node);
  this.checklistSelection.isSelected(node)
    ? this.checklistSelection.select(...descendants)
    : this.checklistSelection.deselect(...descendants);

  // Force update for the parent
  descendants.every(child =>
    this.checklistSelection.isSelected(child)
  );
  this.checkAllParentsSelection(node);
  this.selectNodes();
}

/** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
todoLeafItemSelectionToggle(node: CategoryFlatNode): void {
  this.checklistSelection.toggle(node);
  this.checkAllParentsSelection(node);
  const sel = this.checklistSelection.isSelected(node);
  this.selectNodes();
}

/* Checks all the parents when a leaf node is selected/unselected */
checkAllParentsSelection(node: CategoryFlatNode): void {
  let parent: CategoryFlatNode | null = this.getParentNode(node);
  while (parent) {
    this.checkRootNodeSelection(parent);
    parent = this.getParentNode(parent);
  }
}

/** Check root node checked state and change it accordingly */
checkRootNodeSelection(node: CategoryFlatNode): void {
  const nodeSelected = this.checklistSelection.isSelected(node);
  const descendants = this.treeControl.getDescendants(node);
  const descAllSelected = descendants.every(child =>
    this.checklistSelection.isSelected(child)
  );
  if (nodeSelected && !descAllSelected) {
    this.checklistSelection.deselect(node);
  } else if (!nodeSelected && descAllSelected) {
    this.checklistSelection.select(node);
  }
}

/* Get the parent node of a node */
getParentNode(node: CategoryFlatNode): CategoryFlatNode | null {
  const currentLevel = this.getLevel(node);

  if (currentLevel < 1) {
    return null;
  }

  const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

  for (let i = startIndex; i >= 0; i--) {
    const currentNode = this.treeControl.dataNodes[i];

    if (this.getLevel(currentNode) < currentLevel) {
      return currentNode;
    }
  }
  return null;
}

selectNodes() {
  // this.store.pipe(select(getCategoryListById(this.checklistSelection.selected.map(x => x.id))),
  //     map(cat => {
  //       this.selectedIdList = [...cat];
  //     })).subscribe();
  
   
  
    
   
 
  this.selectedIdList = this.checklistSelection.selected.map(x => this.database.categoryListFlat.filter(x1 => x1.categoryId === x.id)[0])
  this.propagateChange(this.selectedIdList);
  this.CategoryChange.emit(this.selectedIdList);
}
ngOnDestroy() {

}
}
