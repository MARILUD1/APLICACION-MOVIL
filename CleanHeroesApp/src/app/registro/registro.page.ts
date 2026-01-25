import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonList, 
  IonItem, 
  IonInput, 
  IonSelect, 
  IonSelectOption, 
  IonButton 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonList, 
    IonItem, 
    IonInput, 
    IonSelect, 
    IonSelectOption, 
    IonButton, 
    CommonModule, 
    FormsModule
  ]
})
export class RegistroPage implements OnInit {

  constructor() { }

  ngOnInit() { }

  // Esta es la función que corregimos para el botón
  ejecutarRegistro() {
    console.log('Botón presionado: Registrando usuario...');
    alert('Registro exitoso (Simulado)');
  }

}