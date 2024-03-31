import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  AfterViewInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

import jsonDoc from './ngxeditor-jsondoc';
import schema from './ngxeditor-schema';
import nodeViews from './ngxeditor-nodeviews';
import { CustomMenuComponent } from './ngxeditor-cm-menu';
// import moduleName from 'module'

@Component({
  selector: 'app-ngxeditor',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    NgxEditorModule,
    CustomMenuComponent,
  ],
  templateUrl: './ngxeditor.component.html',
  styleUrl: './ngxeditor.component.css',
})
export class NgxeditorComponent implements OnInit, OnDestroy, AfterViewInit {
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  @Input('content')
  content!: string | undefined;

  form = new FormGroup({
    editorContent: new FormControl({
      value: this.content == undefined ? null : JSON.parse(this.content), //this.content != '' ? this.content : jsonDoc,
      disabled: false,
    }),
  });

  get doc(): any {
    return this.form.get('editorContent').getRawValue();
  }

  set doc(doc) {
    this.form.setValue({ editorContent: doc });
  }

  ngOnInit(): void {
    if (this.content == undefined)
      this.content = '{"type": "doc", "content": []}';
    this.content = this.content.replaceAll('\\\\n', '\\n');
    console.log({ content: this.content });
    console.log({ jsonContent: JSON.parse(this.content) });
    console.log({ jsonDoc });
    console.log({ doc: this.doc });
    if (this.doc == null && this.content != undefined)
      this.doc = JSON.parse(this.content);

    this.editor = new Editor({
      schema,
      nodeViews,
    });
  }

  ngAfterViewInit(): void {
    // console.log({ content: this.content });
    // console.log({ jsonContent: JSON.parse(this.content) });
    // console.log({ jsonDoc });
    // console.log({ doc: this.doc });
    // if (this.doc == null && this.content != undefined)
    //   this.doc = JSON.parse(this.content);
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
