import { Component, OnInit, Inject, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';


import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { UserMoodBoard } from 'src/app/models/user-moodboard';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
interface UserMoodBoardDialogData {
  userMoodBoard: UserMoodBoard;
  action?: string;
}
@Component({
  selector: 'app-mood-board-extra-info',
  templateUrl: './mood-board-extra-info-dialog.component.html',
  styleUrls: ['./mood-board-extra-info-dialog.component.scss']
})
export class MoodBoardExtraInfoComponent implements OnInit, AfterViewInit {
  tags: string[] = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  keywordList = '';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  userMoodBoard: UserMoodBoard;
  dialogTitle: string;
  moodBoardExtraInfoForm: FormGroup;
  action: string;
  constructor(
    public dialogRef: MatDialogRef<MoodBoardExtraInfoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: UserMoodBoardDialogData,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.userMoodBoard = data.userMoodBoard;
    this.action = data.action;
  }
  
  ngOnInit() {
    this.moodBoardExtraInfoForm = this.formBuilder.group({
      moodBoardName: new FormControl(this.userMoodBoard.moodBoardName),
      moodBoardDescription: new FormControl(this.userMoodBoard.moodBoardDescription)
    });
  }
  ngAfterViewInit() {
   
  }
save() {
  this.userMoodBoard.moodBoardName = this.moodBoardExtraInfoForm.get('moodBoardName').value;
  this.userMoodBoard.moodBoardDescription = this.moodBoardExtraInfoForm.get('moodBoardDescription').value;
  this.dialogRef.close({action: 'save', userMoodBoard: this.userMoodBoard});
}

close() {
  this.dialogRef.close({action: 'delete'});
}
}

