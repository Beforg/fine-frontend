import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ProdutosComponent } from "../produtos/produtos.component";
import { ServicosComponent } from "../servicos/servicos.component";
import { BarbeirosComponent } from "../barbeiros/barbeiros.component";
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../enums/user-role.enum';
import { MatIconModule } from '@angular/material/icon';
import { DisponibilidadeComponent } from '../disponibilidade/disponibilidade.component';

@Component({
  selector: 'app-gerenciamento',
  imports: [CommonModule, ProdutosComponent, ServicosComponent, BarbeirosComponent, MatIconModule, DisponibilidadeComponent],
  templateUrl: './gerenciamento.component.html',
  styleUrl: './gerenciamento.component.scss'
})
export class GerenciamentoComponent implements OnInit {
  @Input() showGerenciamento: boolean = false;

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    // Lógica a ser executada na inicialização do componente
  }

  showProdutos: boolean = false;
  showBarbeiros: boolean = true;
  showServicos: boolean = false;
  showDisponibilidade: boolean = false;
  // temporario


    isAdmin(): boolean {
      if (this.authService.isAuthenticated()) {
        return this.authService.getCurrentUser().role === UserRole.ADMIN;
      }
      return false;
    }

    toggleTab(barbeiro: boolean, servico: boolean, produto: boolean, disponibilidade: boolean = false): void {
      this.showBarbeiros = barbeiro;
      this.showServicos = servico;
      this.showProdutos = produto;
      this.showDisponibilidade = disponibilidade;
    }

    toggleDisponibilidade(): void {
      this.toggleTab(false, false, false, true);
    }

    toggleProdutos(): void {
      this.toggleTab(false, false, true);
    }

    toggleServicos(): void {
      this.toggleTab(false, true, false);
    }

    toggleBarbeiros(): void {
      this.toggleTab(true, false, false);
    }

}
