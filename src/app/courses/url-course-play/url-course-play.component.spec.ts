import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlCoursePlayComponent } from './url-course-play.component';

describe('CoursePlayComponent', () => {
  let component: UrlCoursePlayComponent;
  let fixture: ComponentFixture<UrlCoursePlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlCoursePlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UrlCoursePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
