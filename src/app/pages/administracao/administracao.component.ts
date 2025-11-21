import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from "../../components/administracao/sidebar/sidebar.component";
import { MainComponent } from "../../components/administracao/main/main.component";
import { UserRole } from '../../enums/user-role.enum';

@Component({
  selector: 'app-administracao',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    SidebarComponent,
    MainComponent
],
  templateUrl: './administracao.component.html',
  styleUrl: './administracao.component.scss'
})
export class AdministracaoComponent implements OnInit {

  showGerenciamento: boolean = false;
  showAgendamentos: boolean = true;

  userName: string = 'Usuário';
  userRole: string = 'ADMIN';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  toggleGerenciamento(): void {
    this.showGerenciamento = true
    // Fechar agendamentos se estiver aberto
    if (this.showAgendamentos) {
      this.showAgendamentos = false;
    }
  }

  toggleAgendamentos(): void {
    this.showAgendamentos = true;
    // Fechar gerenciamento se estiver aberto
    if (this.showGerenciamento) {
      this.showGerenciamento = false;
    }
  }

  loadUserInfo(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userName = currentUser.name;
    this.userRole = currentUser.role;
    
  }

  navigateToGerenciamento(): void {
    this.toggleGerenciamento(); 
  }

  navigateToAgendamentos(): void {
    this.toggleAgendamentos();
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }
}
