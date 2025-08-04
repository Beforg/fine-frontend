import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PerfilCardComponent } from '../perfil-card/perfil-card.component';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, CommonModule, RouterModule, PerfilCardComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private authService: AuthService) {}
  
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  imgHeader: string = '/assets/fine-logo.jpeg';
  mobileMenuOpen: boolean = false;
  perfilCardOpen: boolean = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  togglePerfilCard(): void {
    this.perfilCardOpen = !this.perfilCardOpen;
    // Fechar menu mobile se estiver aberto
    if (this.perfilCardOpen) {
      this.mobileMenuOpen = false;
    }
  }

  closePerfilCard(): void {
    this.perfilCardOpen = false;
  }
}
