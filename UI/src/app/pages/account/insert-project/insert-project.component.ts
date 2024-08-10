import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StepOneComponent } from './step-one/step-one.component';
import { StepTwoComponent } from './step-two/step-two.component';
import { StepThreeComponent } from './step-three/step-three.component';
import { PreviewComponent } from './preview/preview.component';
import { Project } from 'src/app/models/project';
import * as uuid from 'uuid';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-insert-project',
  templateUrl: './insert-project.component.html',
  styleUrls: ['./insert-project.component.css']
})
export class InsertProjectComponent implements OnInit, AfterViewInit {
  project: Project = new Project();
  isLinear = true;
  @ViewChild(StepOneComponent) stepOne: StepOneComponent;
  @ViewChild(StepTwoComponent) stepTwo: StepTwoComponent;
  @ViewChild(StepThreeComponent) stepThree: StepThreeComponent;
  @ViewChild(PreviewComponent) preview: PreviewComponent;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  previewFormGroup: FormGroup;
  insertProjectForm: FormGroup;

  constructor(private fb: FormBuilder,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService) {

                this.project.name = '';
                this.project.projectId = uuid.v4();
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
