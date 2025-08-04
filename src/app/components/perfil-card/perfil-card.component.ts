import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil-card',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './perfil-card.component.html',
  styleUrl: './perfil-card.component.scss'
})
export class PerfilCardComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  
  userInfo: {
    name: string;
    email: string;
  } | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      this.userInfo = {
        name: currentUser.name || currentUser.email?.split('@')[0] || 'Usuário',
        email: currentUser.email || 'Email não disponível'
      };
    }
  }

  onGoToProfile(): void {
    console.log('🔀 Navegando para página do perfil...');
    this.router.navigate(['/perfil']);
    this.close.emit();
  }

  onLogout(): void {
    console.log('🚪 Realizando logout...');
    this.authService.logout();
    this.router.navigate(['/home']);
    this.close.emit();
  }

  onCloseCard(): void {
    this.close.emit();
  }
}
