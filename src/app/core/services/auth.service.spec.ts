import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const STORAGE_KEY = 'DAM2_AUTH_SESSION';

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe iniciar inicialmente como no autenticado si no hay datos en sessionStorage', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('debe autenticar correctamente al administrador (admin / 123)', () => {
    const success = service.login('admin', '123');
    expect(success).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()).toEqual({
      username: 'admin',
      role: 'admin',
      isAuthenticated: true
    });

    const stored = sessionStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual({
      username: 'admin',
      role: 'admin',
      isAuthenticated: true
    });
  });

  it('debe autenticar correctamente al operador (operador / 123) con rol user', () => {
    const success = service.login('operador', '123');
    expect(success).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()).toEqual({
      username: 'operador',
      role: 'user',
      isAuthenticated: true
    });

    const stored = sessionStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual({
      username: 'operador',
      role: 'user',
      isAuthenticated: true
    });
  });

  it('debe rechazar credenciales incorrectas', () => {
    const success = service.login('desconocido', 'passwordInvalida');
    expect(success).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('debe destruir la sesión en memoria y sessionStorage al invocar logout()', () => {
    service.login('admin', '123');
    expect(service.isAuthenticated()).toBe(true);
    expect(sessionStorage.getItem(STORAGE_KEY)).not.toBeNull();

    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('debe restaurar la sesión desde sessionStorage al inicializarse', () => {
    const sessionData = {
      username: 'admin',
      role: 'admin' as const,
      isAuthenticated: true
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));

    // Forzar nueva instancia para comprobar lectura al inicio
    const newService = new AuthService();
    expect(newService.isAuthenticated()).toBe(true);
    expect(newService.currentUser()).toEqual(sessionData);
  });
});
