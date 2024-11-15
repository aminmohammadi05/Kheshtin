import { Component, OnInit, ViewChild, ElementRef, forwardRef, AfterViewInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Province } from 'src/app/models/province';
import { ProjectService } from 'src/app/services/project.service';
import { City } from 'src/app/models/city';
import { ProjectCategory } from 'src/app/models/project-category';
import { ProjectImage } from 'src/app/models/project-image';
import { FileValidatorDirective } from 'src/app/theme/directives/file-validator.directive';
import { Project } from 'src/app/models/project';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, of } from 'rxjs';
import { Login } from 'src/app/models/login';
import { tap, map } from 'rxjs/operators';

const noop = () => {
};

export const STEP_ONE_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StepOneComponent),
    multi: true
};

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css'],
  providers: [STEP_ONE_CONTROL_VALUE_ACCESSOR]
})
export class StepOneComponent implements OnInit, OnChanges, AfterViewInit,  ControlValueAccessor {
  loginList: Observable<Login[]>;
  innerProject = new Project();
  innerProjectName: string;
  statusList: any[];
  selectedStatus: any;
  get projectName(): string {
    return this.innerProject.name;
  }


  set projectName(v: string) {
    if (v !== this.innerProject.name) {
        this.innerProject.name = v;
        this.onChangeCallback(v);
    }
  }
  selectedCity: City;
  selectedProjectCategories: ProjectCategory[] = [];
  provinceList: Observable<Province[]>;
  cityList: Observable<City[]>;
  projectCategories: Observable<ProjectCategory[]>;
  isLinear = false;
  firstFormGroup: FormGroup;
  @ViewChild('imageInput') imageInput: ElementRef;
  constructor(private fb: FormBuilder,
              private projectService: ProjectService,
              private authService: AuthService
    ) {
    this.firstFormGroup = this.fb.group({
      province: [''],
      cities: ['', Validators.required],
      projectName: ['', Validators.required],
      projectMainPicture: ['', [FileValidatorDirective.validate]],
      projectCategory: ['', Validators.required],
      projectDevStatus: ['', Validators.required]
    });
   }

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    ngAfterViewInit() {
      // this.projectCategories = this.store.select(getAllProjectCategories);
    }

    ngOnChanges() {
     
    }
  ngOnInit() {
    // this.provinceList = this.store.pipe(select(getAllProvinces));

    this.statusList = [
      {label: 'در حال ارائه', value: 1},
      {label: 'در حال ساخت', value: 2},
      {label: 'تکمیل شده', value: 3}
  ];
  }

  provinceSelected() {
    const province = this.firstFormGroup.get('province').value;
    // this.store.pipe(select(getProvinceCities(province.provinceId)),
    // map(cities => {
    //   if (cities.length > 0) {
    //     this.cityList = of(cities);
    //   } else {
    //     this.store.dispatch(new RefreshProvinceCitiesAuthRequest(province.provinceId, this.authService.getDecodedToken().nameid));
    //   }
    // })).subscribe();
  }
  onFileSelected(event) {
    // this.loginList = this.store.pipe(
    //   select(getAllLogins),
    //   tap(login => {
    //     if (login && login.length > 0) {
    //       if (event.target.files &&
    //         event.target.files[0].size < 5 * 1024 * 1024 ) {
    //         const fileToAdd = new ProjectImage();
    //         fileToAdd.name = event.target.files[0].name;
    //         fileToAdd.fileExtension = event.target.files[0].name.substring(event.target.files[0].name.lastIndexOf('.') + 1);
    //         fileToAdd.size = event.target.files[0].size;
    //         fileToAdd.imageId = this.innerProject.projectImageList.length + 1;
    //         const reader = new FileReader();
    //         reader.onload = ((file: File) => {
    //             return (evt) => {
    //               fileToAdd.imageUrl = btoa(evt.target.result as string);
    //               fileToAdd.createUserId = login[0].userId;
    //             };
    //           })(event.target.files[0]);
    //         reader.readAsBinaryString(event.target.files[0]);
    //         this.innerProject.projectImageList.push(fileToAdd);
    //       }
    //     }}));
  }

  removeFile(file: ProjectImage) {
    const index = this.innerProject.projectImageList.findIndex(x => x.imageId === file.imageId);
    this.innerProject.projectImageList.splice(index, 1);
    this.imageInput.nativeElement.value = '';
  }

  addDataToProject() {
    // this.store.pipe(
    //   select(getAllLogins),
    //   tap(login => {
    //     if (login && login.length > 0) {
    //       this.innerProject.projectCategorySetList = [];
    //       this.selectedProjectCategories = this.firstFormGroup.get('projectCategory').value;
    //       this.innerProject.createUserId = this.authService.getDecodedToken().nameid;
    //       this.innerProject.name = this.firstFormGroup.get('projectName').value;
    //       this.innerProject.city = this.firstFormGroup.get('cities').value;
    //       this.innerProject.cityId = this.firstFormGroup.get('cities').value.cityId;
    //       this.firstFormGroup.get('projectMainPicture').value.map((image, index) => {
    //           this.innerProject.projectImageList.push({
    //             createUserId: this.authService.getDecodedToken().nameid,
    //             fileExtension: image.file.type,
    //             imageId: 0,
    //             imageUrl: '',
    //             name: this.innerProject.projectId + '_' + index.toString(),
    //             project: null,
    //             projectId: this.innerProject.projectId,
    //             size: image.file.size,
    //             thumbnail: image.preview
    //           });
    //         });
    //       this.innerProject.projectDevelopmentStatus = this.firstFormGroup.get('projectDevStatus').value;
    //       this.selectedProjectCategories.map(c =>
    //         this.innerProject.projectCategorySetList.push({
    //           projectCategoryId: c.id,
    //           projectId: this.innerProject.projectId,
    //           project: null,
    //           projectCategory: c,
    //           createUserId: login[0].userId
    //       }));
    //       this.onChangeCallback(this.innerProject);
    //     }
    //   })).subscribe();
  }

  public onSelectProvince() {
    this.firstFormGroup.get('cities').setValue(null, {emitEvent: false});
  }


  writeValue(value: any) {
    if (value !== this.innerProject) {
        this.innerProject = value;
    }
  }


  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }


  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
