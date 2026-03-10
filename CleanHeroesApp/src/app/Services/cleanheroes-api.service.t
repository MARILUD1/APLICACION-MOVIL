// src/app/services/cleanheroes-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CleanheroesApiService {
  // 🔗 URL del backend
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // 🔍 Health check
  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/../health`);
  }

  // ♻️ Obtener materiales
  getMateriales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reciclaje/materiales`);
  }

  // 📝 Registrar reciclaje
  registrarReciclaje(reciclajeData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/reciclaje/registrar`, reciclajeData, { headers });
  }

  // 📜 Historial de usuario
  getHistorial(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reciclaje/historial/${userId}`);
  }

  // 🌤️ Calidad del aire
  getCalidadAire(ciudad: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/calidad-aire?ciudad=${ciudad}`);
  }
}