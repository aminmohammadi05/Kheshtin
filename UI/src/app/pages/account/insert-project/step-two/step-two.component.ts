import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, forwardRef, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Project } from '../../../../models/project';

const noop = () => {
};

export const STEP_TWO_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StepTwoComponent),
    multi: true
};

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.css'],
  providers: [STEP_TWO_CONTROL_VALUE_ACCESSOR],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatSelectModule],
})
export class StepTwoComponent implements OnInit, ControlValueAccessor {
  private innerProject = new Project();
  projectDesc!: string;

  secondFormGroup: FormGroup;
  private fb = inject(FormBuilder);
  constructor() {
    this.secondFormGroup = this.fb.group({
      projectDescription: ['', Validators.required]
    });
  }
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  ngOnInit() {
  }

  addDataToProject() {
    this.innerProject.description = this.secondFormGroup.get('projectDescription')!.value;
    this.onChangeCallback(this.innerProject);
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
