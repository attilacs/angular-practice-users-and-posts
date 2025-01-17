import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsEditComponent } from './posts-edit.component';

describe('PostsEditComponent', () => {
  let component: PostsEditComponent;
  let fixture: ComponentFixture<PostsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsEditComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PostsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
