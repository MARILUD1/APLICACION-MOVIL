import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Interfaz para la respuesta de la API
export interface AirQualityResponse {
  success: boolean;
  location: string;
  timestamp: string;
  data: {
    aqi: number;
    aqiDescription: string;
    aqiColor: string;
    components: {
      co: number;
      no2: number;
      o3: number;
      pm2_5: number;
      pm10: number;
    };
    recommendations: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AirQualityService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la calidad del aire por coordenadas
   */
  getAirQualityByCoords(lat: number, lon: number): Observable<AirQualityResponse> {
    return this.http.get<AirQualityResponse>(`${this.apiUrl}/calidad-aire`, {
      params: { lat: lat.toString(), lon: lon.toString() }
    }).pipe(
      tap(response => console.log('✅ Calidad del aire obtenida:', response)),
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene la calidad del aire por ciudad
   */
  getAirQualityByCity(city: string): Observable<AirQualityResponse> {
    return this.http.get<AirQualityResponse>(`${this.apiUrl}/calidad-aire`, {
      params: { ciudad: city }
    }).pipe(
      tap(response => console.log('✅ Calidad del aire obtenida:', response)),
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error al obtener calidad del aire';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error?.error || `Código: ${error.status}`;
    }
    
    console.error('❌ AirQualityService error:', error);
    return throwError(() => new Error(errorMessage));
  }
}