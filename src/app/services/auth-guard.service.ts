import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private notificationService: NotificationService) { }

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true;
    } else {
      this.notificationService.error('Você não tem permissão para acessar esta área.');
      this.router.navigate(['/home']);
      return false;
    }
  }
}
