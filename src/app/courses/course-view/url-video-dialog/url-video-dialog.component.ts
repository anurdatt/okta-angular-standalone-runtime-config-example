import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Lesson } from '../../model/lesson';
import { UrlVideoPlayerComponent } from '../../url-course-play/url-video-player.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-url-video-dialog',
  standalone: true,
  imports: [CommonModule, UrlVideoPlayerComponent, MatButtonModule],
  templateUrl: './url-video-dialog.component.html',
  styleUrl: './url-video-dialog.component.scss',
})
export class UrlVideoDialogComponent implements OnInit {
  lessons: Lesson[];
  currentIndex: number = 0;
  constructor(
    public dialogRef: MatDialogRef<UrlVideoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lessons: Lesson[] }
  ) {}

  ngOnInit() {
    if (this.data && this.data.lessons) {
      this.lessons = this.data.lessons;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
