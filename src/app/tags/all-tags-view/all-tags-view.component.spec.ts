import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTagsViewComponent } from './all-tags-view.component';

describe('AllTagsViewComponent', () => {
  let component: AllTagsViewComponent;
  let fixture: ComponentFixture<AllTagsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTagsViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllTagsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
