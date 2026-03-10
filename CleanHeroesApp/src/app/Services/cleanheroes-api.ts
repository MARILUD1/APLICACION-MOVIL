// src/app/services/cleanheroes-api.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CleanheroesApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  healthCheck(): Observable<any> {
    return this.http.get(`${this.apiUrl}/../health`);
  }

  getMateriales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reciclaje/materiales`);
  }

  registrarReciclaje(reciclajeData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/reciclaje/registrar`, reciclajeData, { headers });
  }

  getHistorial(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reciclaje/historial/${userId}`);
  }

  getCalidadAire(ciudad: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/calidad-aire?ciudad=${ciudad}`);
  }
}