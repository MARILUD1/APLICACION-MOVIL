import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingPermissionsPage } from './onboarding-permissions.page';

describe('OnboardingPermissionsPage', () => {
  let component: OnboardingPermissionsPage;
  let fixture: ComponentFixture<OnboardingPermissionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingPermissionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
