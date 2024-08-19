import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ChooseProductsDialogComponent } from '../insert-project/step-three/step-three.component';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { City } from 'src/app/models/city';
import { ProjectCategory } from 'src/app/models/project-category';
import { Province } from 'src/app/models/province';
import { ProjectImage } from 'src/app/models/project-image';
import { Product } from 'src/app/models/product';
import { Brand } from 'src/app/models/brand';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileValidatorDirective } from 'src/app/theme/directives/file-validator.directive';
import { BehaviorSubject, of, Observable, Subject } from 'rxjs';
import { BrandService } from 'src/app/services/brand.service';
import { map, tap } from 'rxjs/operators';
import { ProjectProduct } from 'src/app/models/project-product';
import { Pagination } from 'src/app/models/pagination';
import { Search } from 'src/app/models/search';
import { DomSanitizer } from '@angular/platform-browser';
import { InputFile, InputFileComponent } from 'ngx-input-file';
import { Category } from 'src/app/models/category';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
export interface EditProductDialogData {
  brandList: Observable<Brand[]>;
  selectedProducts: Product[];
}
@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css'],
  standalone: true,
    imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule, MatFormFieldModule,MatProgressSpinnerModule,  FlexLayoutModule, ReactiveFormsModule, MatDividerModule, MatSelectModule],
})
export class EditProjectComponent implements OnInit, AfterViewInit {
  projectId = '';
  project: Project;
  statusList: any[];
  selectedStatus: any;
  selectedCity: City;
  projectName: string;
  projectDescription: string;
  selectedProjectCategories: number[] = [];
  provinceList: Observable<Province[]>;
  cityList: Observable<City[]>;
  projectCategories: Observable<ProjectCategory[]>;
  visible = true;
  selectable = true;
  removable = true;
  editForm: FormGroup;
  selectedProducts: Product[];
  listOfProducts = '';
  brandList: Observable<Brand[]>;
  currentImages = new Array<InputFile>();
  @ViewChild('imageInput') imageInput: ElementRef;
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private route: ActivatedRoute,
              private projectService: ProjectService,
              private brandService: BrandService,
              private router: Router,
              public dialog: MatDialog,
              private sanitizer: DomSanitizer,
              private cdRef: ChangeDetectorRef) {
      this.editForm = this.formBuilder.group({
        province: [''],
        cities: ['', Validators.required],
        projectName: ['', Validators.required],
        projectDescription: ['', Validators.required],
        projectMainPicture: ['', [FileValidatorDirective.validate]],
        projectAvatarPicture: ['', [FileValidatorDirective.validate]],
        projectCategory: ['', Validators.required],
        projectDevStatus: ['', Validators.required],
        productList: ['', Validators.required]
      });
    }

  ngOnInit() {
  //   this.store.pipe(select(getAllProvinces),
  //   map(p => {
  //     if (p.length > 0) {
  //       this.provinceList = of(p);
  //     } else {
  //       this.store.dispatch(new RefreshProvinceAuthRequest(this.authService.getDecodedToken().nameid));
  //     }
  //   })).subscribe();
  //   this.store.pipe(select(getAllProjectCategories),
  //   map(c => {
  //     if (c.length > 0) {
  //       this.projectCategories = of(c);
  //     } else {
  //       this.store.dispatch(new ProjectCategoriesAuthRequest(this.authService.getDecodedToken().nameid));
  //     }
  //   })).subscribe();
  //   this.brandList = this.store.pipe(select(getAllBrands));

  //   this.statusList = [
  //     {label: 'در حال ارائه', id: 1},
  //     {label: 'در حال ساخت', id: 2},
  //     {label: 'تکمیل شده', id: 3}
  // ];
  //   this.route.params.subscribe(params => {
  //     this.projectId = params.id;
  //     const categories: SelectItem[] = [];
  //     this.store.pipe(select(getProjectById(this.projectId)),
  //     map(project => {
  //       if (project) {
  //         this.project = project;
  //         this.editForm.get('projectName').setValue(project.name);
  //         this.editForm.get('province').setValue(project.city.provinceId);
  //         this.store.pipe(select(getProvinceCities(project.city.provinceId)),
  //           map(c => {
  //             if (c.length > 0) {
  //               this.cityList = of(c);
  //               this.editForm.get('cities').setValue(project.cityId);
  //             } else {
  //               this.store.dispatch(
  //                 new RefreshProvinceCitiesAuthRequest(project.city.provinceId, this.authService.getDecodedToken().nameid));
  //               this.editForm.get('cities').setValue(project.cityId);
  //             }
  //           })).subscribe();
  //         this.editForm.get('projectCategory').setValue(project.projectCategorySetList.map(c => c.projectCategoryId));
  //         this.editForm.get('projectDevStatus').setValue(project.projectDevelopmentStatus);
  //         this.editForm.get('projectDescription').setValue(project.description);
  //         project.projectImageList.map( (x, i) => {
  //           this.toDataURL(`../../assets/projects/small/${x.projectId}_${i + 1}.jpg`, (dataUrl) => {
  //             const inputFile: InputFile = { id: i + 1, preview:
  //               dataUrl,
  //               file: new File([dataUrl], `${x.projectId}_${x.imageId}`, {
  //               type: '' // dataUrl.split(';')[0].split(':')[1]
  //             }) };
  //             this.currentImages.push(inputFile);
  //             return this.currentImages;
  //                   });
  //         });
  //         this.editForm.get('projectMainPicture')
  //         .setValue(this.currentImages);
  //         this.projectDescription = this.project.description;
  //         this.project.createUserId = this.authService.getDecodedToken().nameid;
  //         this.selectedProducts = project.projectProductList.map(x => x.product);
  //       }
  //     })).subscribe();

  // });
  }

  toDataURL(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.send();
}
toArrayBufferURL(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
          callback(reader.result);
      };
      reader.readAsArrayBuffer(xhr.response);
  };
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.send();
}
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
  provinceSelected() {
    // const provinceId = this.editForm.get('province').value;
    // this.store.pipe(select(getProvinceCities(provinceId)),
    // map(cities => {
    //   if (cities.length > 0) {
    //     this.cityList = of(cities);
    //   } else {
    //     this.store.dispatch(new RefreshProvinceCitiesAuthRequest(provinceId, this.authService.getDecodedToken().nameid));
    //   }
    // })).subscribe();
  }

