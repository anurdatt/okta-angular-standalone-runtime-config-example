import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePlayComponent } from './course-play.component';

describe('CoursePlayComponent', () => {
  let component: CoursePlayComponent;
  let fixture: ComponentFixture<CoursePlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
