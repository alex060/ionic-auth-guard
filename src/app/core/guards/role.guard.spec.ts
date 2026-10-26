import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard Factory', () => {
  let authService: AuthService;
  let router: Router;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockStateAdmin = { url: '/admin' } as RouterStateSnapshot;
  const mockStateUser = { url: '/user-dashboard' } as RouterStateSnapshot;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([])
      ]
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('debe redirigir a /login si no hay usuario autenticado', () => {
    const guard = roleGuard('admin');
    const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockStateAdmin));

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toContain('/login?returnUrl=%2Fadmin');
  });

  it('debe permitir acceso al admin si el rol requerido es admin', () => {
    authService.login('admin', '123');
    const guard = roleGuard('admin');
    const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockStateAdmin));

    expect(result).toBe(true);
  });

  it('debe permitir acceso al operador si el rol requerido es user', () => {
    authService.login('operador', '123');
    const guard = roleGuard('user');
    const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockStateUser));

    expect(result).toBe(true);
  });

  it('debe denegar acceso y redirigir a /user-dashboard si un operador (rol user) intenta entrar a /admin', () => {
    authService.login('operador', '123');
    const guard = roleGuard('admin');
    const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockStateAdmin));

    expect(result instanceof UrlTree).toBe(true);
    const tree = result as UrlTree;
    expect(router.serializeUrl(tree)).toBe('/user-dashboard');
  });
});
