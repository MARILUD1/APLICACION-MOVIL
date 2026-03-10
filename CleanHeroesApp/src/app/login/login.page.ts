import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonText, AlertController 
} from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';  // ← Agregar Router

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
    IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonText,
    CommonModule, ReactiveFormsModule, RouterModule
  ]
})
export class LoginPage {
  loginForm: FormGroup;
  
  // Inyectar dependencias
  private alertController = inject(AlertController);
  private router = inject(Router);  // ← Agregar Router

  constructor() {
    this.loginForm = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  async ingresar() {
    if (this.loginForm.valid) {
      // Guardar usuario en localStorage (para que el home muestre el nombre)
      localStorage.setItem('user', JSON.stringify({
        email: this.loginForm.value.correo,
        nombre: this.loginForm.value.correo.split('@')[0]
      }));

      const alert = await this.alertController.create({
        header: 'Acceso Concedido',
        message: 'Bienvenido nuevamente a CleanHeroes Lite',
        buttons: [{
          text: 'OK',
          handler: () => {
            // ← Navegar al home DESPUÉS de cerrar el alert
            this.router.navigate(['/home']);
          }
        }],
      });
      await alert.present();
    } else {
      // Mostrar error si el formulario no es válido
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor ingresa un correo y contraseña válidos',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}