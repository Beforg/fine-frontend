import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PerfilService } from '../../services/perfil.service';
import { FidelidadeDTO, UserInfo } from '../../interfaces/entities.interface';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../enums/user-role.enum';
import { PerfilFormComponent } from "../../components/perfil/perfil-form/perfil-form.component";
import { BarberStatsComponent } from "../../components/perfil/barber-stats/barber-stats.component";
import { AgendamentosComponent } from "../../components/administracao/agendamentos/agendamentos.component";

@Component({
  selector: 'app-perfil',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    HeaderComponent,
    FooterComponent,
    PerfilFormComponent,
    BarberStatsComponent,
    AgendamentosComponent
],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {

  userInfo: UserInfo | null = null;
  activeTab: string = 'p'; // 'p' para perfil, 'g' para agendamentos
  showAgendamentoContainer: boolean = false;

  constructor(private perfilService: PerfilService, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.getUserInfos();
  }

  getUserInfos(): void {
    this.perfilService.getUserInfos().subscribe({
      next: (userInfo) => {
        this.userInfo = userInfo;
        console.log('Informações do usuário carregadas:', userInfo);
      },
      error: (error) => {
        console.error('Erro ao carregar informações do usuário:', error);
        // Usar dados do token como fallback
        const userData = this.authService.getCurrentUser();
        if (userData) {
          let fidelidade: FidelidadeDTO = {
            validade: 'N/A',
            sequencia: 0,
            fidelidadeAplicada: false 
          }
          this.userInfo = {
            nome: userData.name || userData.email || 'Usuário',
            telefone: '', // Dados não disponíveis no token
            dataCadastro: 'N/A', // Dados não disponíveis no token
            fidelidade: fidelidade
          };
        }
      }
    });
  }

  isBarber(): boolean {
    return this.authService.getCurrentUser()?.role === UserRole.BARBEIRO;
  }

  getUserRole(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.role : '';
  }

  getUserEmail(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.email : '';
  }

  getRoleName(): string {
    const user = this.authService.getCurrentUser();
    if (!user || !user.role) return 'Usuário';
    
    switch (user.role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.BARBEIRO:
        return 'Barbeiro';
      case UserRole.CLIENTE:
        return 'Cliente';
      default:
        return 'Usuário';
    }
  }

  isBarbeiro(): boolean {
    return this.isBarber();
  }

  goBack(): void {
    window.history.back();  
  } 

  toggleAgendamentos(option: string): void {
    this.activeTab = option;
    
    if (option === 'g') {
      this.showAgendamentoContainer = true;
    } else {
      this.showAgendamentoContainer = false;
    }
    
    console.log('Active tab:', this.activeTab); // Debug
  }
}
