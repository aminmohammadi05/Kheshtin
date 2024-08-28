import { Component, OnInit, Input, Output, ChangeDetectorRef, AfterViewInit, forwardRef, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialFileInputModule  } from 'ngx-material-file-input';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { fn } from 'jalali-moment';
import { Project } from '../../../../models/project';
import { AuthService } from '../../../../services/auth.service';
import { ProjectService } from '../../../../services/project.service';

const noop = () => {
};

export const PREVIEW_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PreviewComponent),
    multi: true
};

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
  providers: [PREVIEW_CONTROL_VALUE_ACCESSOR],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatGridListModule,MatChipsModule, MatListModule, MatCardModule, MatFormFieldModule, MaterialFileInputModule],
})
export class PreviewComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  private innerProject = new Project();
  get project(): Project {
    return this.innerProject;
  }


  set project(v: Project) {
    if (v !== this.innerProject) {
      this.innerProject = v;
      this.onChangeCallback(v);
    }
  }
  previewFormGroup!: FormGroup;
  private fb = inject( FormBuilder);
              private projectService = inject( ProjectService);
              private routeService = inject( Router);
              private authService = inject( AuthService);
  constructor() {
    // this.previewFormGroup = this.fb.group({
    //   projectName: [''], Validators.required
    // });
  }
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  ngOnInit() {
  }

  ngAfterViewInit() {
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

  saveProject() {
    this.project.projectImageList.map(x => {
      x.projectId = this.project.projectId;
    });
    this.projectService.addProject(this.project).subscribe(p => {
      this.routeService.navigate(['/account/my-projects']);
    });
  }
}
