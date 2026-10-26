import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Factoría de guards que valida si el usuario cuenta con el rol requerido.
 * @param allowedRole Rol necesario para acceder a la ruta ('admin' | 'user')
 */
export const roleGuard = (allowedRole: string): CanActivateFn => {
  return (route, state): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const currentUser = authService.currentUser();

    // Si no está autenticado, redirigir al login guardando la URL intentada
    if (!authService.isAuthenticated() || !currentUser) {
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    // Si cuenta con el rol requerido, permitir navegación
    if (currentUser.role === allowedRole) {
      return true;
    }

    // Control de acceso granular:
    // Si un usuario con rol 'user' intenta acceder a /admin (u otra ruta no autorizada),
    // se deniega el acceso y se redirige a /user-dashboard.
    if (currentUser.role === 'user') {
      return router.createUrlTree(['/user-dashboard']);
    }

    // Si un admin intenta acceder a una ruta de usuario u otra
    return router.createUrlTree(['/admin']);
  };
};
