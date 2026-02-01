import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as yup from 'yup'; // Importamos Yup para las validaciones
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, 
  IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonText 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, 
    IonItem, IonInput, IonSelect, IonSelectOption, IonButton, 
    IonText, CommonModule, FormsModule
  ]
})
export class RegistroPage implements OnInit {

  // 1. Objeto para capturar los datos del formulario
  datos = {
    nombre: '',
    email: '',
    rol: '',
    password: '',
    confirmar: ''
  };

  // 2. Objeto para almacenar mensajes de error y mostrarlos en el HTML
  errores: any = {};

  // 3. Definición del Esquema de Validación (Punto c de la guía)
  esquemaRegistro = yup.object().shape({
    nombre: yup.string().required('El nombre es obligatorio'),
    email: yup.string().email('Formato de correo inválido').required('El correo es requerido'),
    rol: yup.string().required('Debes seleccionar un rol'),
    password: yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('Contraseña obligatoria'),
    confirmar: yup.string()
      .oneOf([yup.ref('password')], 'Las contraseñas no coinciden') // Validación cruzada
      .required('Confirma tu contraseña')
  });

  constructor() { }

  ngOnInit() { }

  // 4. Función de Registro con validación robusta (Punto d)
  async ejecutarRegistro() {
    try {
      this.errores = {}; // Limpiamos errores anteriores
      
      // Validamos todos los campos a la vez
      await this.esquemaRegistro.validate(this.datos, { abortEarly: false });
      
      // Si pasa la validación:
      console.log('Datos válidos:', this.datos);
      alert('¡Registro exitoso en CleanHeroes!');
      
    } catch (err: any) {
      // Si hay errores, los capturamos para el feedback accesible
      err.inner.forEach((e: any) => {
        this.errores[e.path] = e.message;
      });
      console.log('Errores encontrados:', this.errores);
    }
  }
}