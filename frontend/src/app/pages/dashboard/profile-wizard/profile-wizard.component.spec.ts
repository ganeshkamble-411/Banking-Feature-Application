import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileWizardComponent } from './profile-wizard.component';

describe('ProfileWizardComponent', () => {
  let component: UserProfileWizardComponent;
  let fixture: ComponentFixture<UserProfileWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileWizardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileWizardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
