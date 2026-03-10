import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AirQualityPage } from './air-quality.page';

describe('AirQualityPage', () => {
  let component: AirQualityPage;
  let fixture: ComponentFixture<AirQualityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AirQualityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
