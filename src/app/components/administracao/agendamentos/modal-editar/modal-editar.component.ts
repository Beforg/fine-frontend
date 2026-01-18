import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Barbeiro, ItemProduto, ProdutoAgendamento } from '../../../../interfaces/entities.interface';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { Agendamento } from '../agendamentos.component';
import { ProdutoService } from '../../../../services/produto.service';
import { BarbeiroService } from '../../../../services/barbeiro.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { EditarDadosAgendamentoDTO } from '../../../../services/agendamento.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'agendamentos-modal-editar',
  imports: [
    CommonModule, 
    MatIcon, 
    MatSelectModule, 
    MatFormFieldModule, 
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './modal-editar.component.html',
  styleUrl: './modal-editar.component.scss'
})
export class ModalEditarComponent implements OnInit {
  @Input() agendamento: Agendamento | null = null;
  produtosDisponiveis: ProdutoAgendamento[] = [];
  barbeiros: Barbeiro[] = [];
  @Input() showModal: boolean = false;

  // Eventos
  @Output() fecharModal = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<EditarDadosAgendamentoDTO>();

  // Campos editáveis
  produtosSelecionados: ProdutoAgendamento[] = [];
  barbeiroSelecionadoId: number | null = null;

  constructor(
    private produtoService: ProdutoService, 
    private barbeiroService: BarbeiroService, 
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarBarbeiros();
  }

  handleFecharModal(): void {
    this.fecharModal.emit();
    this.produtosSelecionados = [];
    this.barbeiroSelecionadoId = null;
  }

  handleSalvar(): void {

    if (this.barbeiroSelecionadoId == null) {
      this.notification.error('Selecione um barbeiro para o agendamento.');
      return;
    }

    const itemProdutos: ItemProduto[] = this.produtosSelecionados.map(p => ({
      produtoId: p.id,
      quantidade: p.quantidade
    }));

    this.salvar.emit({
      barbeiroId: this.barbeiroSelecionadoId!,
      produtos: itemProdutos,
      agendamentoId: this.agendamento!.id
    });

    this.barbeiroSelecionadoId = null;
    this.produtosSelecionados = [];
  }

  carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe(produtos => {
      this.produtosDisponiveis = produtos.filter(p => p.ativo === true && p.estoque > 0).map(p => ({
        id: p.id,
        nome: p.nome,
        preco: p.preco,
        quantidade: 0,
        estoque: p.estoque
      }));
    });
  }

  carregarBarbeiros(): void {
    this.barbeiroService.getBarbeiros().subscribe({
      next: (barbeiros) => {
        this.barbeiros = barbeiros.filter(b => b.ativo === true);
      },
      error: (error) => {
        console.error('Erro ao carregar barbeiros:', error);
      }  
    });
  }

  adicionarProduto(produto: ProdutoAgendamento): void {
    const produtoExistente = this.produtosSelecionados.find(p => p.id === produto.id);
    if (produtoExistente) {
      produtoExistente.quantidade++;
    } else {
      this.produtosSelecionados.push({ ...produto, quantidade: 1 });
    }
  }

  removerProduto(index: number): void {
    this.produtosSelecionados.splice(index, 1);
  }

  aumentarQuantidade(index: number): void {
    const produto = this.produtosSelecionados[index];
    if (produto.quantidade < produto.estoque) {
      produto.quantidade++;
    }
  }

  diminuirQuantidade(index: number): void {
    const produto = this.produtosSelecionados[index];
    if (produto.quantidade > 1) {
      produto.quantidade--;
    } else {
      this.removerProduto(index);
    }
  }



}
