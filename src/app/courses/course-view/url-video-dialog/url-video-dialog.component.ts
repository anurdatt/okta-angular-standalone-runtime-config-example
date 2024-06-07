import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Lesson } from '../../model/lesson';
import { UrlVideoPlayerComponent } from '../../url-course-play/url-video-player.component';

@Component({
  selector: 'app-url-video-dialog',
  standalone: true,
  imports: [UrlVideoPlayerComponent],
  templateUrl: './url-video-dialog.component.html',
  styleUrl: './url-video-dialog.component.scss'
})
export class UrlVideoDialogComponent implements OnInit {

  selectedLesson: Lesson;
  constructor(public dialogRef: MatDialogRef<UrlVideoDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: { lessons: Lesson[] }
  ) {}

  ngOnInit() {
    if (this.data && this.data.lessons) {
      this.selectedLesson = this.data.lessons[0];
    }

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
