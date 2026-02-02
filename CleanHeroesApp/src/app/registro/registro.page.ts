import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonText 
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
    IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonText,
    CommonModule, ReactiveFormsModule, RouterModule // ReactiveFormsModule es clave
  ]
})
export class RegistroPage implements OnInit {
  registroForm: FormGroup;

  constructor() {
    // Centralización de reglas en un esquema (FormGroup)
    this.registroForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      direccion: new FormControl('', [Validators.required]),
      correo: new FormControl('', 
        [Validators.required, Validators.email], 
        [this.validarCorreoAsincrono] // Validación asíncrona con delay
      ),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmarPassword: new FormControl('', [Validators.required])
    }, { validators: this.validarContrasenasIguales }); // Validación cruzada
  }

  ngOnInit() {}

  // Validación Cruzada: Compara contraseñas
  validarContrasenasIguales(control: AbstractControl) {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmarPassword')?.value;
    return pass === confirm ? null : { noCoincide: true };
  }

  // Validación Asíncrona: Simula verificar correo con Debounce/Delay
  validarCorreoAsincrono(control: AbstractControl) {
    const emailInvalido = 'test@test.com';
    return of(control.value).pipe(
      delay(1000), // Simula el tiempo de espera (debounce/network)
      map(email => (email === emailInvalido ? { correoTomado: true } : null))
    );
  }

  enviarRegistro() {
    if (this.registroForm.valid) {
      console.log('Datos válidos:', this.registroForm.value);
    }
  }
}