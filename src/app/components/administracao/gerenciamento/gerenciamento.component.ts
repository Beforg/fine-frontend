import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProdutosComponent } from "../produtos/produtos.component";
import { ServicosComponent } from "../servicos/servicos.component";
import { BarbeirosComponent } from "../barbeiros/barbeiros.component";

@Component({
  selector: 'app-gerenciamento',
  imports: [CommonModule, ProdutosComponent, ServicosComponent, BarbeirosComponent],
  templateUrl: './gerenciamento.component.html',
  styleUrl: './gerenciamento.component.scss'
})
export class GerenciamentoComponent {
  @Input() showGerenciamento: boolean = false;

  showProdutos: boolean = true;
  showBarbeiros: boolean = false;
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
}
