import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirQualityService } from '../../core/services/air-quality';

@Component({
  selector: 'app-air-quality',
  templateUrl: './air-quality.page.html',
  standalone: true,
  imports: [CommonModule],
  schemas: [NO_ERRORS_SCHEMA]  // ← Usa NO_ERRORS_SCHEMA (más permisivo)
})
export class AirQualityPage implements OnInit {
  loading = false;
  airQuality: any = null;
  error: string | null = null;

  constructor(private airQualityService: AirQualityService) {}

  ngOnInit() {
    this.loadAirQuality();
  }

  loadAirQuality() {
    this.loading = true;
    this.error = null;
    
    this.airQualityService.getAirQualityByCoords(-4.0833, -78.1333).subscribe({
      next: (data) => {
        this.airQuality = data;
        this.loading = false;
        console.log('✅ Datos cargados:', data);
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
        console.error('❌ Error:', err);
      }
    });
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.loadAirQuality();
      event.target.complete();
    }, 1000);
  }
}