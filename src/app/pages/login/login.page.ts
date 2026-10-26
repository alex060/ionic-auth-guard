import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard,
  IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton, IonText, IonNote
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonCard,
    IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonButton, IonText, IonNote
  ]
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public username = '';
  public password = '';
  public errorMessage = '';

  public handleLogin(): void {
    this.errorMessage = '';
    const success = this.authService.login(this.username, this.password);
    if (success) {
      const user = this.authService.currentUser();
      const returnUrl = this.route.snapshot.queryParams['returnUrl'];

      if (user?.role === 'admin') {
        if (returnUrl && !returnUrl.includes('user-dashboard')) {
          this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigate(['/admin']);
        }
      } else if (user?.role === 'user') {
        if (returnUrl && !returnUrl.includes('admin')) {
          this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      }
    } else {
      this.errorMessage = 'Credenciales no autorizadas. Use admin / 123 u operador / 123';
    }
  }
}
