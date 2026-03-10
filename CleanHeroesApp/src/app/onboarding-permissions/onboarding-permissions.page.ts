import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonIcon, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel 
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-onboarding-permissions',
  templateUrl: './onboarding-permissions.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
    IonIcon, IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel,
    CommonModule, FormsModule, RouterModule
  ]
})
export class OnboardingPermissionsPage {
  onFinish() {
    // TODO: Marcar onboarding como completado en localStorage
    localStorage.setItem('onboarding_completed', 'true');
    console.log('Onboarding completado - Redirigiendo a registro');
  }
}