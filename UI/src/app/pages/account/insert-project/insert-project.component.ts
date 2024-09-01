import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { PreviewComponent } from './preview/preview.component';
import { CommonModule } from '@angular/common';

import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';
import { Project } from '../../../models/project';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-insert-project',
  templateUrl: './insert-project.component.html',
  styleUrls: ['./insert-project.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule, MatIconModule, MatStepperModule, MatChipsModule, MatFormFieldModule,  ReactiveFormsModule, StepOneComponent, StepTwoComponent, StepThreeComponent, PreviewComponent],
})
export class InsertProjectComponent implements OnInit, AfterViewInit {
  project: Project = new Project();
  isLinear = true;
  @ViewChild(StepOneComponent)
  stepOne!: StepOneComponent;
  @ViewChild(StepTwoComponent)
  stepTwo!: StepTwoComponent;
  @ViewChild(StepThreeComponent)
  stepThree!: StepThreeComponent;
  @ViewChild(PreviewComponent)
  preview!: PreviewComponent;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  previewFormGroup!: FormGroup;
  insertProjectForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService) {

                this.project.name = '';
                this.project.projectId = ''; // uuid.v4();
      // this.project.createUserId = this.authService.getDecodedToken().nameid;
    }

  ngOnInit() {
    // if (this.authService.loggedIn()) {
    //   this.store.dispatch(new ProjectCategoriesAuthRequest(this.authService.getDecodedToken().nameid));
    //   this.store.dispatch(new RefreshProvinceAuthRequest(this.authService.getDecodedToken().nameid));
    // }
  }
  ngAfterViewInit() {
    this.firstFormGroup = this.stepOne.firstFormGroup;
    this.secondFormGroup = this.stepTwo.secondFormGroup;
    this.thirdFormGroup = this.stepThree.thirdFormGroup;
    this.previewFormGroup = this.preview.previewFormGroup;
    this.cdRef.detectChanges();
  }

}
