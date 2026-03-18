import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  /**
   * Tomar una foto con la cámara
   */
  async takePhoto(): Promise<Photo | null> {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      return photo;
    } catch (error) {
      console.error('Error al tomar foto:', error);
      return null;
    }
  }

  /**
   * Seleccionar una foto de la galería
   */
  async pickPhoto(): Promise<Photo | null> {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });
      return photo;
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
      return null;
    }
  }
}