// src/app/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// ✅ Importar componentes de Ionic que necesites
import { 
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonText
} from '@ionic/angular/standalone';

import { CleanheroesApiService } from '../Services/cleanheroes-api';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [
    CommonModule,
    // ← ← ← Agregar componentes de Ionic que uses en el HTML
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonText
  ]
})
export class HomePage implements OnInit {
  userName: string = 'Heroe';
  mensaje: string = 'Conectando...';
  materiales: any[] = [];
  clima: any = null;

  constructor(
    private router: Router,
    private apiService: CleanheroesApiService
  ) {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.nombre || 'Heroe';
    }
  }

  async ngOnInit() {
    await this.probarConexion();
  }

  async probarConexion() {
    try {
      const health = await this.apiService.healthCheck().toPromise();
      console.log('✅ Health:', health);

      const materialesResp = await this.apiService.getMateriales().toPromise();
      this.materiales = materialesResp.materiales || [];
      console.log('✅ Materiales:', this.materiales);

      const climaResp = await this.apiService.getCalidadAire('Yantzaza').toPromise();
      this.clima = climaResp;
      console.log('✅ Clima:', this.clima);

      this.mensaje = '✅ ¡Conexión exitosa!';
    } catch (error: any) {
      console.error('❌ Error:', error);
      this.mensaje = '❌ Error: ' + (error?.message || 'Conexión fallida');
    }
  }

  async registrarReciclajePrueba() {
    try {
      const data = {
        userId: 1,
        materiales: [
          { tipo: 'botella_pet', cantidad: 2.5, unidad: 'kg' }
        ],
        ubicacion: { lat: -4.0667, lon: -78.1167 }
      };

      const resp = await this.apiService.registrarReciclaje(data).toPromise();
      console.log('✅ Registrado:', resp);
      alert('♻️ ¡Reciclaje registrado!');
      await this.probarConexion();
    } catch (error: any) {
      console.error('❌ Error:', error);
      alert('Error: ' + (error?.message || 'No se pudo registrar'));
    }
  }

  goToAirQuality() {
    this.router.navigate(['/air-quality']);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/onboarding']);
  }
}