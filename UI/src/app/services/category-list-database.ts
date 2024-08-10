import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { BehaviorSubject } from 'rxjs';
import { CategoryService } from './category.service';
import { map } from 'rxjs/operators';
import { BasicDataService } from './basic-data.service';

@Injectable()
export class CategorylistDatabase {
  dataChange = new BehaviorSubject<Category[]>([]);

  get data(): Category[] { return this.dataChange.value; }
  public categoryList: Category[] = []
  public categoryListFlat: Category[] = []
  constructor(private categoryService: CategoryService,
    public basicDataService: BasicDataService,
    ) {
    this.initialize();
  }

  initialize() {
   
     this.basicDataService.getCategories().subscribe(x => {     
      x.productCategory.map((x2, indparent) => {
        this.categoryList[indparent] = {
          categoryId: x2.id,
          name: x2.userTitle,
          parentCategoryId: null,
          childrenCategories: x2.childrenCategories ? [...x2.childrenCategories.contentItems
          .map(x3 => ({
            categoryId: x3.id,
            name: x3.userTitle,
            parentCategoryId: x2.id,
            childrenCategories: x3.childrenCategories ? [...x3.childrenCategories.contentItems
              .map(x4 => ({
                categoryId: x4.id,
                name: x4.userTitle,
                parentCategoryId: x3.id,
                childrenCategories: null
              } as Category))] : null
          } as Category))] : null,
          deleted: false
      } as Category})
      this.categoryList.map(x => {
        this.categoryListFlat.push(x);
        
        x.childrenCategories ? x.childrenCategories.map(x1 => {
          this.categoryListFlat.push(x1);
          x1.childrenCategories ? x1.childrenCategories.map(x2 => {
            this.categoryListFlat.push(x2);
          }) : null
        }) : null
      })
    });
      
      

    this.basicDataService.getCategories().subscribe(x => {
      const data = this.buildFileTree(this.categoryList, 0);
      this.dataChange.next(data);
    });
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    // this.store.pipe(select(getAllCategories),
    // map(categories => {
    //   const data = this.buildFileTree(categories, 0);
    //   this.dataChange.next(data);
    // })).subscribe();
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): Category[] {
    return Object.keys(obj).reduce<Category[]>((accumulator, key) => {
      const value = obj[key];
      const node = new Category();
      node.name = obj[key] ? obj[key].name : '';
      node.categoryId = obj[key] ? obj[key].categoryId : null;

      if (value != null) {
        if (typeof value === 'object' && value.childrenCategories) {
          node.childrenCategories = this.buildFileTree(value.childrenCategories, level + 1);
        } else {
          node.name = value ? value.name : '';
        }
      }

      return accumulator.concat(node);
    }, []);
  }

}
