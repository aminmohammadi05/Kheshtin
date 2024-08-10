import { Component, OnInit, Input, Output, forwardRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { Project } from 'src/app/models/project';

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
  providers: [STEP_TWO_CONTROL_VALUE_ACCESSOR]
})
export class StepTwoComponent implements OnInit, ControlValueAccessor {
  private innerProject = new Project();
  projectDesc: string;

  secondFormGroup: FormGroup;
  constructor(private fb: FormBuilder) {
    this.secondFormGroup = this.fb.group({
      projectDescription: ['', Validators.required]
    });
  }
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  ngOnInit() {
  }

  addDataToProject() {
    this.innerProject.description = this.secondFormGroup.get('projectDescription').value;
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
