import { Component, OnInit, Input, Output, ChangeDetectorRef, AfterViewInit, forwardRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MaterialFileInputModule  } from 'ngx-material-file-input';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

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
  previewFormGroup: FormGroup;
  constructor(private fb: FormBuilder,
              private projectService: ProjectService,
              private routeService: Router,
              private authService: AuthService) {
    this.previewFormGroup = this.fb.group({
      projectName: ['', Validators.required]
    });
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
