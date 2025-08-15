import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ProdutosComponent } from "../produtos/produtos.component";
import { ServicosComponent } from "../servicos/servicos.component";
import { BarbeirosComponent } from "../barbeiros/barbeiros.component";
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../enums/user-role.enum';

@Component({
  selector: 'app-gerenciamento',
  imports: [CommonModule, ProdutosComponent, ServicosComponent, BarbeirosComponent],
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
  // temporario
  toggleProdutos() {
    this.showProdutos = !this.showProdutos;
  }

  toggleBarbeiros() {
    this.showBarbeiros = !this.showBarbeiros;
  }

  toggleServicos() {
    this.showServicos = !this.showServicos;
  }

    isAdmin(): boolean {
      if (this.authService.isAuthenticated()) {
        return this.authService.getCurrentUser().role === UserRole.ADMIN;
      }
      return false;
    }

}