onFileSelected(event) {
    if (event.target.files &&
      event.target.files[0].size < 5 * 1024 * 1024 ) {
      const fileToAdd = new ProjectImage();
      fileToAdd.name = event.target.files[0].name;
      fileToAdd.fileExtension = event.target.files[0].name.substring(event.target.files[0].name.lastIndexOf('.') + 1);
      fileToAdd.size = event.target.files[0].size;
      fileToAdd.imageId = this.project.projectImageList.length + 1;
      fileToAdd.projectId = this.project.projectId;
      const reader = new FileReader();

      reader.onload = ((file: File) => {
          return (evt) => {
            fileToAdd.imageUrl = btoa(evt.target.result as string);
            fileToAdd.createUserId = this.authService.getDecodedToken().nameid;
          };
        })(event.target.files[0]);

      reader.readAsBinaryString(event.target.files[0]);
      this.project.projectImageList.push(fileToAdd);
    }
  }

onThumbnailSelected(event, fileToUpload: ProjectImage) {
    if (event.target.files &&
      event.target.files[0].size < 5 * 1024 * 1024 ) {
        const reader = new FileReader();

        reader.onload = ((file: File) => {
          return (evt) => {
            fileToUpload.thumbnail = 'data:' + event.target.files[0].type + ';base64,' + btoa(evt.target.result as string);
          };
        })(event.target.files[0]);

        reader.readAsBinaryString(event.target.files[0]);
    }
  }

removeFile(file: ProjectImage) {
    const index = this.project.projectImageList.findIndex(x => x.imageId === file.imageId);
    this.project.projectImageList.splice(index, 1);
    this.imageInput.nativeElement.value = '';
  }

remove(product: Product): void {
    const index = this.selectedProducts.indexOf(product);

    if (index >= 0) {
      this.selectedProducts.splice(index, 1);
      this.listOfProducts = this.selectedProducts.map(x => x.name).join(',');
    }
  }

openDialog(): void {
    const dialogRef = this.dialog.open(EditProductsDialogComponent, {
      width: '800px',
      data: {brandList: this.brandList, selectedProducts: this.selectedProducts}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.selectedProducts = result;
      } else {
        this.selectedProducts = [];
      }
      this.listOfProducts = this.selectedProducts.map(x => x.name).join(',');
    });
  }

saveChanges() {
    this.project.name = this.editForm.get('projectName').value;
    this.project.projectDevelopmentStatus = this.editForm.get('projectDevStatus').value;
    this.project.projectCategorySetList = [];
    this.editForm.get('projectCategory').value.map((category, index) => {
      this.project.projectCategorySetList.push({
        createUserId: this.authService.getDecodedToken().nameid,
        projectCategoryId: category,
        projectId: this.project.projectId,
        project: null,
        projectCategory: null
      });
    });
    this.project.projectImageList = [];
    this.editForm.get('projectMainPicture').value.map((image, index) => {
      this.project.projectImageList.push({
        createUserId: this.authService.getDecodedToken().nameid,
        fileExtension: image.file.type,
        imageId: index + 1,
        imageUrl: '',
        name: this.project.projectId + '_' + index.toString(),
        project: null,
        projectId: this.project.projectId,
        size: image.file.size,
        thumbnail: image.preview
      });
    });
    this.project.description = this.editForm.get('projectDescription').value;
    this.project.projectProductList = [];
    this.selectedProducts.map(c => {
      this.project.projectProductList.push({
          projectId: this.project.projectId,
          project: null,
          product: c,
          productId: c.productId,
          createUserId: this.authService.getDecodedToken().nameid
      });
    });
    this.projectService.updateProject(this.project).subscribe(x => {
      this.router.navigate(['/account/my-projects']);
    });
  }
}

