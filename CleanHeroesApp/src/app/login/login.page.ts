import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonText, AlertController 
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
    IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonText,
    CommonModule, ReactiveFormsModule, RouterModule // Importante para las validaciones
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private alertController: AlertController) {
    // Centralización de reglas para el inicio de sesión
    this.loginForm = new FormGroup({
      correo: new FormControl('', [
        Validators.required, 
        Validators.email // Restricción de formato de correo
      ]),
      password: new FormControl('', [
        Validators.required, 
        Validators.minLength(8) // Restricción de longitud mínima
      ])
    });
  }

  ngOnInit() {}

  async ingresar() {
    if (this.loginForm.valid) {
      const alert = await this.alertController.create({
        header: 'Acceso Concedido',
        message: 'Bienvenido nuevamente a CleanHeroes Lite',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}