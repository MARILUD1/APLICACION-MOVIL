import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { 
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonButton, IonText,
  IonImg, IonButtons
} from '@ionic/angular/standalone';

import { CleanheroesApiService } from '../Services/cleanheroes-api';
import { CameraService } from '../Services/camera.service';
import { Photo } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonButton, IonText,
    IonImg, IonButtons
  ]
})
export class HomePage implements OnInit {
  userName: string = 'Heroe';
  mensaje: string = 'Conectando...';
  materiales: any[] = [];
  clima: any = null;
  fotoReciente: string | null = null;
  cargandoFoto: boolean = false;

  constructor(
    private router: Router,
    private apiService: CleanheroesApiService,
    private cameraService: CameraService
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
      const materialesResp = await this.apiService.getMateriales().toPromise();
      this.materiales = materialesResp.materiales || [];
      const climaResp = await this.apiService.getCalidadAire('Yantzaza').toPromise();
      this.clima = climaResp;
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
        materiales: [{ tipo: 'botella_pet', cantidad: 2.5, unidad: 'kg' }],
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

  async tomarFotoReciclaje() {
    this.cargandoFoto = true;
    this.mensaje = '📸 Abriendo cámara...';
    
    try {
      const photo = await this.cameraService.takePhoto();
      if (photo && photo.webPath) {
        this.fotoReciente = photo.webPath;
        this.mensaje = '✅ ¡Foto tomada!';
        await this.registrarReciclajeConFoto(photo.webPath);
      } else {
        this.mensaje = '❌ No se tomó la foto';
      }
    } catch (error: any) {
      console.error('❌ Error:', error);
      this.mensaje = '❌ Error: ' + (error?.message || 'Cámara fallida');
    } finally {
      this.cargandoFoto = false;
    }
  }

  async registrarReciclajeConFoto(fotoPath: string) {
    try {
      const data = {
        userId: 1,
        materiales: [{ tipo: 'botella_pet', cantidad: 1.0, unidad: 'kg', foto: fotoPath }],
        ubicacion: { lat: -4.0667, lon: -78.1167 },
        fotoUrl: fotoPath
      };
      const resp = await this.apiService.registrarReciclaje(data).toPromise();
      console.log('✅ Reciclaje con foto registrado:', resp);
    } catch (error: any) {
      console.error('❌ Error registrando con foto:', error);
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