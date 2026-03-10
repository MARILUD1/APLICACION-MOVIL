import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingBenefitsPage } from './onboarding-benefits.page';

describe('OnboardingBenefitsPage', () => {
  let component: OnboardingBenefitsPage;
  let fixture: ComponentFixture<OnboardingBenefitsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingBenefitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
