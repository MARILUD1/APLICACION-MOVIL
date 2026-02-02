import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// AGREGA IonIcon y IonButton AQUÍ
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router'; // Necesario para el routerLink

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  // ASEGÚRATE DE QUE ESTÉN EN ESTA LISTA TAMBIÉN
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, CommonModule, FormsModule, RouterModule]
})
export class OnboardingPage implements OnInit {
  constructor() { }
  ngOnInit() { }
}