@Component({
  selector: 'app-edit-products-dialog',
  templateUrl: 'edit-products-dialog.html',
  styleUrls: ['./edit-project.component.css'],
  standalone: true,
    imports: [CommonModule, MatIconModule, MatCardModule, MatChipsModule, MatListModule, MatFormFieldModule,MatProgressSpinnerModule,  FlexLayoutModule, ReactiveFormsModule, MatDividerModule, MatSelectModule],
})
export class EditProductsDialogComponent implements OnInit {
  productForm: FormGroup;
  productItems: FormArray;
  selectedBrand: Brand;
  selectedCategoryList: Observable<Category[]>;
  brandProducts: Product[] = [];
  public allProducts: Product[] = [];
  public totalProducts: Observable<number>;
  public count = 12;
  public sort: string;
  public viewType = 'grid';
  public viewCol = 33.3;
  public searchFields: Search = new Search({
    brandsBox: [],
    categoriesBoxNested: [],
    categoriesBox: [],
    brandCollectionBox: [],
    fileTypes: [],
    imageUploaded: '',
    searchBox: '',
    vertical: false
  });
  public pagination: Pagination = new Pagination(0, this.count, null, null);
  public isLoading = false;
  public message: string;
  constructor(
    public dialogRef: MatDialogRef<EditProductsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditProductDialogData,   
    private formBuilder: FormBuilder,
    private authService: AuthService) {
    }
    ngOnInit() {
      this.productForm = this.formBuilder.group({
        brandList:          new FormControl(''),
        categoryList:               new FormControl(''),
        productItems: this.formBuilder.array([])
      });
    }
    selectBrand(event) {
      // this.store.pipe(select(getBrandById(this.productForm.get('brandList').value.displayId)),
      // tap((brand) => {
      //   if (brand) {
      //     this.selectedBrand = brand;
      //     this.searchFields.brandsBox = [];
      //     this.selectedCategoryList =
      //       this.store.pipe(select(getCategoryListById(this.selectedBrand.brandCategoryList.map(y => y.categoryId))));
      //     this.searchFields.brandsBox.push(this.selectedBrand);
      //   }
      // })).subscribe();
    }
    selectCategory(event) {
      this.searchFields.categoriesBoxNested = [];
      this.searchFields.categoriesBoxNested.push(this.productForm.get('categoryList').value);
      this.getBrandProducts();
    }
    getBrandProducts() {
      this.searchFields.brandsBox.push(this.selectedBrand);
      this.isLoading = true;
    //   this.store.pipe(select(getBrandCategoryProducts(this.selectedBrand.brandId,
    //     this.searchFields.categoriesBoxNested[0].categoryId)),
    // tap((product) => {
    //   this.isLoading = false;
    //   this.brandProducts = product;
    //   this.productItems = this.productForm.get('productItems') as FormArray;
    //   if (product.length === this.selectedBrand.brandCategoryList
    //     .filter(x => x.categoryId === this.searchFields.categoriesBoxNested[0].categoryId)[0].totalProducts) {
    //       product.map(x => {
    //         this.productItems.push(this.createProductItem());
    //       });
    //     }
    //   if (product.length <
    //       this.selectedBrand.brandCategoryList
    //       .filter(x => x.categoryId === this.searchFields.categoriesBoxNested[0].categoryId)[0].totalProducts) {
    //                 this.store.dispatch(new GetBrandProductsByCategoryRequest(
    //                   this.authService.getDecodedToken().nameid,
    //                   this.selectedBrand.brandId,
    //                   this.searchFields.categoriesBoxNested[0].categoryId));
    //             }
    // })).subscribe();
    // }
    // selectProduct(event, product) {
    //   if (event.checked) {
    //     this.data.selectedProducts.push(product);
    //   } else {
    //     this.data.selectedProducts.splice(this.data.selectedProducts.indexOf(product)[0], 1);
    //   }
    }


    //////////// VRAY //////////////////
  createProductItem(): FormGroup {
    return this.formBuilder.group({
      productItem: false
    });
  }
  productDeleted(event) {
    const index = this.productForm.get('productVRayFiles').value.indexOf(event);
    this.productItems.removeAt(index);
  }

  productSelected(event) {
    this.productForm.get('productItems').value.map((product, i) => {
    this.data.selectedProducts.push(product);
  });
  }
  ////////////////////////////////////


  onNoClick(): void {
    this.dialogRef.close();
  }
  save() {
    this.data.selectedProducts = this.productForm.get('productItems').value
      .map((v, i) => {
        return v.productItem ? this.brandProducts[i] : null;
      })
      .filter(v => v !== null);
    this.dialogRef.close({action: 'save', product: this.data.selectedProducts});
  }

  public onPageChange(e) {
    this.pagination.currentPage = e.pageIndex ;
    this.getBrandProducts();
    window.scrollTo(0, 0);
  }
}
