import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
  IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonText,
  IonLabel, IonSelect, IonSelectOption, AlertController 
  // ✅ IonIcon YA NO ES NECESARIO (usamos SVG inline en el HTML)
} from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { registroSchema, RegistroFormData } from '../core/validators/auth.schema';
import { z } from 'zod';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, 
    IonGrid, IonRow, IonCol, IonList, IonItem, IonInput, IonText,
    IonLabel, IonSelect, IonSelectOption,
    // ✅ IonIcon YA NO ES NECESARIO aquí tampoco
    CommonModule, ReactiveFormsModule, RouterModule
  ]
})
export class RegistroPage {
  registroForm: FormGroup;
  private alertController = inject(AlertController);
  private router = inject(Router);

  constructor() {
    this.registroForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      direccion: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      rol: new FormControl('ciudadano', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmarPassword: new FormControl('', [Validators.required])
    }, { validators: this.validarContrasenasIguales });

    // Debounce para validación asíncrona de correo con RxJS
    this.registroForm.get('correo')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((email) => this.validarCorreoAsincronoRxJS(email))
    ).subscribe();
  }

  // Validación Cruzada: Compara contraseñas
  validarContrasenasIguales(control: AbstractControl) {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmarPassword')?.value;
    return pass === confirm ? null : { noCoincide: true };
  }

  // Validación Asíncrona: Verifica si el correo ya existe (con debounce)
  private validarCorreoAsincronoRxJS(email: string) {
    const correosExistentes = ['test@test.com', 'admin@cleanheroes.com'];
    
    if (!email || !email.includes('@')) {
      return of(null);
    }
    
    return of(correosExistentes.includes(email.toLowerCase())).pipe(
      switchMap((existe) => {
        if (existe) {
          this.registroForm.get('correo')?.setErrors({ correoTomado: true });
        }
        return of(null);
      })
    );
  }

  // Método principal para enviar el formulario
  async enviarRegistro() {
    // 🔹 Marcar todos los campos como tocados para mostrar errores
    if (this.registroForm.invalid) {
      Object.keys(this.registroForm.controls).forEach(key => {
        this.registroForm.get(key)?.markAsTouched();
      });
      this.enfocarPrimerError();
      return;
    }

    // 🔹 Validar con Zod antes de enviar
    try {
      const datosValidados = registroSchema.parse(this.registroForm.value);
      console.log('✅ Datos válidos con Zod:', datosValidados);
      
      // TODO: Aquí iría la llamada real al backend
      // this.authService.register(datosValidados).subscribe(...)
      
      // Mostrar alerta de éxito
      const alert = await this.alertController.create({
        header: 'Registro Exitoso',
        message: 'Bienvenido a CleanHeroes Lite',
        buttons: [{
          text: 'OK',
          handler: () => {
            // Redirigir a login después del registro
            this.router.navigate(['/login']);
          }
        }],
      });
      await alert.present();
      
    } catch (error) {
      // 🔹 Manejar errores de validación de Zod
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          const campo = issue.path[0] as string;
          // Establecer el error en el FormControl correspondiente
          this.registroForm.get(campo)?.setErrors({ zod: issue.message });
          this.registroForm.get(campo)?.markAsTouched();
        });
        // Enfocar el primer campo con error
        this.enfocarPrimerError();
      }
    }
  }

  // Función para enfocar el primer campo con error (accesibilidad WCAG 2.2)
  private enfocarPrimerError() {
    setTimeout(() => {
      const campos = ['nombre', 'correo', 'direccion', 'rol', 'password', 'confirmarPassword'];
      
      for (const campo of campos) {
        const control = this.registroForm.get(campo);
        if (control?.invalid && control?.touched) {
          const input = document.querySelector(`[formcontrolname="${campo}"]`) as HTMLElement;
          if (input) {
            input.focus();
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          break; // Solo enfocar el primer error
        }
      }
    }, 100);
  }
}