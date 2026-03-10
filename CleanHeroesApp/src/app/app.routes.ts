import { Routes } from '@angular/router';
// import { authGuard } from './core/guards/auth.guard'; // Descomentar cuando crees el guard

export const routes: Routes = [
  // 🔹 Redirección inicial: raíz → onboarding
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full',
  },

  // 🔹 Onboarding Flow (agrupado)
  {
    path: 'onboarding',
    loadComponent: () => import('./onboarding/onboarding.page').then(m => m.OnboardingPage)
  },
  {
    path: 'onboarding-benefits',
    loadComponent: () => import('./onboarding-benefits/onboarding-benefits.page').then(m => m.OnboardingBenefitsPage)
  },
  {
    path: 'onboarding-permissions',
    loadComponent: () => import('./onboarding-permissions/onboarding-permissions.page').then(m => m.OnboardingPermissionsPage)
  },

  // 🔹 Auth Flow
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },

  // 🔹 Protected Routes
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
    // canActivate: [authGuard]  // Descomentar cuando tengas el Auth Guard
  },

  // 🔹 Ruta por defecto para URLs no encontradas (404)
  {
  path: '',
  redirectTo: 'home',  // ← Cambia 'onboarding' por 'home'
  pathMatch: 'full'
},
  {
    path: 'air-quality',
    loadComponent: () => import('./pages/air-quality/air-quality.page').then( m => m.AirQualityPage)

  }
  
];